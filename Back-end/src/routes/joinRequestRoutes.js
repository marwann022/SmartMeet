import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    createJoinRequest,
    getJoinRequests,
    approveJoinRequest,
    rejectJoinRequest,
} from "../controllers/joinRequestController.js";

const router = express.Router();

router.post("/", protect, createJoinRequest);
router.get("/", protect, adminOnly, getJoinRequests);
router.patch("/:id/approve", protect, adminOnly, approveJoinRequest);
router.patch("/:id/reject", protect, adminOnly, rejectJoinRequest);

export default router;
