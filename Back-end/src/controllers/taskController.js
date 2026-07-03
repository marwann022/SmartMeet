import Task from "../models/Task.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Meeting from "../models/Meeting.js";
import { getIO, getUserSockets } from "../socket/index.js";

// @desc    Get all tasks visible to the logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
    try {
        let query;

        if (req.user.role === "admin") {
            if (req.user.community) {
                // Admin sees ALL community tasks (management dashboard),
                // never filtered by assignment — admins are managers, not assignees.
                query = { community: req.user.community };

                // Privacy Rule: Admin should not view private tasks belonging to meetings conducted exclusively between two other members.
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
            } else {
                query = { user: req.user._id };
            }
        } else {
            // Non-admin members should only see their own assigned tasks
            query = { user: req.user._id };
        }

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'name avatar role')
            .populate('createdBy', 'name firstName lastName role');

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
        if (isAdmin) {
            const { assignToEveryone, assignToSelf } = req.body;

            if (assignToSelf) {
                // Future mode: admin assigns task to themselves only
                targetUserIds = [req.user._id];
            } else if (assignToEveryone) {
                // Assign to all non-admin community members
                if (req.user.community) {
                    const allMembers = await User.find({
                        community: req.user.community,
                        role: { $ne: "admin" },
                    }).select("_id");
                    targetUserIds = allMembers.map((m) => m._id);
                }
            } else if (assigneeIds && Array.isArray(assigneeIds) && assigneeIds.length > 0) {
                // Assign to selected members only — never include the admin
                const adminIdStr = req.user._id.toString();
                const seen = new Set();
                for (const id of assigneeIds) {
                    const key = id.toString();
                    if (key !== adminIdStr && !seen.has(key)) {
                        seen.add(key);
                        targetUserIds.push(id);
                    }
                }
            }

            if (targetUserIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No valid assignees found. Please select at least one member.",
                });
            }
        } else {
            // Non-admin: task is assigned to themselves
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

        const adminName = req.user.name || `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || "The admin";

        // Admin community task: notify each assigned member
        if (isAdmin && req.user.community && createdTasks.length > 0) {
            const notifications = createdTasks.map((t) => ({
                recipient: t.user,
                community: req.user.community,
                type: "task",
                title: "New Task Assigned",
                message: `${adminName} assigned "${t.title}" to you.`,
                relatedId: t._id,
            }));
            await Notification.insertMany(notifications);

            // Socket emission to each assigned member
            try {
                const io = getIO();
                const userSocketsMap = getUserSockets();
                for (const task of createdTasks) {
                    const assigneeId = task.user.toString();
                    const sockets = userSocketsMap.get(assigneeId);
                    if (sockets) {
                        const payload = {
                            type: "task",
                            title: "New Task Assigned",
                            message: `${adminName} assigned "${task.title}" to you.`,
                            relatedId: task._id,
                        };
                        for (const sid of sockets) {
                            io.to(sid).emit("task:notification", payload);
                        }
                    }
                }
            } catch (_err) {}
        }

        // Member personal task: notify the community admin
        if (!isAdmin && req.user.community && createdTasks.length > 0) {
            const communityAdmin = await User.findOne({ community: req.user.community, role: "admin" }).select("_id name firstName lastName");
            if (communityAdmin) {
                const memberName = req.user.name || `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || "A member";
                const taskTitle = createdTasks[0].title;

                await Notification.create({
                    recipient: communityAdmin._id,
                    community: req.user.community,
                    type: "task",
                    title: "New Task Created by Member",
                    message: `${memberName} created a new task "${taskTitle}".`,
                    relatedId: createdTasks[0]._id,
                });

                try {
                    const io = getIO();
                    const userSocketsMap = getUserSockets();
                    const adminId = communityAdmin._id.toString();
                    const sockets = userSocketsMap.get(adminId);
                    if (sockets) {
                        const payload = {
                            type: "task",
                            title: "New Task Created by Member",
                            message: `${memberName} created a new task "${taskTitle}".`,
                            relatedId: createdTasks[0]._id,
                        };
                        for (const sid of sockets) {
                            io.to(sid).emit("task:notification", payload);
                        }
                    }
                } catch (_err) {}
            }
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
            reviewComment,
        } = req.body;

        const updateData = {
            title, description, priority, status, done,
            previousStatus, assignee, avatarColor, due, dueDate, dueTime, source,
            reviewComment,
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

        // Admin cannot move tasks into "In Progress" unless returning from Review
        if (isAdmin && status === "inprogress" && task.status !== "review") {
            return res.status(403).json({
                success: false,
                message: "Only the assigned member can start a task.",
            });
        }

        // Admin cannot move tasks into "Review" — only members can submit for review
        if (isAdmin && status === "review") {
            return res.status(403).json({
                success: false,
                message: "Only the assigned member can submit a task for review.",
            });
        }

        // Member cannot set status to "done" directly — must go through review → admin approve
        if (!isAdmin && status === "done" && task.status !== "done") {
            return res.status(403).json({
                success: false,
                message: "Task must be submitted for review and approved by an admin.",
            });
        }

        // Action: When a member switches task to 'review', notify ALL admins
        const settingToReview = status === "review" && task.status !== "review";
        if (settingToReview && !isAdmin) {
            if (!task.reviewHistory) task.reviewHistory = [];
            task.reviewHistory.push({
                action: "submitted",
                user: req.user._id,
                comment: "",
                timestamp: new Date(),
            });

            const adminUsers = await User.find({ community: task.community, role: "admin" }).select("_id firstName lastName name");
            const senderName = req.user.name || `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || "A member";
            const taskTitle = task.title || title;

            for (const admin of adminUsers) {
                await Notification.create({
                    recipient: admin._id,
                    community: task.community,
                    type: "approval",
                    title: "Task Ready For Review",
                    message: `${senderName} marked "${taskTitle}" as ready for review.`,
                    relatedId: task._id,
                });
            }

            // Emit socket to all admins
            try {
                const io = getIO();
                const userSocketsMap = getUserSockets();
                const payload = {
                    type: "approval",
                    title: "Task Ready For Review",
                    message: `${senderName} marked "${taskTitle}" as ready for review.`,
                    relatedId: task._id,
                };
                for (const admin of adminUsers) {
                    const adminId = admin._id.toString();
                    const sockets = userSocketsMap.get(adminId);
                    if (sockets) {
                        for (const sid of sockets) {
                            io.to(sid).emit("task:notification", payload);
                        }
                    }
                }
            } catch (_err) {
                // Socket not available
            }
        }

        // Admin approves: review → done
        const adminApproving = isAdmin && status === "done" && task.status === "review";
        if (adminApproving) {
            if (!task.reviewHistory) task.reviewHistory = [];
            task.reviewHistory.push({
                action: "approved",
                user: req.user._id,
                comment: reviewComment || "",
                timestamp: new Date(),
            });

            const adminName = req.user.name || `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || "An admin";
            const taskTitle = task.title || title;

            await Notification.create({
                recipient: task.user,
                community: task.community,
                type: "approval",
                title: "Task Approved",
                message: `Your task "${taskTitle}" has been approved.`,
                relatedId: task._id,
            });

            try {
                const io = getIO();
                const userSocketsMap = getUserSockets();
                const assigneeId = task.user.toString();
                const sockets = userSocketsMap.get(assigneeId);
                if (sockets) {
                    const payload = {
                        type: "approval",
                        title: "Task Approved",
                        message: `Your task "${taskTitle}" has been approved.`,
                        relatedId: task._id,
                    };
                    for (const sid of sockets) {
                        io.to(sid).emit("task:notification", payload);
                    }
                }
            } catch (_err) {}
        }

        // Admin returns task: review → inprogress (needs changes)
        const adminReturning = isAdmin && status === "inprogress" && task.status === "review";
        if (adminReturning) {
            if (!task.reviewHistory) task.reviewHistory = [];
            task.reviewHistory.push({
                action: "returned",
                user: req.user._id,
                comment: reviewComment || "",
                timestamp: new Date(),
            });

            const adminName = req.user.name || `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || "An admin";
            const taskTitle = task.title || title;

            await Notification.create({
                recipient: task.user,
                community: task.community,
                type: "rejection",
                title: "Task Returned",
                message: `${adminName} requested changes on "${taskTitle}". The task has been moved back to In Progress.`,
                relatedId: task._id,
            });

            try {
                const io = getIO();
                const userSocketsMap = getUserSockets();
                const assigneeId = task.user.toString();
                const sockets = userSocketsMap.get(assigneeId);
                if (sockets) {
                    const payload = {
                        type: "rejection",
                        title: "Task Returned",
                        message: `${adminName} requested changes on "${taskTitle}". The task has been moved back to In Progress.`,
                        relatedId: task._id,
                    };
                    for (const sid of sockets) {
                        io.to(sid).emit("task:notification", payload);
                    }
                }
            } catch (_err) {}
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

        const populatedTask = await Task.findById(task._id)
            .populate('user', 'name avatar role')
            .populate('createdBy', 'name firstName lastName role');

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: populatedTask,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Admin approves a task in review
// @route   PUT /api/tasks/:id/approve
// @access  Private/Admin
export const approveTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Only admins can approve tasks." });
        }

        if (!req.user.community || !task.community || task.community.toString() !== req.user.community.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to approve this task." });
        }

        if (task.status !== "review") {
            return res.status(400).json({ success: false, message: "Task is not in review status." });
        }

        if (!task.reviewHistory) task.reviewHistory = [];
        task.reviewHistory.push({
            action: "approved",
            user: req.user._id,
            comment: "",
            timestamp: new Date(),
        });

        task.status = "done";
        task.done = true;
        task.previousStatus = "review";
        await task.save();

        const adminName = req.user.name || `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || "An admin";
        await Notification.create({
            recipient: task.user,
            community: task.community,
            type: "approval",
            title: "Task Approved",
            message: `Your task "${task.title}" has been approved.`,
            relatedId: task._id,
        });

        try {
            const io = getIO();
            const userSocketsMap = getUserSockets();
            const assigneeId = task.user.toString();
            const sockets = userSocketsMap.get(assigneeId);
            if (sockets) {
                const payload = {
                    type: "approval",
                    title: "Task Approved",
                    message: `Your task "${task.title}" has been approved.`,
                    relatedId: task._id,
                };
                for (const sid of sockets) {
                    io.to(sid).emit("task:notification", payload);
                }
            }
        } catch (_err) {}

        const populatedTask = await Task.findById(task._id)
            .populate('user', 'name avatar role')
            .populate('createdBy', 'name firstName lastName role');

        res.status(200).json({ success: true, message: "Task approved.", task: populatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin returns a task from review back to inprogress (needs changes)
// @route   PUT /api/tasks/:id/reject
// @access  Private/Admin
export const rejectTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Only admins can return tasks." });
        }

        if (!req.user.community || !task.community || task.community.toString() !== req.user.community.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to return this task." });
        }

        if (task.status !== "review") {
            return res.status(400).json({ success: false, message: "Task is not in review status." });
        }

        const comment = req.body.comment || "";

        if (!task.reviewHistory) task.reviewHistory = [];
        task.reviewHistory.push({
            action: "returned",
            user: req.user._id,
            comment,
            timestamp: new Date(),
        });

        task.status = "inprogress";
        task.done = false;
        task.previousStatus = "review";
        task.reviewComment = comment;
        await task.save();

        const adminName = req.user.name || `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || "An admin";

        await Notification.create({
            recipient: task.user,
            community: task.community,
            type: "rejection",
            title: "Task Returned",
            message: `${adminName} requested changes on "${task.title}". The task has been moved back to In Progress.`,
            relatedId: task._id,
        });

        try {
            const io = getIO();
            const userSocketsMap = getUserSockets();
            const assigneeId = task.user.toString();
            const sockets = userSocketsMap.get(assigneeId);
            if (sockets) {
                const payload = {
                    type: "rejection",
                    title: "Task Returned",
                    message: `${adminName} requested changes on "${task.title}". The task has been moved back to In Progress.`,
                    relatedId: task._id,
                };
                for (const sid of sockets) {
                    io.to(sid).emit("task:notification", payload);
                }
            }
        } catch (_err) {}

        const populatedTask = await Task.findById(task._id)
            .populate('user', 'name avatar role')
            .populate('createdBy', 'name firstName lastName role');

        res.status(200).json({ success: true, message: "Task rejected and moved back to In Progress.", task: populatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
