import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    refreshToken: {
        type: String,
        required: true
    },

    browser: {
        type: String,
        default: ""
    },

    browserVersion: {
        type: String,
        default: ""
    },

    os: {
        type: String,
        default: ""
    },

    osVersion: {
        type: String,
        default: ""
    },

    device: {
        type: String,
        default: ""
    },

    deviceType: {
        type: String,
        default: "desktop"
    },

    ip: {
        type: String,
        default: ""
    },

    lastActive: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

export default mongoose.model(
    "Session",
    sessionSchema
);