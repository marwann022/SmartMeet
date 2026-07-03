import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getWebhook, saveWebhook, testWebhook } from "../controllers/settingsController.js";

const router = Router();

router.use(protect);

router.get("/webhook", getWebhook);
router.post("/webhook", saveWebhook);
router.post("/webhook/test", testWebhook);

export default router;
