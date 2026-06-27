import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import MeetingTranscript from "../models/MeetingTranscript.js";
import MeetingEmbedding from "../models/MeetingEmbedding.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const meetings = await Meeting.find({});
    console.log(`\n--- MEETINGS (${meetings.length}) ---`);
    for (const m of meetings) {
      console.log(`- ID: ${m._id}\n  Title: "${m.title}"\n  Status: ${m.status}\n  recordingPath: ${m.recordingPath}`);
    }

    const transcripts = await MeetingTranscript.find({});
    console.log(`\n--- TRANSCRIPTS (${transcripts.length}) ---`);
    for (const t of transcripts) {
      console.log(`- ID: ${t._id}\n  Meeting ID: ${t.meeting}\n  Title: "${t.meetingTitle}"\n  Segments count: ${t.segments?.length || 0}\n  Overview length: ${t.overview?.summary?.length || 0}`);
    }

    const embeddings = await MeetingEmbedding.find({});
    console.log(`\n--- EMBEDDINGS (${embeddings.length}) ---`);
    console.log(`Total vector embedding records on MongoDB: ${embeddings.length}`);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch(console.error);
