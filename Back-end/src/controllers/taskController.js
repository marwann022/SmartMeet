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

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized",
            });
        }

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
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized",
            });
        }

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
