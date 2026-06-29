import OpenAI from "openai";
import { ingestMeeting, searchMeetings } from "../services/ragService.js";
import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";
import Meeting from "../models/Meeting.js";
import MeetingEmbedding from "../models/MeetingEmbedding.js";
import { getEmbedding } from "../services/embeddingService.js";

const cosineSimilarity = (a, b) => {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

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

    // 2. Perform semantic search & hybrid matching
    const results = await searchMeetings(question, teamId || null, 5);
    let matches = results.matches || [];

    // Title-matching boost: if the question refers to a meeting title, fetch its chunks directly
    try {
      const meetings = await Meeting.find({ host: req.user._id }, "title _id meetingId");
      const matchedMeetings = [];
      const lowerQuestion = question.toLowerCase();

      for (const m of meetings) {
        if (m.title && m.title.trim().length >= 3) {
          const cleanTitle = m.title.trim().toLowerCase();
          // Match direct title substrings or clean quote wraps
          if (lowerQuestion.includes(cleanTitle) || lowerQuestion.includes(`"${cleanTitle}"`) || lowerQuestion.includes(`'${cleanTitle}'`)) {
            matchedMeetings.push(m);
          }
        }
      }

      if (matchedMeetings.length > 0) {
        console.log(`[RAG] Matched query to meeting titles:`, matchedMeetings.map(m => m.title));
        const matchedIds = matchedMeetings.map(m => m._id);
        const candidates = await MeetingEmbedding.find({ meeting: { $in: matchedIds } })
          .select("+embedding text metadata vectorId");

        if (candidates.length > 0) {
          const queryEmbedding = await getEmbedding(question);
          const matchedChunks = candidates.map((candidate) => {
            const metadataObj = candidate.metadata instanceof Map 
              ? Object.fromEntries(candidate.metadata) 
              : candidate.metadata || {};
            return {
              id: candidate.vectorId,
              score: cosineSimilarity(queryEmbedding, candidate.embedding) + 0.6, // heavily boost title matches
              metadata: metadataObj,
              text: candidate.text,
            };
          });

          // Merge lists and deduplicate by vectorId / id
          const allMatches = [...matchedChunks, ...matches];
          const seenIds = new Set();
          matches = allMatches.filter((item) => {
            const key = item.id || item.vectorId;
            if (seenIds.has(key)) return false;
            seenIds.add(key);
            return true;
          });

          // Sort by score
          matches.sort((a, b) => b.score - a.score);
          matches = matches.slice(0, 5);
        }
      }
    } catch (titleMatchErr) {
      console.warn("Title hybrid matching failed, using standard semantic search:", titleMatchErr);
    }

    let answer = "";
    let sources = [];

    if (matches.length === 0) {
      answer = "I cannot find any recorded meeting discussions regarding this topic.";
    } else {
      const contextPassages = matches.map((m) => {
        return `[Meeting: ${m.metadata?.title || m.metadata?.meetingId || m.metadata?.meeting_id}] ${m.metadata?.text || m.text || ""}`;
      });

      const contextString = contextPassages.join("\n\n---\n\n");

      const systemPrompt = `You are the SmartMeet Organizational Assistant. Answer the user's question using ONLY the provided meeting transcript context. Keep your answer concise and conversational. If the answer cannot be found in the context, say "I cannot find any recorded meeting discussions regarding this topic."

Constraint: You MUST reply in the same language as the user's question (e.g. if the user asks in Arabic, you must translate the relevant context facts and answer in Arabic).

CONTEXT FROM PAST MEETINGS:
${contextString}`;

      let completion;
      try {
        completion = await getGroq().chat.completions.create({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          temperature: 0.2,
          max_tokens: 512,
        });
      } catch (err) {
        if (err.status === 429) {
          console.warn("Groq rate limit hit. Falling back to llama-3.1-8b-instant...");
          completion = await getGroq().chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: question },
            ],
            temperature: 0.2,
            max_tokens: 512,
          });
        } else {
          throw err;
        }
      }

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
