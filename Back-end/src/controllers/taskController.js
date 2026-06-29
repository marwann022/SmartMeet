import Task from "../models/Task.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// @desc    Get all tasks visible to the logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
    try {
        // Always include tasks the user personally created (covers old + new personal + own community tasks)
        const orClauses = [{ user: req.user._id }];

        // Add community task clause only when the user belongs to a community.
        // Guard: if community is null the $or clause would match any task where community
        // is null, which would expose old unscoped tasks belonging to others.
        if (req.user.community) {
            orClauses.push({ community: req.user.community, isPersonal: false });
        }

        const tasks = await Task.find({ $or: orClauses }).sort({ createdAt: -1 });

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
            assignee, avatarColor, due, dueDate, source,
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        const isAdmin = req.user.role === "admin";

        const task = await Task.create({
            user: req.user._id,
            community: req.user.community || null,
            createdBy: req.user._id,
            isPersonal: !isAdmin,
            title,
            description,
            priority,
            status,
            assignee,
            avatarColor,
            due,
            dueDate,
            source,
        });

        // Admin community task: notify every active member in the community (including the admin)
        if (isAdmin && req.user.community) {
            const members = await User.find({
                community: req.user.community,
                status: "active",
            }).select("_id");

            if (members.length > 0) {
                const notifications = members.map((m) => ({
                    recipient: m._id,
                    community: req.user.community,
                    type: "task",
                    title: "New Community Task",
                    message: "A new task has been added by the administrator.",
                    relatedId: task._id,
                }));
                await Notification.insertMany(notifications);
            }
        }

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
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
            previousStatus, assignee, avatarColor, due, dueDate, source,
        } = req.body;

        const updateData = {
            title, description, priority, status, done,
            previousStatus, assignee, avatarColor, due, dueDate, source,
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

        // Authorize access: personal tasks only by owner, community tasks by same community members
        let hasAccess = false;
        if (task.isPersonal) {
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

        // Determine if user is admin or task creator
        const isAdmin = req.user.role === "admin";
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

        let hasDeleteAccess = false;
        if (task.isPersonal) {
            hasDeleteAccess = task.user.toString() === req.user._id.toString();
        } else {
            // Community task: must belong to the same community
            const sameCommunity = req.user.community && task.community && task.community.toString() === req.user.community.toString();
            // Delete access: must be admin, or the creator of the task, or the assignee (task.user)
            const isAdmin = req.user.role === "admin";
            const isCreator = task.createdBy && task.createdBy.toString() === req.user._id.toString();
            const isAssignee = task.user && task.user.toString() === req.user._id.toString();
            hasDeleteAccess = sameCommunity && (isAdmin || isCreator || isAssignee);
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
