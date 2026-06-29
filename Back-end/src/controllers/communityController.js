import User from "../models/User.js";
import Community from "../models/Community.js";
import Task from "../models/Task.js";
import Invitation from "../models/Invitation.js";

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
