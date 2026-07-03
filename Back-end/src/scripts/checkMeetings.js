import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartmeet");
        console.log("Connected to MongoDB");

        const MeetingSchema = new mongoose.Schema({}, { strict: false });
        const Meeting = mongoose.model("Meeting", MeetingSchema, "meetings");

        const meetings = await Meeting.find({}).sort({ createdAt: -1 }).limit(10);
        console.log(`\nFound ${meetings.length} recent meetings:`);
        meetings.forEach(m => {
            console.log("-----------------------------------------");
            console.log(`ID: ${m._id}`);
            console.log(`Title: ${m.title}`);
            console.log(`Status: ${m.status}`);
            console.log(`Recording Path: ${m.recordingPath}`);
            console.log(`Has Transcript: ${!!m.transcript}`);
            if (m.error) {
                console.log(`Error: ${m.error}`);
            }
        });
        console.log("-----------------------------------------\n");
    } catch (err) {
        console.error("Database check failed:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
