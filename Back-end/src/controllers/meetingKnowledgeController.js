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

export const updateMeetingKnowledge = async (req, res) => {
    const meeting = await findOwnedMeeting(req, res);
    if (!meeting) return;

    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Only admins can edit meeting knowledge" });
    }

    const { summary, meetingOverview, decisions, actionItems } = req.body;

    const updateFields = {};
    if (summary !== undefined) updateFields.summary = summary;
    if (meetingOverview !== undefined) updateFields.meetingOverview = meetingOverview;
    if (decisions !== undefined) updateFields.decisions = decisions;

    if (actionItems !== undefined && Array.isArray(actionItems)) {
        for (const item of actionItems) {
            if (item._id) {
                await ActionItem.updateOne({ _id: item._id, meeting: meeting._id }, { $set: { title: item.title, status: item.status, assignedTo: item.assignedTo, priority: item.priority } });
            } else if (item.title) {
                await ActionItem.create({ meeting: meeting._id, title: item.title, status: item.status || "open", assignedTo: item.assignedTo || "Unassigned", priority: item.priority || "medium" });
            }
        }
    }

    if (Object.keys(updateFields).length > 0) {
        await MeetingKnowledge.updateOne({ meeting: meeting._id }, { $set: updateFields });
    }

    const updated = await MeetingKnowledge.findOne({ meeting: meeting._id });
    return res.status(200).json({ success: true, knowledge: updated });
};
