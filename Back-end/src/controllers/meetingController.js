import Meeting from "../models/Meeting.js";
import User from "../models/User.js";
import { extractAudioIfNeeded, transcribeAudio } from "../services/transcriptionService.js";
import {
    analyzeMeetingTranscript,
    diarizeTranscript,
    liveExtractTaskFromText,
    liveExtractDecisionFromText,
    translateTranscriptToEnglish,
} from "../services/meetingAnalysisService.js";
import {
    storeTranscriptLayer,
    storeKnowledgeLayers,
    generateAndStoreEmbeddings,
} from "../services/knowledgeStorageService.js";
import { syncMeetingTasksAndNotifications } from "../services/postMeetingService.js";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const generateMeetingId = () => crypto.randomBytes(12).toString("hex");

const deleteFileSafe = async (filePath) => {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
    } catch (err) {
        console.warn(`Could not delete file ${filePath}:`, err.message);
    }
};

const isSilentOrHallucinated = (text) => {
    if (!text || text.trim().length < 15) return true;
    const cleaned = text.trim().toLowerCase();
    const hallucinations = [
        "thank you for watching",
        "thanks for watching",
        "thank you.",
        "thank you very much",
        "amara.org",
        "subtitle",
        "bye bye",
    ];
    if (hallucinations.some(h => cleaned.includes(h) && cleaned.length < h.length + 10)) {
        return true;
    }
    return false;
};

