import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";
import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";
import { handleQuery, getChatSessions, getSessionMessages, deleteChatSession } from "../controllers/ragController.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne({});
    if (!user) {
      throw new Error("No user found in database to act as test owner.");
    }

    // 1. Clear any old test sessions for clean run
    await ChatSession.deleteMany({ user: user._id });
    console.log("Cleaned up old test sessions.");

    // 2. Mock handleQuery to create a new session (first prompt)
    const req1 = {
      user: { _id: user._id },
      body: {
        question: "How do we deploy the Node backend?",
        teamId: "team1",
      },
    };

    let responseData1 = null;
    const res1 = {
      status() { return this; },
      json(data) {
        responseData1 = data;
        return this;
      },
    };

    console.log("Submitting first prompt (initiating session)...");
    await handleQuery(req1, res1);
    console.log("Response 1:", {
      success: responseData1?.success,
      sessionId: responseData1?.sessionId,
      sessionTitle: responseData1?.sessionTitle,
      isNewSession: responseData1?.isNewSession,
    });

    const sessionId = responseData1?.sessionId;
    if (!sessionId) {
      throw new Error("Session ID was not generated!");
    }

    // 3. Mock handleQuery to continue the session
    const req2 = {
      user: { _id: user._id },
      body: {
        question: "Tell me more about Docker configurations.",
        teamId: "team1",
        sessionId: sessionId.toString(),
      },
    };

    let responseData2 = null;
    const res2 = {
      status() { return this; },
      json(data) {
        responseData2 = data;
        return this;
      },
    };

    console.log("\nSubmitting second prompt (continuing session)...");
    await handleQuery(req2, res2);
    console.log("Response 2:", {
      success: responseData2?.success,
      sessionId: responseData2?.sessionId,
      isNewSession: responseData2?.isNewSession,
    });

    // 4. Fetch list of sessions
    const reqList = { user: { _id: user._id } };
    let listData = null;
    const resList = {
      status() { return this; },
      json(data) {
        listData = data;
        return this;
      },
    };

    console.log("\nListing chat sessions...");
    await getChatSessions(reqList, resList);
    console.log("Sessions count:", listData?.sessions?.length);
    console.log("Active Session title:", listData?.sessions?.[0]?.title);

    // 5. Fetch messages of the active session
    const reqMessages = {
      user: { _id: user._id },
      params: { sessionId: sessionId.toString() },
    };
    let messagesData = null;
    const resMessages = {
      status() { return this; },
      json(data) {
        messagesData = data;
        return this;
      },
    };

    console.log("\nFetching messages for active session...");
    await getSessionMessages(reqMessages, resMessages);
    console.log("Messages count in session:", messagesData?.messages?.length);
    for (const m of messagesData?.messages || []) {
      console.log(`- [${m.role.toUpperCase()}]: "${m.text.substring(0, 40)}..."`);
    }

    // 6. Delete conversation session (cascade delete)
    const reqDelete = {
      user: { _id: user._id },
      params: { sessionId: sessionId.toString() },
    };
    let deleteData = null;
    const resDelete = {
      status() { return this; },
      json(data) {
        deleteData = data;
        return this;
      },
    };

    console.log("\nDeleting session...");
    await deleteChatSession(reqDelete, resDelete);
    console.log("Delete response:", deleteData);

    const remainingMessages = await ChatMessage.countDocuments({ session: sessionId });
    console.log("Remaining messages in DB for deleted session (should be 0):", remainingMessages);

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

run().catch(console.error);
