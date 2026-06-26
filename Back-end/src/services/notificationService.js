import Notification from "../models/Notification.js";

/**
 * Programmatically create a notification for a user.
 * @param {Object} params
 * @param {string} params.user - User ID who receives the notification.
 * @param {string} params.text - Notification message content.
 * @param {string} [params.type='task'] - Type of notification.
 * @param {string} [params.relatedId=null] - Related task/meeting ID.
 * @returns {Promise<Object|null>} The created notification or null on failure.
 */
export const createNotification = async ({ user, text, type = "task", relatedId = null }) => {
    try {
        const notification = await Notification.create({
            user,
            text,
            type,
            relatedId,
        });
        return notification;
    } catch (error) {
        console.error("Error creating notification via service:", error);
        return null;
    }
};