export const createMeeting = async (req, res) => {
    try {
        const { title, description, startTime, duration, type, participants, meetingLink } = req.body;

        const meeting = await Meeting.create({
            title,
            description: description || "",
            host: req.user._id,
            startTime: startTime || null,
            duration: duration || 0,
            type: type || "Team",
            status: "scheduled",
            participants: participants || [],
            meetingLink: meetingLink || "",
            meetingId: generateMeetingId(),
        });

        res.status(201).json({ success: true, meeting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMeetings = async (req, res) => {
    try {
        const communityId = req.user.community?._id || req.user.community;
        let sameCommunityAdminIds = [];
        if (communityId) {
            const admins = await User.find({ community: communityId, role: 'admin' }).select('_id');
            sameCommunityAdminIds = admins.map(a => a._id);
        }

        const isReqUserAdmin = req.user.role === 'admin';
        const orClauses = [];

        if (isReqUserAdmin) {
            // Admin can see:
            // 1. Meetings they hosted
            // 2. Meetings hosted by anyone where the admin is a participant AND meeting type is NOT "Team"
            orClauses.push({ host: req.user._id });
            orClauses.push({
                $or: [
                    { "participants.email": req.user.email },
                    { "participants.name": req.user.name },
                    { "participants.name": `${req.user.firstName} ${req.user.lastName}`.trim() }
                ],
                type: { $ne: "Team" }
            });
        } else {
            // Member can see:
            // 1. Meetings they hosted
            // 2. Meetings where they are a participant (Personal or Team)
            // 3. Team meetings hosted by admins of their community
            orClauses.push({ host: req.user._id });
            orClauses.push({ "participants.email": req.user.email });
            orClauses.push({ "participants.name": req.user.name });
            orClauses.push({ "participants.name": `${req.user.firstName} ${req.user.lastName}`.trim() });

            if (sameCommunityAdminIds.length > 0) {
                orClauses.push({
                    host: { $in: sameCommunityAdminIds },
                    type: "Team"
                });
            }
        }

        const meetings = await Meeting.find({ $or: orClauses })
            .populate("host", "firstName lastName name email role")
            .sort({ startTime: -1, createdAt: -1 });

        res.status(200).json({ success: true, meetings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMeeting = async (req, res) => {
    try {
        const communityId = req.user.community?._id || req.user.community;
        let sameCommunityAdminIds = [];
        if (communityId) {
            const admins = await User.find({ community: communityId, role: 'admin' }).select('_id');
            sameCommunityAdminIds = admins.map(a => a._id);
        }

        const isReqUserAdmin = req.user.role === 'admin';
        const orClauses = [];

        if (isReqUserAdmin) {
            // Admin can see:
            // 1. Meetings they hosted
            // 2. Meetings hosted by anyone where the admin is a participant AND meeting type is NOT "Team"
            orClauses.push({ host: req.user._id });
            orClauses.push({
                $or: [
                    { "participants.email": req.user.email },
                    { "participants.name": req.user.name },
                    { "participants.name": `${req.user.firstName} ${req.user.lastName}`.trim() }
                ],
                type: { $ne: "Team" }
            });
        } else {
            // Member can see:
            // 1. Meetings they hosted
            // 2. Meetings where they are a participant (Personal or Team)
            // 3. Team meetings hosted by admins of their community
            orClauses.push({ host: req.user._id });
            orClauses.push({ "participants.email": req.user.email });
            orClauses.push({ "participants.name": req.user.name });
            orClauses.push({ "participants.name": `${req.user.firstName} ${req.user.lastName}`.trim() });

            if (sameCommunityAdminIds.length > 0) {
                orClauses.push({
                    host: { $in: sameCommunityAdminIds },
                    type: "Team"
                });
            }
        }

        const meeting = await Meeting.findOne({ _id: req.params.id, $or: orClauses })
            .populate("host", "firstName lastName name email role");

        if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });
        res.status(200).json({ success: true, meeting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOneAndUpdate(
            { _id: req.params.id, host: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });
        res.status(200).json({ success: true, meeting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, host: req.user._id });
        if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });
        res.status(200).json({ success: true, message: "Meeting deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadRecording = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const meeting = await Meeting.findOne({ _id: req.params.id, host: req.user._id });
        if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

        // Generate a clean slug from the meeting title
        const slug = meeting.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const ext = path.extname(req.file.path);
        const newFilename = `${Date.now()}-${slug}${ext}`;
        const newPath = path.join("uploads", newFilename);

        // Rename the file on disk
        await fs.rename(req.file.path, newPath);

        // Update database record
        meeting.recordingPath = newPath;
        await meeting.save();

        res.status(200).json({ success: true, message: "Recording uploaded", path: newPath });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const processMeeting = async (req, res) => {
    let audioPath = null;
    let recordingPath = null;
    try {
        const communityId = req.user.community?._id || req.user.community;
        let sameCommunityAdminIds = [];
        if (communityId) {
            const admins = await User.find({ community: communityId, role: 'admin' }).select('_id');
            sameCommunityAdminIds = admins.map(a => a._id);
        }

        const isReqUserAdmin = req.user.role === 'admin';
        const orClauses = [];

        if (isReqUserAdmin) {
            orClauses.push({ host: req.user._id });
            orClauses.push({
                $or: [
                    { "participants.email": req.user.email },
                    { "participants.name": req.user.name },
                    { "participants.name": `${req.user.firstName} ${req.user.lastName}`.trim() }
                ],
                type: { $ne: "Team" }
            });
        } else {
            orClauses.push({ host: req.user._id });
            orClauses.push({ "participants.email": req.user.email });
            orClauses.push({ "participants.name": req.user.name });
            orClauses.push({ "participants.name": `${req.user.firstName} ${req.user.lastName}`.trim() });

            if (sameCommunityAdminIds.length > 0) {
                orClauses.push({
                    host: { $in: sameCommunityAdminIds },
                    type: "Team"
                });
            }
        }

        const meeting = await Meeting.findOne({ _id: req.params.id, $or: orClauses }).populate("host");
        if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

        const { liveTranscript } = req.body;
        const hasTranscript = liveTranscript && liveTranscript.trim().length > 10;
        recordingPath = meeting.recordingPath || null;
        const hasRecording = !!recordingPath;

        console.log(`[Backend] processMeeting: hasTranscript=${hasTranscript}, hasRecording=${hasRecording}`);

        // If neither transcript nor recording, mark as completed with no AI data
        if (!hasTranscript && !hasRecording) {
            console.log("[Backend] No transcript or recording — completing meeting with no AI analysis.");
            await Meeting.updateOne(
                { _id: meeting._id },
                { $set: { status: "completed", endTime: new Date() } }
            );
            return res.status(200).json({ success: true, message: "Meeting completed (no transcript captured)." });
        }

        await Meeting.updateOne({ _id: meeting._id }, { $set: { status: "live" } });

        if (hasRecording) {
            audioPath = await extractAudioIfNeeded(recordingPath);
        }

        let finalTranscript = "";
        let durationSeconds = 0;
        let analysis = null;

        if (hasTranscript) {
            console.log("Using live transcript from client...");
            finalTranscript = await translateTranscriptToEnglish(liveTranscript);
            durationSeconds = meeting.duration * 60 || 0;

            analysis = await analyzeMeetingTranscript({ transcript: finalTranscript, meeting });
            await storeTranscriptLayer({ meeting, transcript: finalTranscript, sourceAudioPath: audioPath, durationSeconds });
            await storeKnowledgeLayers({ meeting, analysis });
            await generateAndStoreEmbeddings({ meeting, transcript: finalTranscript });
        } else {
            console.log("No live transcript — running backend Whisper STT on recording...");
            const { transcript, duration } = await transcribeAudio(audioPath);
            durationSeconds = duration || meeting.duration * 60 || 0;

            if (isSilentOrHallucinated(transcript)) {
                console.log("Recording is silent or hallucinated. Saving placeholder.");
                finalTranscript = "No conversation detected. The meeting recording was silent or empty.";
                analysis = {
                    summary: "No summary generated because no conversation was detected in this meeting.",
                    meetingOverview: "No conversation detected.",
                    decisions: [], actionItems: [], deadlines: [], risks: [],
                    openQuestions: [], topics: [], followUpTasks: [],
                    agreements: [], disagreements: [],
                };
                await storeTranscriptLayer({ meeting, transcript: finalTranscript, sourceAudioPath: audioPath, durationSeconds });
                await storeKnowledgeLayers({ meeting, analysis });
            } else {
                console.log("Diarizing and analyzing transcript...");
                const diarized = await diarizeTranscript({ transcript, meeting });
                finalTranscript = await translateTranscriptToEnglish(diarized);
                await storeTranscriptLayer({ meeting, transcript: finalTranscript, sourceAudioPath: audioPath, durationSeconds });
                analysis = await analyzeMeetingTranscript({ transcript: finalTranscript, meeting });
                await storeKnowledgeLayers({ meeting, analysis });
                await generateAndStoreEmbeddings({ meeting, transcript: finalTranscript });
            }
        }

        // Clean up media files
        await deleteFileSafe(audioPath);
        await deleteFileSafe(recordingPath);

        await Meeting.updateOne(
            { _id: meeting._id },
            {
                $set: {
                    status: "completed",
                    endTime: new Date(),
                    duration: Math.ceil(durationSeconds / 60),
                    recordingPath: "",
                },
            }
        );

        // Trigger post-meeting notifications, task synchronization, and email digests in the background
        if (analysis) {
            syncMeetingTasksAndNotifications({ meeting, analysis }).catch((err) => {
                console.error("[PostMeetingPipeline] Error in background execution:", err);
            });
        }

        res.status(200).json({ success: true, message: "Meeting processed successfully" });
    } catch (error) {
        console.error("Processing failed:", error);
        if (audioPath) await deleteFileSafe(audioPath).catch(() => {});
        if (recordingPath) await deleteFileSafe(recordingPath).catch(() => {});
        // Always mark as completed even on error so the meeting doesn't stay stuck
        await Meeting.updateOne({ _id: req.params.id }, { $set: { status: "completed", endTime: new Date() } }).catch(() => {});
        res.status(500).json({ success: false, message: error.message });
    }
};


export const liveExtractTask = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim().length < 5) {
            return res.status(200).json({ success: true, tasks: [] });
        }
        const tasks = await liveExtractTaskFromText(text);
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error("Live task extraction failed:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const liveExtractDecision = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim().length < 5) {
            return res.status(200).json({ success: true, decisions: [] });
        }
        const decisions = await liveExtractDecisionFromText(text);
        res.status(200).json({ success: true, decisions });
    } catch (error) {
        console.error("Live decision extraction failed:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
