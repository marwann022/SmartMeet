import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// Apply auth middleware to protect all routes under this router
router.use(protect);

router.route("/")
    .get(getNotifications)
    .post(createNotification)
    .delete(clearAllNotifications);

router.put("/read-all", markAllAsRead);

router.route("/:id")
    .delete(deleteNotification);

router.put("/:id/read", markAsRead);

export default router;
