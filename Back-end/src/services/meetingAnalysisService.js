import OpenAI from "openai";
import { chunkForAnalysis } from "./chunkingService.js";

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

const emptyAnalysis = () => ({
    summary: "",
    meetingOverview: "",
    decisions: [],
    actionItems: [],
    deadlines: [],
    risks: [],
    openQuestions: [],
    topics: [],
    followUpTasks: [],
    agreements: [],
    disagreements: [],
});

export const analyzeMeetingTranscript = async ({ transcript, meeting }) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is required for meeting analysis");
    }

    const chunks = chunkForAnalysis(transcript);
    if (chunks.length <= 1) {
        return analyzeSingleTranscript({ transcript, meeting });
    }

    const partials = [];
    for (const chunk of chunks) {
        partials.push(await analyzeSingleTranscript({
            transcript: chunk.text,
            meeting,
            partial: true,
        }));
    }

    return mergeAnalyses({ partials, meeting });
};

const analyzeSingleTranscript = async ({ transcript, meeting, partial = false }) => {
    const completion = await getGroq().chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `Return strict JSON only. Extract meeting intelligence with this schema:
{
  "summary": "string",
  "meetingOverview": "string",
  "decisions": [{"text":"string","owner":"string","deadline":"YYYY-MM-DD or null","confidence":0.8}],
  "actionItems": [{"title":"string","description":"string","assignedTo":"string","deadline":"YYYY-MM-DD or null","priority":"low|medium|high","sourceText":"string"}],
  "deadlines": [{"text":"string","owner":"string","deadline":"YYYY-MM-DD or null","confidence":0.8}],
  "risks": [{"text":"string","owner":"string","deadline":"YYYY-MM-DD or null","confidence":0.8}],
  "openQuestions": [{"text":"string","owner":"string","deadline":"YYYY-MM-DD or null","confidence":0.8}],
  "topics": ["string"],
  "followUpTasks": [{"text":"string","owner":"string","deadline":"YYYY-MM-DD or null","confidence":0.8}],
  "agreements": [{"text":"string","owner":"string","deadline":"YYYY-MM-DD or null","confidence":0.8}],
  "disagreements": [{"text":"string","owner":"string","deadline":"YYYY-MM-DD or null","confidence":0.8}]
}
Use empty arrays when data is missing. ${partial ? "This is one chunk of a long meeting, so preserve only facts visible in this chunk." : ""}`,
            },
            {
                role: "user",
                content: `Meeting title: ${meeting.title}
Meeting date: ${meeting.startTime?.toISOString?.() || ""}
Participants: ${(meeting.participants || []).map((p) => p.name).join(", ")}

Transcript:
${transcript}`,
            },
        ],
        temperature: 0.1,
        max_tokens: 3500,
        response_format: { type: "json_object" },
    });

    return parseAnalysis(completion.choices[0]?.message?.content);
};

const mergeAnalyses = async ({ partials, meeting }) => {
    const completion = await getGroq().chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "Return strict JSON only. Merge these partial meeting analyses into one deduplicated final analysis using the same schema. Keep decisions, tasks, deadlines, risks, questions, agreements, and disagreements specific.",
            },
            {
                role: "user",
                content: `Meeting title: ${meeting.title}\n\nPartial analyses:\n${JSON.stringify(partials)}`,
            },
        ],
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: "json_object" },
    });

    return parseAnalysis(completion.choices[0]?.message?.content);
};

const parseAnalysis = (content) => {
    try {
        return normalizeAnalysis(JSON.parse(content));
    } catch (error) {
        const match = content?.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("AI analysis did not return valid JSON");
        return normalizeAnalysis(JSON.parse(match[0]));
    }
};

const normalizeAnalysis = (analysis) => {
    const normalized = { ...emptyAnalysis(), ...analysis };
    const arrayFields = [
        "decisions",
        "actionItems",
        "deadlines",
        "risks",
        "openQuestions",
        "topics",
        "followUpTasks",
        "agreements",
        "disagreements",
    ];

    for (const field of arrayFields) {
        normalized[field] = Array.isArray(normalized[field]) ? normalized[field] : [];
    }

    return normalized;
};
