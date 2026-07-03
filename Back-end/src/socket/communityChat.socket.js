import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const registerCommunityChat = (io, socket, userSockets) => {
  const user = socket.user;

  if (!user.community) {
    socket.emit("chat:error", { message: "No community assigned." });
    socket.disconnect(true);
    return;
  }

  const communityId = user.community._id?.toString() || user.community.toString();
  const roomName = `chat:community:${communityId}`;
  socket.join(roomName);

  socket.on("chat:send", async ({ message }, ack) => {
    try {
      const text = (message || "").trim();
      if (!text) {
        if (ack) ack({ success: false, error: "Message cannot be empty." });
        return;
      }
      if (text.length > 5000) {
        if (ack) ack({ success: false, error: "Message too long." });
        return;
      }

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

      io.to(roomName).emit("chat:message", messagePayload);

      const communityMembers = await User.find({
        community: communityId,
        status: "active",
        _id: { $ne: user._id },
      }).select("_id");

      const senderName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Someone";

      for (const member of communityMembers) {
        await Notification.create({
          recipient: member._id,
          community: communityId,
          type: "chat",
          title: `New message from ${senderName}`,
          message: text.length > 100 ? text.slice(0, 100) + "…" : text,
          relatedId: populated._id,
        });

        const recipientId = member._id.toString();
        const sockets = userSockets.get(recipientId);
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

      if (ack) ack({ success: true, message: messagePayload });
    } catch (error) {
      console.error("chat:send error:", error);
      if (ack) ack({ success: false, error: "Failed to send message." });
    }
  });
};
