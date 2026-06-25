import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: String,
        trim: true,
        default: "",
    },
    deadline: Date,
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.8,
    },
}, { _id: false });

const meetingKnowledgeSchema = new mongoose.Schema({
    meeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
        required: true,
        unique: true,
        index: true,
    },
    summary: {
        type: String,
        required: true,
    },
    meetingOverview: {
        type: String,
        default: "",
    },
    topics: {
        type: [String],
        default: [],
        index: true,
    },
    participants: {
        type: [String],
        default: [],
    },
    decisions: {
        type: [noteSchema],
        default: [],
    },
    deadlines: {
        type: [noteSchema],
        default: [],
    },
    risks: {
        type: [noteSchema],
        default: [],
    },
    openQuestions: {
        type: [noteSchema],
        default: [],
    },
    agreements: {
        type: [noteSchema],
        default: [],
    },
    disagreements: {
        type: [noteSchema],
        default: [],
    },
    followUpTasks: {
        type: [noteSchema],
        default: [],
    },
    analysisModel: {
        type: String,
        default: "llama-3.3-70b-versatile",
    },
}, {
    timestamps: true,
});

meetingKnowledgeSchema.index({ summary: "text", meetingOverview: "text", topics: "text" });
meetingKnowledgeSchema.index({ updatedAt: -1 });

const MeetingKnowledge = mongoose.model("MeetingKnowledge", meetingKnowledgeSchema);

export default MeetingKnowledge;
