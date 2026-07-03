import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required."],
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "join-request",
        "task",
        "meeting",
        "document",
        "approval",
        "rejection",
        "chat",
      ],
      required: [true, "Notification type is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required."],
      trim: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ community: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
