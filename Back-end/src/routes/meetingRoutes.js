import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    createMeeting,
    getMeetings,
    getMeeting,
    updateMeeting,
    deleteMeeting,
    uploadRecording,
    processMeeting,
} from "../controllers/meetingController.js";
import {
    getMeetingTranscript,
    getMeetingSummary,
    getMeetingKnowledge,
    getMeetingTasks,
    getMeetingDecisions,
} from "../controllers/meetingKnowledgeController.js";

const router = Router();

router.use(protect);

router.route("/")
    .post(createMeeting)
    .get(getMeetings);

router.route("/:id")
    .get(getMeeting)
    .put(updateMeeting)
    .delete(deleteMeeting);

router.post("/:id/upload-recording", upload.single("recording"), uploadRecording);
router.post("/:id/process", processMeeting);

router.get("/:id/transcript", getMeetingTranscript);
router.get("/:id/summary", getMeetingSummary);
router.get("/:id/knowledge", getMeetingKnowledge);
router.get("/:id/tasks", getMeetingTasks);
router.get("/:id/decisions", getMeetingDecisions);

export default router;
