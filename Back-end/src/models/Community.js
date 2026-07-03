import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Community name is required."],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Community code is required."],
      unique: true,
      trim: true,
      uppercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Community owner is required."],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

communitySchema.index({ owner: 1 });

const Community = mongoose.model("Community", communitySchema);

export default Community;
