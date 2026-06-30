import Task from "../models/Task.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Meeting from "../models/Meeting.js";

// @desc    Get all tasks visible to the logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
    try {
        let query;

        if (req.user.role === "admin") {
            const orClauses = [{ user: req.user._id }];
            if (req.user.community) {
                orClauses.push({ community: req.user.community, isPersonal: false });
            }
            query = { $or: orClauses };

            // Privacy Rule: Admin should not view private tasks belonging to meetings conducted exclusively between two other members.
            if (req.user.community) {
                const communityUsers = await User.find({ community: req.user.community }).select("_id");
                const communityUserIds = communityUsers.map((u) => u._id);

                const privateMeetings = await Meeting.find({
                    host: { $in: communityUserIds, $ne: req.user._id },
                    participants: { $size: 1 },
                    "participants.email": { $ne: req.user.email },
                }).select("_id");

                if (privateMeetings.length > 0) {
                    const privateMeetingIds = privateMeetings.map((m) => m._id);
                    query.meeting = { $nin: privateMeetingIds };
                }
            }
        } else {
            // Non-admin members should only see their own assigned tasks
            query = { user: req.user._id };
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        // Never trust the frontend for ownership fields — always derive from req.user
        const {
            title, description, priority, status,
            assignee, avatarColor, due, dueDate, dueTime, source,
            assigneeIds,
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        const isAdmin = req.user.role === "admin";

        let targetUserIds = [];
        if (isAdmin && assigneeIds && Array.isArray(assigneeIds) && assigneeIds.length > 0) {
            targetUserIds = assigneeIds;
        } else {
            targetUserIds = [req.user._id];
        }

        const createdTasks = [];
        for (const targetUserId of targetUserIds) {
            const targetUser = await User.findById(targetUserId);
            const assigneeName = targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : (assignee || "Alex Chen");

            const task = await Task.create({
                user: targetUserId,
                community: req.user.community || null,
                createdBy: req.user._id,
                isPersonal: !isAdmin,
                title,
                description: description || "No description provided.",
                priority: priority || "MEDIUM PRIORITY",
                status: status || "todo",
                assignee: assigneeName,
                avatarColor: avatarColor || "bg-primary",
                due: due || "TBD",
                dueDate: dueDate || "",
                dueTime: dueTime || "23:59",
                source: source || "Manual Entry",
            });
            createdTasks.push(task);
        }

        // Admin community task: notify each assigned member
        if (isAdmin && req.user.community && createdTasks.length > 0) {
            const notifications = createdTasks.map((t) => ({
                recipient: t.user,
                community: req.user.community,
                type: "task",
                title: "New Task Assigned",
                message: `A new task "${t.title}" has been assigned to you by the administrator.`,
                relatedId: t._id,
            }));
            await Notification.insertMany(notifications);
        }

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: createdTasks[0],
            tasks: createdTasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        // Whitelist safe fields — never accept community, createdBy, user, or isPersonal from the client
        const {
            title, description, priority, status, done,
            previousStatus, assignee, avatarColor, due, dueDate, dueTime, source,
        } = req.body;

        const updateData = {
            title, description, priority, status, done,
            previousStatus, assignee, avatarColor, due, dueDate, dueTime, source,
        };

        // Strip undefined values so partial updates don't overwrite fields with undefined
        Object.keys(updateData).forEach((k) => {
            if (updateData[k] === undefined) delete updateData[k];
        });

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const isAdmin = req.user.role === "admin";

        // Privacy check: Admin cannot view/modify tasks belonging to private meetings between other members
        if (isAdmin && task.meeting) {
            const meeting = await Meeting.findById(task.meeting);
            if (meeting && meeting.participants.length === 1 && meeting.host.toString() !== req.user._id.toString() && meeting.participants[0].email !== req.user.email) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized to access tasks of this private meeting.",
                });
            }
        }

        // Locking rule: Prevent member from changing status once set to 'review' or 'done'
        if (!isAdmin && (task.status === "review" || task.status === "done")) {
            const changingStatus = (status !== undefined && status !== task.status) || (done !== undefined && done !== task.done);
            if (changingStatus) {
                return res.status(403).json({
                    success: false,
                    message: "Task is locked after review submission or completion and cannot be modified by a member.",
                });
            }
        }

        // Authorize access: admin can update any community task, otherwise normal personal/community rules
        let hasAccess = false;
        if (isAdmin) {
            hasAccess = req.user.community && task.community && task.community.toString() === req.user.community.toString();
        } else if (task.isPersonal) {
            hasAccess = task.user.toString() === req.user._id.toString();
        } else {
            hasAccess = req.user.community && task.community && task.community.toString() === req.user.community.toString();
        }

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this task",
            });
        }

        // Determine if user is task creator
        const isCreator = task.createdBy && task.createdBy.toString() === req.user._id.toString();
        const isAuthorized = isAdmin || isCreator;

        // Restriction: Only admin/creator can mark meeting-extracted tasks as done
        const isExtracted = task.source && task.source.startsWith("Meeting:");
        const settingToDone = (status === "done" && task.status !== "done") || (done === true && task.done !== true);

        if (settingToDone && isExtracted && !isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "Only the admin or task creator can mark meeting-extracted tasks as done.",
            });
        }

        // Action: When non-admin/non-creator team member switches task to 'review', notify the admin
        const settingToReview = status === "review" && task.status !== "review";
        if (settingToReview && !isAuthorized) {
            const adminUser = await User.findOne({ community: task.community, role: "admin" });
            if (adminUser) {
                await Notification.create({
                    recipient: adminUser._id,
                    community: task.community,
                    type: "task",
                    title: "Task Review Required",
                    message: `Task "${task.title || title || task.title}" has been submitted for review by ${req.user.firstName} ${req.user.lastName || ""}.`,
                    relatedId: task._id,
                });
            }
        }

        // Admin re-assignment update logic
        if (isAdmin && req.body.assigneeId) {
            updateData.user = req.body.assigneeId;
            const targetUser = await User.findById(req.body.assigneeId);
            if (targetUser) {
                updateData.assignee = `${targetUser.firstName} ${targetUser.lastName}`;
            }
        }

        // Perform the update
        Object.assign(task, updateData);
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const isAdmin = req.user.role === "admin";

        // Privacy check: Admin cannot delete tasks belonging to private meetings between other members
        if (isAdmin && task.meeting) {
            const meeting = await Meeting.findById(task.meeting);
            if (meeting && meeting.participants.length === 1 && meeting.host.toString() !== req.user._id.toString() && meeting.participants[0].email !== req.user.email) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized to access tasks of this private meeting.",
                });
            }
        }

        let hasDeleteAccess = false;
        if (isAdmin) {
            hasDeleteAccess = req.user.community && task.community && task.community.toString() === req.user.community.toString();
        } else if (task.isPersonal) {
            hasDeleteAccess = task.user.toString() === req.user._id.toString();
        } else {
            // Community task: must belong to the same community
            const sameCommunity = req.user.community && task.community && task.community.toString() === req.user.community.toString();
            const isCreator = task.createdBy && task.createdBy.toString() === req.user._id.toString();
            const isAssignee = task.user && task.user.toString() === req.user._id.toString();
            hasDeleteAccess = sameCommunity && (isCreator || isAssignee);
        }

        if (!hasDeleteAccess) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this task",
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
