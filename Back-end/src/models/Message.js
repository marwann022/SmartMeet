import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: [true, "Community is required."],
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required."],
    },
    message: {
      type: String,
      required: [true, "Message text is required."],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters."],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

messageSchema.index({ community: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
