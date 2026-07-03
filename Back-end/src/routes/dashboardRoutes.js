import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboardStats, getActivityChart, getInsights } from "../controllers/dashboardController.js";
import { getTeamAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.use(protect); // All dashboard routes require authentication

router.get("/stats", getDashboardStats);
router.get("/chart", getActivityChart);
router.get("/insights", getInsights);
router.get("/team-analytics", getTeamAnalytics);

export default router;
