import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";
import ChatMessage from "../models/ChatMessage.js";
import { getChatHistory } from "../controllers/ragController.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne({});
    if (!user) {
      throw new Error("No user found in database to act as test owner.");
    }

    // 1. Create a dummy chat message
    const msg = await ChatMessage.create({
      user: user._id,
      question: "What is the primary architecture of the SmartMeet STT server?",
      answer: "The SmartMeet STT server is built on FastAPI and utilizes faster-whisper on port 8001.",
      sources: [
        {
          meetingId: "6a404aacbfb42b8fa180b2c0",
          title: "Sprint Planning",
          snippet: "FastAPI is chosen for the STT server...",
          score: 0.95,
        },
      ],
    });
    console.log("Inserted test ChatMessage record ID:", msg._id);

    // 2. Mock req/res for getChatHistory controller
    const req = {
      user: { _id: user._id },
    };

    let responseStatus = null;
    let responseData = null;

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

    // 3. Invoke controller
    console.log("Invoking getChatHistory controller...");
    await getChatHistory(req, res);

    console.log("Response status:", responseStatus || 200);
    console.log("Found history items count:", responseData?.history?.length);
    
    if (responseData && responseData.success && responseData.history) {
      const found = responseData.history.some(m => m._id.toString() === msg._id.toString());
      console.log(`Verified test record exists in API history output: ${found ? "YES (SUCCESS)" : "NO (FAILED)"}`);
    }

    // 4. Clean up
    await ChatMessage.deleteOne({ _id: msg._id });
    console.log("Cleaned up database test records.");

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

run().catch(console.error);
