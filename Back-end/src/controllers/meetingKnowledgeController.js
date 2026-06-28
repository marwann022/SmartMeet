import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import MeetingTranscript from "../models/MeetingTranscript.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import ActionItem from "../models/ActionItem.js";

const findOwnedMeeting = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ success: false, message: "Invalid meeting ID format" });
        return null;
    }
    const meeting = await Meeting.findOne({ _id: req.params.id, host: req.user._id });
    if (!meeting) {
        res.status(404).json({ success: false, message: "Meeting not found" });
        return null;
    }
    return meeting;
};

export const getMeetingTranscript = async (req, res) => {
    const meeting = await findOwnedMeeting(req, res);
    if (!meeting) return;

    const transcript = await MeetingTranscript.findOne({ meeting: meeting._id });
    return res.status(200).json({ success: true, transcript });
};

export const getMeetingSummary = async (req, res) => {
    const meeting = await findOwnedMeeting(req, res);
    if (!meeting) return;

    const knowledge = await MeetingKnowledge.findOne({ meeting: meeting._id })
        .select("summary meetingOverview topics participants updatedAt");
    return res.status(200).json({ success: true, summary: knowledge });
};

export const getMeetingKnowledge = async (req, res) => {
    const meeting = await findOwnedMeeting(req, res);
    if (!meeting) return;

    const knowledge = await MeetingKnowledge.findOne({ meeting: meeting._id });
    return res.status(200).json({ success: true, knowledge });
};

export const getMeetingTasks = async (req, res) => {
    const meeting = await findOwnedMeeting(req, res);
    if (!meeting) return;

    const tasks = await ActionItem.find({ meeting: meeting._id }).sort({ deadline: 1, createdAt: 1 });
    return res.status(200).json({ success: true, tasks });
};

export const getMeetingDecisions = async (req, res) => {
    const meeting = await findOwnedMeeting(req, res);
    if (!meeting) return;

    const knowledge = await MeetingKnowledge.findOne({ meeting: meeting._id }).select("decisions");
    return res.status(200).json({ success: true, decisions: knowledge?.decisions || [] });
};
