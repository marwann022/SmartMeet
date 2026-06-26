import Meeting from "../models/Meeting.js";
import { extractAudioIfNeeded, transcribeAudio } from "../services/transcriptionService.js";
import { analyzeMeetingTranscript } from "../services/meetingAnalysisService.js";
import {
    storeTranscriptLayer,
    storeKnowledgeLayers,
    generateAndStoreEmbeddings,
} from "../services/knowledgeStorageService.js";
import crypto from "crypto";

const generateMeetingId = () => crypto.randomBytes(12).toString("hex");

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
        const meetings = await Meeting.find({ host: req.user._id })
            .sort({ startTime: -1, createdAt: -1 });
        res.status(200).json({ success: true, meetings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOne({ _id: req.params.id, host: req.user._id });
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

        const meeting = await Meeting.findOneAndUpdate(
            { _id: req.params.id, host: req.user._id },
            { $set: { recordingPath: req.file.path } },
            { new: true }
        );
        if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

        res.status(200).json({ success: true, message: "Recording uploaded", path: req.file.path });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const processMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOne({ _id: req.params.id, host: req.user._id });
        if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });
        if (!meeting.recordingPath) {
            return res.status(400).json({ success: false, message: "No recording uploaded. Call upload-recording first." });
        }

        await Meeting.updateOne({ _id: meeting._id }, { $set: { status: "live" } });

        const audioPath = await extractAudioIfNeeded(meeting.recordingPath);
        const { transcript, language, duration } = await transcribeAudio(audioPath);

        const durationSeconds = duration || meeting.duration * 60 || 0;
        await storeTranscriptLayer({ meeting, transcript, sourceAudioPath: audioPath, durationSeconds });

        const analysis = await analyzeMeetingTranscript({ transcript, meeting });
        await storeKnowledgeLayers({ meeting, analysis });
        await generateAndStoreEmbeddings({ meeting, transcript });

        await Meeting.updateOne(
            { _id: meeting._id },
            {
                $set: {
                    status: "completed",
                    endTime: new Date(),
                    duration: Math.ceil(durationSeconds / 60),
                },
            }
        );

        res.status(200).json({ success: true, message: "Meeting processed successfully" });
    } catch (error) {
        await Meeting.updateOne({ _id: req.params.id }, { $set: { status: "completed" } }).catch(() => {});
        res.status(500).json({ success: false, message: error.message });
    }
};
