import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMessages,
  createMessage,
  deleteMessage,
} from "../controllers/communityChatController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getMessages)
  .post(createMessage);

router.delete("/:id", deleteMessage);

export default router;
