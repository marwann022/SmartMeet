import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getMembers, getDashboardStats, getCommunityOverview, updateMemberRole, removeMember } from "../controllers/communityController.js";

const router = express.Router();

// router.get("/members", protect, adminOnly, getMembers);
router.get("/members", protect, getMembers);

router.get("/stats", protect, getDashboardStats);

router.get("/overview", protect, getCommunityOverview);

router.put("/members/:id/role", protect, adminOnly, updateMemberRole);

router.delete("/members/:id", protect, adminOnly, removeMember);

export default router;
