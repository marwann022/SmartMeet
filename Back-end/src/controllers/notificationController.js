import Notification from "../models/Notification.js";

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
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

// @desc    Create a new notification manually (e.g., from frontend client)
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (req, res) => {
    try {
        const { text, type, relatedId } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Notification text is required",
            });
        }

        // Enforce user notification preferences
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
            user: req.user._id,
            text,
            type: resolvedType,
            relatedId: relatedId || null,
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

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
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

// @desc    Mark all notifications of logged in user as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
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

// @desc    Delete a single notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
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

// @desc    Clear all notifications of logged in user
// @route   DELETE /api/notifications
// @access  Private
export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ user: req.user._id });

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
