import User from "../models/User.js";
import Community from "../models/Community.js";

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
