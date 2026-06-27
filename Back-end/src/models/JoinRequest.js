import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: [true, "Community is required."],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate join requests from the same user to the same community
joinRequestSchema.index({ user: 1, community: 1 }, { unique: true });

// Efficient listing of all requests for a given community (admin view)
joinRequestSchema.index({ community: 1 });

const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);

export default JoinRequest;
