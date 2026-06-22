import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    register,
    login,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    uploadAvatar
} from "../controllers/userController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

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

router.post(
    "/avatar",
    protect,
    upload.single("avatar"),
    uploadAvatar
);

export default router;