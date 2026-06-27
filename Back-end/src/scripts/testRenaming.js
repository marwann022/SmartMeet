import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import Meeting from "../models/Meeting.js";
import User from "../models/User.js";
import { uploadRecording } from "../controllers/meetingController.js";

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const host = await User.findOne({});
        if (!host) {
            throw new Error("No users found to act as host.");
        }

        // 1. Create a dummy meeting
        const meeting = await Meeting.create({
            title: "Sprint 1 Kickoff Session",
            description: "Planning sprint deliverables.",
            host: host._id,
            startTime: new Date(),
            duration: 15,
            status: "scheduled",
        });
        console.log(`Created test meeting: "${meeting.title}" with ID: ${meeting._id}`);

        // 2. Create a dummy temporary upload file
        const tempFilename = `temp-${Date.now()}.webm`;
        const tempPath = path.join("uploads", tempFilename);
        await fs.writeFile(tempPath, "mock video content data");
        console.log(`Created mock temporary file at: ${tempPath}`);

        // 3. Mock Express req and res objects
        const req = {
            params: { id: meeting._id.toString() },
            user: { _id: host._id },
            file: {
                path: tempPath,
                originalname: "recording.webm",
            },
        };

        let responseData = null;
        let responseStatus = null;

        const res = {
            status(code) {
                responseStatus = code;
                return this;
            },
            json(data) {
                responseData = data;
                return this;
            },
        };

        // 4. Invoke the controller action
        console.log("Invoking uploadRecording controller...");
        await uploadRecording(req, res);

        console.log("Response status:", responseStatus || 200);
        console.log("Response data:", responseData);

        if (responseData && responseData.success) {
            console.log("\nChecking disk for renamed file...");
            const exists = await fs.access(responseData.path).then(() => true).catch(() => false);
            console.log(`File renamed on disk at: ${responseData.path} -> ${exists ? "EXISTS (SUCCESS)" : "NOT FOUND (FAILED)"}`);

            // Clean up the renamed file
            if (exists) {
                await fs.unlink(responseData.path);
                console.log("Cleaned up renamed test file.");
            }
        }

        // Clean up DB records
        await Meeting.deleteOne({ _id: meeting._id });
        console.log("Cleaned up database records.");

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

run().catch(console.error);
