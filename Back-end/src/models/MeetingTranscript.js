import mongoose from "mongoose";

const transcriptChunkSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
        min: 0,
    },
    text: {
        type: String,
        required: true,
    },
    startChar: {
        type: Number,
        required: true,
        min: 0,
    },
    endChar: {
        type: Number,
        required: true,
        min: 0,
    },
    tokenEstimate: {
        type: Number,
        default: 0,
    },
    vectorId: {
        type: String,
        index: true,
    },
    embeddingStored: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const meetingTranscriptSchema = new mongoose.Schema({
    meeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
        required: true,
        unique: true,
        index: true,
    },
    transcript: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: "auto",
    },
    sourceAudioPath: {
        type: String,
        required: true,
    },
    durationSeconds: {
        type: Number,
        default: 0,
    },
    chunks: {
        type: [transcriptChunkSchema],
        default: [],
    },
}, {
    timestamps: true,
});

meetingTranscriptSchema.index({ transcript: "text" }, { language_override: "none" });

const MeetingTranscript = mongoose.model("MeetingTranscript", meetingTranscriptSchema);

export default MeetingTranscript;
