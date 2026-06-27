import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import MeetingTranscript from "../models/MeetingTranscript.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const transcripts = await MeetingTranscript.find({});
    console.log("Transcripts details:");
    console.log(JSON.stringify(transcripts, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch(console.error);
