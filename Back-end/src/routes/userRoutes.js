import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    uploadAvatar,
    googleLogin,
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
    verifyLoginTwoFactor,
    getUserSessions,
    revokeSession,
    getNotificationSettings,
    updateNotificationSettings
} from "../controllers/userController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPassword
);

router.get(
    "/profile",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    updateProfile
);

router.put(
    "/change-password",
    protect,
    changePassword
);

router.post(
    "/avatar",
    protect,
    upload.single("avatar"),
    uploadAvatar
);

router.post(
    "/2fa/setup",
    protect,
    setupTwoFactor
);

router.post(
    "/2fa/verify",
    protect,
    verifyTwoFactor
);

router.post(
    "/2fa/disable",
    protect,
    disableTwoFactor
);

router.post(
    "/2fa/verify-login",
    verifyLoginTwoFactor
);

router.get(
    "/sessions",
    protect,
    getUserSessions
);

router.delete(
    "/sessions/:id",
    protect,
    revokeSession
);

router.route("/notification-settings")
    .get(protect, getNotificationSettings)
    .put(protect, updateNotificationSettings);

export default router;