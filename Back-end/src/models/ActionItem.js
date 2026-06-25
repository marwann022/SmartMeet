import mongoose from "mongoose";

const actionItemSchema = new mongoose.Schema({
    meeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 220,
    },
    description: {
        type: String,
        default: "",
    },
    assignedTo: {
        type: String,
        trim: true,
        default: "Unassigned",
        index: true,
    },
    deadline: {
        type: Date,
        index: true,
    },
    status: {
        type: String,
        enum: ["open", "in_progress", "blocked", "done"],
        default: "open",
        index: true,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    sourceText: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

actionItemSchema.index({ meeting: 1, assignedTo: 1, status: 1 });
actionItemSchema.index({ title: "text", description: "text", assignedTo: "text" });

const ActionItem = mongoose.model("ActionItem", actionItemSchema);

export default ActionItem;
