import OpenAI from "openai";
import { ingestMeeting, searchMeetings } from "../services/ragService.js";

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
    const { question, teamId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    const results = await searchMeetings(question, teamId || null, 5);

    const matches = results.matches || [];

    if (matches.length === 0) {
      return res.status(200).json({
        success: true,
        answer: "I cannot find any recorded meeting discussions regarding this topic.",
        sources: [],
      });
    }

    const contextPassages = matches.map((m) => {
      return `[Meeting: ${m.metadata?.title || m.metadata?.meeting_id}] ${m.metadata?.text || ""}`;
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

    const answer = completion.choices[0]?.message?.content || "I could not generate an answer.";

    const sources = matches.map((m) => ({
      meetingId: m.metadata?.meeting_id || "unknown",
      title: m.metadata?.title || "",
      snippet: (m.metadata?.text || "").substring(0, 300),
      score: m.score || 0,
    }));

    return res.status(200).json({
      success: true,
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
