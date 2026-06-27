import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import User from "../models/User.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    try {
      await mongoose.connection.db.collection("meetingtranscripts").drop();
      console.log("Dropped meetingtranscripts collection");
    } catch (e) {
      console.log("meetingtranscripts collection did not exist or could not be dropped");
    }

    try {
      await mongoose.connection.db.collection("meetings").drop();
      console.log("Dropped meetings collection");
    } catch (e) {
      console.log("meetings collection did not exist or could not be dropped");
    }

    const meetings = await Meeting.find({});
    console.log(`Found ${meetings.length} meetings:`);
    for (const m of meetings) {
      console.log(`- ID: ${m._id}, Title: ${m.title}, Status: ${m.status}, recordingPath: ${m.recordingPath}`);
    }

    const users = await User.find({});
    console.log(`\nFound ${users.length} users:`);
    for (const u of users) {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}`);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch(console.error);
