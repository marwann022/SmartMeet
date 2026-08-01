import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";

import User from "../models/User.js";
import Meeting from "../models/Meeting.js";
import MeetingTranscript from "../models/MeetingTranscript.js";
import ActionItem from "../models/ActionItem.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import MeetingEmbedding from "../models/MeetingEmbedding.js";
import ChatMessage from "../models/ChatMessage.js";
import ChatSession from "../models/ChatSession.js";
import Notification from "../models/Notification.js";
import Community from "../models/Community.js";
import Message from "../models/Message.js";
import Invitation from "../models/Invitation.js";
import JoinRequest from "../models/JoinRequest.js";
import Task from "../models/Task.js";

const run = async () => {
    await connectDB();
    console.log("💥 Executing full database wipe (INCLUDING USERS)...");

    const userCount = await User.countDocuments();
    const meetingCount = await Meeting.countDocuments();
    const communityCount = await Community.countDocuments();

    console.log(`📊 Found: ${userCount} users, ${meetingCount} meetings, and ${communityCount} communities.`);

    // Wipe all collections
    await User.deleteMany({});
    await Meeting.deleteMany({});
    await MeetingTranscript.deleteMany({});
    await ActionItem.deleteMany({});
    await MeetingKnowledge.deleteMany({});
    await MeetingEmbedding.deleteMany({});
    await ChatMessage.deleteMany({});
    await ChatSession.deleteMany({});
    await Notification.deleteMany({});
    await Community.deleteMany({});
    await Message.deleteMany({});
    await Invitation.deleteMany({});
    await JoinRequest.deleteMany({});
    await Task.deleteMany({});

    // Ensure all other registered Mongoose collections are wiped
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }

    console.log("==================================================================");
    console.log("✓ Successfully wiped ALL database collections!");
    console.log("✨ Users, meetings, transcripts, communities, tasks, and messages have been completely cleared.");
    console.log("==================================================================");
    process.exit(0);
};

run().catch((err) => {
    console.error("❌ Database wipe failed:", err);
    process.exit(1);
});
