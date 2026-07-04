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
    liveExtractTask,
    liveExtractDecision,
    getMeetingCount,
} from "../controllers/meetingController.js";
import {
    getMeetingTranscript,
    getMeetingSummary,
    getMeetingKnowledge,
    getMeetingTasks,
    getMeetingDecisions,
    updateMeetingSummary,
    updateMeetingTasks,
    updateMeetingDecisions,
} from "../controllers/meetingKnowledgeController.js";

import mongoose from "mongoose";

const router = Router();

router.use(protect);

router.param("id", (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid meeting ID format" });
    }
    next();
});

router.route("/")
    .post(createMeeting)
    .get(getMeetings);

router.get("/count", getMeetingCount);

router.route("/:id")
    .get(getMeeting)
    .put(updateMeeting)
    .delete(deleteMeeting);

router.post("/:id/upload-recording", upload.single("recording"), uploadRecording);
router.post("/:id/process", processMeeting);
router.post("/live-extract-task", liveExtractTask);
router.post("/live-extract-decision", liveExtractDecision);

router.get("/:id/transcript", getMeetingTranscript);
router.get("/:id/summary", getMeetingSummary);
router.get("/:id/knowledge", getMeetingKnowledge);
router.get("/:id/tasks", getMeetingTasks);
router.get("/:id/decisions", getMeetingDecisions);

router.put("/:id/summary", updateMeetingSummary);
router.put("/:id/tasks", updateMeetingTasks);
router.put("/:id/decisions", updateMeetingDecisions);

export default router;
