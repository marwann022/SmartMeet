import JoinRequest from "../models/JoinRequest.js";
import Community from "../models/Community.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// POST /api/join-requests
export const createJoinRequest = async (req, res) => {
  try {
    const { communityCode } = req.body;

    if (!communityCode || !communityCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Community code is required.",
      });
    }

    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot join other communities.",
      });
    }

    if (req.user.community) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of a community.",
      });
    }

    const community = await Community.findOne({
      code: communityCode.trim().toUpperCase(),
    });

    if (!community) {
      return res.status(400).json({
        success: false,
        message: "Invalid community code.",
      });
    }

    const existing = await JoinRequest.findOne({
      user: req.user._id,
      community: community._id,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A join request for this community already exists.",
      });
    }

    const joinRequest = await JoinRequest.create({
      user: req.user._id,
      community: community._id,
    });

    await Notification.create({
      recipient: community.owner,
      community: community._id,
      type: "join-request",
      title: "New Join Request",
      message: `${req.user.firstName} ${req.user.lastName} wants to join your community.`,
      relatedId: joinRequest._id,
    });

    res.status(201).json({
      success: true,
      message: "Join request submitted successfully.",
      joinRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/join-requests
export const getJoinRequests = async (req, res) => {
  try {
    if (!req.user.community) {
      return res.status(400).json({
        success: false,
        message: "Admin has no community assigned.",
      });
    }

    const requests = await JoinRequest.find({
      community: req.user.community,
      status: "pending",
    }).populate("user", "firstName lastName email avatar createdAt");

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/join-requests/:id/approve
export const approveJoinRequest = async (req, res) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.id);

    if (!joinRequest) {
      return res.status(404).json({
        success: false,
        message: "Join request not found.",
      });
    }

    if (joinRequest.community.toString() !== req.user.community.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to manage this request.",
      });
    }

    if (joinRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed.",
      });
    }

    joinRequest.status = "approved";
    await joinRequest.save();

    await User.findByIdAndUpdate(joinRequest.user, {
      community: joinRequest.community,
      status: "active",
    });

    // Mark the join request notification as read and update message
    await Notification.findOneAndUpdate(
      {
        relatedId: joinRequest._id,
        type: "join-request",
      },
      {
        read: true,
        status: "approved",
      },
    );

    await Notification.create({
      recipient: joinRequest.user,
      community: joinRequest.community,
      type: "approval",
      title: "Join Request Approved",
      message: "Your request to join the community has been approved. Welcome!",
    });

    res.status(200).json({
      success: true,
      message: "Join request approved.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/join-requests/:id/reject
export const rejectJoinRequest = async (req, res) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.id);

    if (!joinRequest) {
      return res.status(404).json({
        success: false,
        message: "Join request not found.",
      });
    }

    if (joinRequest.community.toString() !== req.user.community.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to manage this request.",
      });
    }

    if (joinRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed.",
      });
    }

    joinRequest.status = "rejected";
    await joinRequest.save();

    // Mark the join request notification as read and update message
    await Notification.findOneAndUpdate(
      {
        relatedId: joinRequest._id,
        type: "join-request",
      },
      {
        read: true,
        status: "rejected",
        message: "✗ Request Rejected",
      },
    );

    await Notification.create({
      recipient: joinRequest.user,
      community: joinRequest.community,
      type: "rejection",
      title: "Join Request Rejected",
      message: "Your request to join the community has been rejected.",
    });

    res.status(200).json({
      success: true,
      message: "Join request rejected.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
