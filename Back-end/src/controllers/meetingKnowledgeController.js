import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import User from "../models/User.js";
import MeetingTranscript from "../models/MeetingTranscript.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import ActionItem from "../models/ActionItem.js";

const findOwnedMeeting = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ success: false, message: "Invalid meeting ID format" });
        return null;
    }

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

    const meeting = await Meeting.findOne({ _id: req.params.id, $or: orClauses });
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

    const tasks = await ActionItem.find({ meeting: meeting._id }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, tasks });
};

export const getMeetingDecisions = async (req, res) => {
    const meeting = await findOwnedMeeting(req, res);
    if (!meeting) return;

    const knowledge = await MeetingKnowledge.findOne({ meeting: meeting._id }).select("decisions");
    return res.status(200).json({ success: true, decisions: knowledge?.decisions || [] });
};

export const updateActionItem = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.actionId)) {
            return res.status(400).json({ success: false, message: "Invalid action item ID format" });
        }

        const actionItem = await ActionItem.findById(req.params.actionId);
        if (!actionItem) {
            return res.status(404).json({ success: false, message: "Action item not found" });
        }

        const meeting = await Meeting.findById(actionItem.meeting);
        if (!meeting) {
            return res.status(404).json({ success: false, message: "Associated meeting not found" });
        }

        const isAuthorized = meeting.host.toString() === req.user._id.toString()
            || req.user.role === "admin"
            || actionItem.assignedTo === req.user.name;

        if (!isAuthorized) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this action item" });
        }

        const allowedFields = ["title", "description", "assignedTo", "deadline", "status", "priority"];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                actionItem[field] = req.body[field];
            }
        });

        await actionItem.save();
        return res.status(200).json({ success: true, actionItem });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateMeetingKnowledge = async (req, res) => {
    const meeting = await findOwnedMeeting(req, res);
    if (!meeting) return;

    try {
        let knowledge = await MeetingKnowledge.findOne({ meeting: meeting._id });

        if (!knowledge) {
            return res.status(404).json({ success: false, message: "Meeting knowledge not found. Process the meeting first." });
        }

        const allowedFields = [
            "summary", "meetingOverview", "topics", "participants",
            "decisions", "deadlines", "risks", "openQuestions",
            "agreements", "disagreements", "followUpTasks"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                knowledge[field] = req.body[field];
            }
        });

        await knowledge.save();

        return res.status(200).json({ success: true, knowledge });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
