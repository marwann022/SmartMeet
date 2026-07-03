import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";

// Your Original Imports
import Meeting from "../models/Meeting.js";
import MeetingTranscript from "../models/MeetingTranscript.js";
import ActionItem from "../models/ActionItem.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import MeetingEmbedding from "../models/MeetingEmbedding.js";
import ChatMessage from "../models/ChatMessage.js";
import ChatSession from "../models/ChatSession.js";
import Notification from "../models/Notification.js";

// Missing Collections (Excluding Users)
import Community from "../models/Community.js";
import Message from "../models/Message.js";
import Invitation from "../models/Invitation.js";
import JoinRequest from "../models/JoinRequest.js";
import Task from "../models/Task.js";

const run = async () => {
    await connectDB();
    console.log("💥 Executing comprehensive database wipe (Preserving Users)...");

    // Tally up counts across major collections for confirmation
    const meetingCount = await Meeting.countDocuments();
    const communityCount = await Community.countDocuments();
    
    console.log(`📊 Found: ${meetingCount} meetings and ${communityCount} communities to remove.`);

    // 1. Wipe Meeting & AI-Intelligence Data
    await Meeting.deleteMany({});
    await MeetingTranscript.deleteMany({});
    await ActionItem.deleteMany({});
    await MeetingKnowledge.deleteMany({});
    await MeetingEmbedding.deleteMany({});
    await ChatMessage.deleteMany({});
    await ChatSession.deleteMany({});
    await Notification.deleteMany({});

    // 2. Wipe Missing Features Data (Communities, Invites, and Tasks)
    await Community.deleteMany({});
    await Message.deleteMany({});
    await Invitation.deleteMany({});
    await JoinRequest.deleteMany({});
    await Task.deleteMany({});

    console.log("==================================================================");
    console.log("✓ Safely removed application records!");
    console.log("✨ Meetings, transcripts, chat history, communities, invitations, and tasks have been entirely reset.");
    console.log("🔒 All user accounts and profiles have been securely preserved!");
    console.log("==================================================================");
    process.exit(0);
};

run().catch((err) => {
    console.error("❌ Clean-up failed:", err);
    process.exit(1);
});