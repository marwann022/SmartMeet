import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getIO, getUserSockets } from "../socket/index.js";

// GET /api/community-chat/messages
export const getMessages = async (req, res) => {
  try {
    if (!req.user.community) {
      return res.status(400).json({
        success: false,
        message: "No community assigned.",
      });
    }

    const communityId = req.user.community;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ community: communityId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "firstName lastName name email avatar role")
        .lean(),
      Message.countDocuments({ community: communityId }),
    ]);

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/community-chat/messages
export const createMessage = async (req, res) => {
  try {
    if (!req.user.community) {
      return res.status(400).json({
        success: false,
        message: "No community assigned.",
      });
    }

    const text = (req.body.message || "").trim();
    if (!text) {
      return res.status(400).json({ success: false, message: "Message cannot be empty." });
    }
    if (text.length > 5000) {
      return res.status(400).json({ success: false, message: "Message too long." });
    }

    const communityId = req.user.community;
    const user = req.user;

    const saved = await Message.create({
      community: communityId,
      sender: user._id,
      message: text,
    });

    const populated = await Message.findById(saved._id)
      .populate("sender", "firstName lastName name email avatar role")
      .lean();

    const messagePayload = {
      _id: populated._id,
      sender: populated.sender,
      message: populated.message,
      createdAt: populated.createdAt,
    };

    // Emit via socket if available
    try {
      const io = getIO();
      const roomName = `chat:community:${communityId.toString()}`;
      io.to(roomName).emit("chat:message", messagePayload);

      // Create notifications for other community members
      const communityMembers = await User.find({
        community: communityId,
        status: "active",
        _id: { $ne: user._id },
      }).select("_id");

      const senderName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Someone";
      const userSocketsMap = getUserSockets();

      for (const member of communityMembers) {
        await Notification.create({
          recipient: member._id,
          community: communityId,
          type: "chat",
          title: `New message from ${senderName}`,
          message: text.length > 100 ? text.slice(0, 100) + "…" : text,
          relatedId: saved._id,
        });

        const recipientId = member._id.toString();
        const sockets = userSocketsMap.get(recipientId);
        if (sockets) {
          for (const sid of sockets) {
            io.to(sid).emit("chat:notification", {
              type: "chat",
              title: `New message from ${senderName}`,
              message: text.length > 100 ? text.slice(0, 100) + "…" : text,
            });
          }
        }
      }
    } catch (_err) {
      // Socket not available — message saved, notification will be picked up by polling
    }

    res.status(201).json({ success: true, message: messagePayload });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/community-chat/messages/:id
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = message.sender.toString() === req.user._id.toString();
    const sameCommunity = message.community.toString() === req.user.community?.toString();

    if (!sameCommunity) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "You can only delete your own messages." });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Message deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
