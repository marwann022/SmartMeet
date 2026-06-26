import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["task", "system", "meeting"],
        default: "task",
    },
    read: {
        type: Boolean,
        default: false,
        index: true,
    },
    relatedId: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
