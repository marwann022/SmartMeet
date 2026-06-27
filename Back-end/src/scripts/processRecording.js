import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import User from "../models/User.js";
import { extractAudioIfNeeded, transcribeAudio } from "../services/transcriptionService.js";
import { analyzeMeetingTranscript } from "../services/meetingAnalysisService.js";
import {
    storeTranscriptLayer,
    storeKnowledgeLayers,
    generateAndStoreEmbeddings,
} from "../services/knowledgeStorageService.js";

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Find a host user
        const host = await User.findOne({});
        if (!host) {
            throw new Error("No users found in database to host the meeting. Please register a user first.");
        }
        console.log(`Found host user: ${host.name} (${host._id})`);

        // Create a new meeting
        const meeting = await Meeting.create({
            title: "Project Launch & Roadmap Sync",
            description: "Review of database schemas, authentication choices, and responsive layout designs.",
            host: host._id,
            startTime: new Date(),
            duration: 10,
            type: "Team",
            status: "scheduled",
            recordingPath: "uploads/1782597777245-meeting-recording.webm",
            participants: [
                { name: "Marwan Elgammal", role: "Frontend Dev" },
                { name: "Ahmed", role: "Backend Dev" },
            ],
        });
        console.log(`Created meeting: "${meeting.title}" with ID: ${meeting._id}`);

        console.log("Setting status to 'live'...");
        await Meeting.updateOne({ _id: meeting._id }, { $set: { status: "live" } });

        console.log("Extracting audio from recording if needed...");
        const audioPath = await extractAudioIfNeeded(meeting.recordingPath);
        console.log(`Audio path: ${audioPath}`);

        console.log("Transcribing audio using Whisper (STT)...");
        const { transcript, language, duration } = await transcribeAudio(audioPath);
        console.log(`Transcription succeeded! Language: ${language}, Duration: ${duration}s`);
        console.log(`Transcript text snippet: "${transcript.substring(0, 150)}..."`);

        console.log("Storing transcript layer in MongoDB...");
        const durationSeconds = duration || meeting.duration * 60 || 0;
        await storeTranscriptLayer({ meeting, transcript, sourceAudioPath: audioPath, durationSeconds });

        console.log("Running AI analysis (summaries, decisions, tasks) via Groq...");
        const analysis = await analyzeMeetingTranscript({ transcript, meeting });
        console.log("AI analysis finished!");

        console.log("Storing knowledge layers in MongoDB...");
        await storeKnowledgeLayers({ meeting, analysis });

        console.log("Generating embeddings and upserting vectors to Vector Store...");
        await generateAndStoreEmbeddings({ meeting, transcript });

        console.log("Completing meeting and updating record...");
        await Meeting.updateOne(
            { _id: meeting._id },
            {
                $set: {
                    status: "completed",
                    endTime: new Date(),
                    duration: Math.ceil(durationSeconds / 60),
                },
            }
        );

        console.log("\n=================================");
        console.log("SUCCESS: Meeting processed successfully!");
        console.log("=================================");
    } catch (error) {
        console.error("Processing script failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

run().catch(console.error);
