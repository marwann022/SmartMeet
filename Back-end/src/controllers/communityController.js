import User from "../models/User.js";
import Community from "../models/Community.js";
import Task from "../models/Task.js";
import Invitation from "../models/Invitation.js";
import Meeting from "../models/Meeting.js";

// GET /api/communities/members
export const getMembers = async (req, res) => {
    try {
        if (!req.user.community) {
            return res.status(400).json({
                success: false,
                message: "No community assigned to this account.",
            });
        }

        const [members, community] = await Promise.all([
            User.find({
                community: req.user.community,
                status: "active",
            })
                .select("firstName lastName email avatar role createdAt")
                .sort({ createdAt: -1 }),
            Community.findById(req.user.community).select("code name"),
        ]);

        res.status(200).json({
            success: true,
            members,
            communityCode: community?.code || "",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/communities/stats
export const getDashboardStats = async (req, res) => {
    try {
        if (!req.user.community) {
            return res.status(400).json({
                success: false,
                message: "No community assigned to this account.",
            });
        }

        const community = req.user.community;

        const [totalMembers, activeTasks, pendingInvitations, communityDoc] = await Promise.all([
            User.countDocuments({ community, status: "active" }),
            Task.countDocuments({ community, done: false }),
            Invitation.countDocuments({ community, status: "pending" }),
            Community.findById(community).select("code"),
        ]);

        res.status(200).json({
            success: true,
            totalMembers,
            activeTasks,
            pendingInvitations,
            communityCode: communityDoc?.code || "",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/communities/overview
export const getCommunityOverview = async (req, res) => {
    try {
        if (!req.user.community) {
            return res.status(400).json({
                success: false,
                message: "No community assigned to this account.",
            });
        }

        const communityId = req.user.community;
        const isAdmin = req.user.role === "admin";

        const [communityDoc, totalMembers] = await Promise.all([
            Community.findById(communityId)
                .populate("owner", "firstName lastName email")
                .select("name code description owner createdAt"),
            User.countDocuments({ community: communityId, status: "active" }),
        ]);

        let activeTasks = 0;
        let pendingInvitations = 0;
        if (isAdmin) {
            [activeTasks, pendingInvitations] = await Promise.all([
                Task.countDocuments({ community: communityId, done: false }),
                Invitation.countDocuments({ community: communityId, status: "pending" }),
            ]);
        }

        let myTasks = 0;
        let upcomingMeetings = [];
        if (!isAdmin) {
            myTasks = await Task.countDocuments({ user: req.user._id, done: false });

            const sameCommunityAdmins = await User.find({ community: communityId, role: "admin" }).select("_id");
            const adminIds = sameCommunityAdmins.map((a) => a._id);
            const orClauses = [
                { host: req.user._id },
                { "participants.email": req.user.email },
                { "participants.name": req.user.name },
                { "participants.name": `${req.user.firstName} ${req.user.lastName}`.trim() },
            ];
            if (adminIds.length > 0) {
                orClauses.push({ host: { $in: adminIds }, type: "Team" });
            }

            upcomingMeetings = await Meeting.find({
                $and: [
                    { $or: orClauses },
                    { status: { $in: ["scheduled", "live"] } },
                    { startTime: { $gte: new Date() } },
                ],
            })
                .populate("host", "firstName lastName name email")
                .sort({ startTime: 1 })
                .limit(5);
        }

        const rawMembers = await User.find({ community: communityId, status: "active" })
            .select("firstName lastName email avatar role createdAt");

        const members = rawMembers.sort((a, b) => {
            if (a.role === "admin" && b.role !== "admin") return -1;
            if (b.role === "admin" && a.role !== "admin") return 1;
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        res.status(200).json({
            success: true,
            role: req.user.role,
            community: {
                _id: communityDoc._id,
                name: communityDoc.name,
                code: communityDoc.code,
                description: communityDoc.description,
                owner: communityDoc.owner
                    ? {
                          _id: communityDoc.owner._id,
                          name: `${communityDoc.owner.firstName} ${communityDoc.owner.lastName}`.trim(),
                          email: communityDoc.owner.email,
                      }
                    : null,
                createdAt: communityDoc.createdAt,
                memberCount: totalMembers,
            },
            stats: isAdmin
                ? { totalMembers, activeTasks, pendingInvitations, communityCode: communityDoc.code }
                : {
                      totalMembers,
                      myTasks,
                      upcomingMeetings: upcomingMeetings.length,
                      upcomingMeetingsList: upcomingMeetings,
                  },
            members,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/communities/members/:id/role
export const updateMemberRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role." });
        }

        const member = await User.findById(id);
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found." });
        }

        if (member.community?.toString() !== req.user.community?.toString()) {
            return res.status(403).json({ success: false, message: "Member not in your community." });
        }

        if (member._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "Cannot change your own role." });
        }

        member.role = role;
        await member.save();

        res.status(200).json({ success: true, message: `Role updated to ${role}.`, member: member.getPublicProfile() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/communities/members/:id
export const removeMember = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await User.findById(id);
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found." });
        }

        if (member.community?.toString() !== req.user.community?.toString()) {
            return res.status(403).json({ success: false, message: "Member not in your community." });
        }

        if (member.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot remove an admin." });
        }

        member.community = null;
        member.status = "pending";
        await member.save();

        res.status(200).json({ success: true, message: "Member removed from community." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
