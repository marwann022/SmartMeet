import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
}, { _id: false });

const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    participants: { type: [participantSchema], default: [] },
    startTime: { type: Date },
    endTime: { type: Date },
    duration: { type: Number, default: 0 },
    type: {
        type: String,
        enum: ["Personal", "Personal Discussion", "Team", "Client", "Standup", "Brainstorm", "Other"],
        default: "Team",
    },
    status: {
        type: String,
        enum: ["scheduled", "live", "completed", "cancelled"],
        default: "scheduled",
    },
    recordingPath: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    meetingId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

meetingSchema.index({ host: 1, status: 1, startTime: -1 });

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
