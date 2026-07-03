import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Meeting from "../models/Meeting.js";
import MeetingTranscript from "../models/MeetingTranscript.js";
import ActionItem from "../models/ActionItem.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import MeetingEmbedding from "../models/MeetingEmbedding.js";
import ChatMessage from "../models/ChatMessage.js";
import ChatSession from "../models/ChatSession.js";
import Notification from "../models/Notification.js";

const run = async () => {
    await connectDB();
    console.log("Wiping all meeting-related records from the database...");

    const meetingCount = await Meeting.countDocuments();
    console.log(`Found ${meetingCount} meetings to remove.`);

    await Meeting.deleteMany({});
    await MeetingTranscript.deleteMany({});
    await ActionItem.deleteMany({});
    await MeetingKnowledge.deleteMany({});
    await MeetingEmbedding.deleteMany({});
    await ChatMessage.deleteMany({});
    await ChatSession.deleteMany({});
    await Notification.deleteMany({});

    console.log("✓ Safely removed all meetings, transcripts, action items, knowledge layers, embeddings, notifications, and chat histories!");
    console.log("Users and accounts have been preserved.");
    process.exit(0);
};

run().catch((err) => {
    console.error("Clean-up failed:", err);
    process.exit(1);
});
