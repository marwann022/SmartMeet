import Notification from "../models/Notification.js";

// GET /api/notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/notifications
// Accepts { title, message, type, community } (new) or { text, type, relatedId } (legacy)
export const createNotification = async (req, res) => {
    try {
        const { text, title, message, type, community } = req.body;

        const resolvedTitle = title || text;
        const resolvedMessage = message || text;

        if (!resolvedTitle) {
            return res.status(400).json({
                success: false,
                message: "Notification title is required.",
            });
        }

        const settings = req.user.notificationSettings;
        const summariesEnabled = !settings || settings.summaries !== false;
        const resolvedType = type || "task";

        if (resolvedType === "task" && !summariesEnabled) {
            return res.status(200).json({
                success: true,
                message: "Notification ignored due to user preferences",
            });
        }

        const notification = await Notification.create({
            recipient: req.user._id,
            community: community || null,
            type: resolvedType,
            title: resolvedTitle,
            message: resolvedMessage,
        });

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            notification,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found or unauthorized",
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// PUT /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found or unauthorized",
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE /api/notifications
export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user._id });

        res.status(200).json({
            success: true,
            message: "All notifications cleared successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
