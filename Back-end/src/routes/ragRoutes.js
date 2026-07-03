import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  handleQuery,
  handleIngest,
  getChatSessions,
  getSessionMessages,
  deleteChatSession,
} from "../controllers/ragController.js";

const router = express.Router();

router.post("/query", protect, handleQuery);
router.post("/ingest", protect, handleIngest);
router.get("/sessions", protect, getChatSessions);
router.get("/sessions/:sessionId/messages", protect, getSessionMessages);
router.delete("/sessions/:sessionId", protect, deleteChatSession);

export default router;
