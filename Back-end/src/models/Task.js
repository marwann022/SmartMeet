import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Please Enter Task Title"],
        trim: true,
    },
    description: {
        type: String,
        default: "No description provided.",
    },
    priority: {
        type: String,
        default: "MEDIUM PRIORITY",
    },
    status: {
        type: String,
        enum: ["todo", "inprogress", "review", "done"],
        default: "todo",
    },
    done: {
        type: Boolean,
        default: false,
    },
    previousStatus: {
        type: String,
        default: "todo",
    },
    assignee: {
        type: String,
        default: "Alex Chen",
    },
    avatarColor: {
        type: String,
        default: "bg-primary",
    },
    due: {
        type: String,
        default: "TBD",
    },
    dueDate: {
        type: String,
        default: "",
    },
    dueTime: {
        type: String,
        default: "23:59",
    },
    source: {
        type: String,
        default: "Manual Entry",
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    meeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
        default: null,
    },
    isPersonal: {
        type: Boolean,
        default: false,
    },
    reviewComment: {
        type: String,
        default: "",
    },
    reviewHistory: [{
        action: {
            type: String,
            enum: ["submitted", "approved", "rejected"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comment: {
            type: String,
            default: "",
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
