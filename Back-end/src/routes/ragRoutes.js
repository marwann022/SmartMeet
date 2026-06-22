import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { handleQuery, handleIngest } from "../controllers/ragController.js";

const router = express.Router();

router.post("/query", protect, handleQuery);
router.post("/ingest", protect, handleIngest);

export default router;
