import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getMembers } from "../controllers/communityController.js";

const router = express.Router();

// router.get("/members", protect, adminOnly, getMembers);
router.get("/members", protect, getMembers);

export default router;
