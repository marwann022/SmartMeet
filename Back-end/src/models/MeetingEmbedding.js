import mongoose from "mongoose";

const meetingEmbeddingSchema = new mongoose.Schema({
    meeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
        required: true,
        index: true,
    },
    vectorId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    chunkIndex: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    embedding: {
        type: [Number],
        default: [],
        select: false,
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {},
    },
}, {
    timestamps: true,
});

meetingEmbeddingSchema.index({ meeting: 1, chunkIndex: 1 }, { unique: true });
meetingEmbeddingSchema.index({ text: "text" });

const MeetingEmbedding = mongoose.model("MeetingEmbedding", meetingEmbeddingSchema);

export default MeetingEmbedding;
