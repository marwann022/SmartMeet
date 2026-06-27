import OpenAI from "openai";
import { ingestMeeting, searchMeetings } from "../services/ragService.js";
import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";

let groq = null;

const getGroq = () => {
  if (!groq) {
    groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return groq;
};

export const handleQuery = async (req, res) => {
  try {
    const { question, teamId, sessionId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    // 1. Get or create chat session
    let session = null;
    let isNewSession = false;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, user: req.user._id });
    }

    if (!session) {
      // Create new session using the first few words of the question as title
      const title = question.trim().substring(0, 30) + (question.trim().length > 30 ? "..." : "");
      session = await ChatSession.create({
        user: req.user._id,
        title,
      });
      isNewSession = true;
    }

    // 2. Perform semantic search
    const results = await searchMeetings(question, teamId || null, 5);
    const matches = results.matches || [];

    let answer = "";
    let sources = [];

    if (matches.length === 0) {
      answer = "I cannot find any recorded meeting discussions regarding this topic.";
    } else {
      const contextPassages = matches.map((m) => {
        return `[Meeting: ${m.metadata?.title || m.metadata?.meetingId || m.metadata?.meeting_id}] ${m.metadata?.text || m.text || ""}`;
      });

      const contextString = contextPassages.join("\n\n---\n\n");

      const completion = await getGroq().chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are the SmartMeet Organizational Assistant. Answer the user's question using ONLY the provided meeting transcript context. Keep your answer concise and conversational. If the answer cannot be found in the context, say "I cannot find any recorded meeting discussions regarding this topic."

CONTEXT FROM PAST MEETINGS:
${contextString}`,
          },
          { role: "user", content: question },
        ],
        temperature: 0.2,
        max_tokens: 512,
      });

      answer = completion.choices[0]?.message?.content || "I could not generate an answer.";

      sources = matches.map((m) => ({
        meetingId: m.metadata?.meetingId || m.metadata?.meeting_id || "unknown",
        title: m.metadata?.title || "",
        snippet: (m.metadata?.text || m.text || "").substring(0, 300),
        score: m.score || 0,
      }));
    }

    // 3. Save ChatMessage records
    try {
      // Save User Message
      await ChatMessage.create({
        session: session._id,
        role: "user",
        text: question,
      });

      // Save Assistant Message
      await ChatMessage.create({
        session: session._id,
        role: "assistant",
        text: answer,
        sources,
      });

      // Update session's updatedAt time to sort active sessions at the top
      await ChatSession.updateOne({ _id: session._id }, { $set: { updatedAt: new Date() } });
    } catch (saveErr) {
      console.error("Failed to save ChatMessages:", saveErr);
    }

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      sessionTitle: session.title,
      isNewSession,
      answer,
      sources,
    });
  } catch (error) {
    console.error("RAG Query Error:", error);
    return res.status(500).json({ success: false, message: "Failed to process semantic search." });
  }
};

export const handleIngest = async (req, res) => {
  try {
    const { meetings } = req.body;

    if (!meetings || !Array.isArray(meetings) || meetings.length === 0) {
      return res.status(400).json({ success: false, message: "Meetings array is required" });
    }

    const results = [];
    for (const meeting of meetings) {
      const result = await ingestMeeting(
        meeting.meetingId,
        meeting.teamId || "default",
        meeting.title,
        meeting.transcript
      );
      results.push(result);
    }

    return res.status(200).json({ success: true, ingested: results });
  } catch (error) {
    console.error("RAG Ingest Error:", error);
    return res.status(500).json({ success: false, message: "Failed to ingest meetings." });
  }
};

export const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("Get Sessions Error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve conversations." });
  }
};

export const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findOne({ _id: sessionId, user: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }

    const messages = await ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve conversation messages." });
  }
};

export const deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findOneAndDelete({ _id: sessionId, user: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }

    // Cascade delete messages
    await ChatMessage.deleteMany({ session: sessionId });

    return res.status(200).json({ success: true, message: "Conversation deleted successfully." });
  } catch (error) {
    console.error("Delete Session Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete conversation." });
  }
};
