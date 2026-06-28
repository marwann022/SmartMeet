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
Use empty arrays when data is missing. 
Important constraint: Generate the summaries, meetingOverview, topics, decisions, actionItems, and other text fields in the SAME dominant language as the transcript (e.g. if the transcript is in Arabic, write all JSON text fields, task titles, and summaries in Arabic).
${partial ? "This is one chunk of a long meeting, so preserve only facts visible in this chunk." : ""}`,
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
                content: "Return strict JSON only. Merge these partial meeting analyses into one deduplicated final analysis using the same schema. Keep decisions, tasks, deadlines, risks, questions, agreements, and disagreements specific. Important constraint: Generate all text fields, summaries, and tasks in the SAME dominant language as the partial analyses (e.g., if they are in Arabic, preserve them in Arabic).",
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

export const diarizeTranscript = async ({ transcript, meeting }) => {
    if (!process.env.GROQ_API_KEY) {
        return transcript;
    }
    const hostName = meeting.host?.name || "Marwan Elgammal";
    const pNames = (meeting.participants || []).map(p => p.name);
    const participantsList = [hostName, ...pNames].join(", ");
    try {
        const completion = await getGroq().chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert AI meeting transcription formatter.
Take the raw, unstructured Whisper transcript (which might be in Arabic, English, or mixed) and format it into a structured, chronological conversation dialogue with speaker turns and logical timestamps.
Assign speaker turns using ONLY these exact English participant names: ${participantsList || hostName}.
Estimate timestamps starting at [00:00] and incrementing them logically (e.g. [00:00], [00:15]) throughout the meeting.

For each speaker turn, output EXACTLY in this format:
[MM:SS] Participant Name: Spoken message content

Important constraints:
1. Do NOT translate the spoken text. Keep the spoken text in its original language (e.g. if the transcript is in Arabic, the spoken message content must remain in Arabic).
2. Use ONLY the exact participant names provided above in English. Do NOT translate or transliterate the participant names (e.g. do NOT write "أحمد" or "مروان", write "Ahmed" or "Marwan Elgammal" instead). If you cannot match a speaker to a participant, use "Speaker".
3. Return ONLY the formatted transcript lines. Do NOT write any introduction, notes, explanation, markdown backticks, or code blocks.`
                },
                {
                    role: "user",
                    content: `Raw transcript: "${transcript}"`
                }
            ],
            temperature: 0.1,
            max_tokens: 3500
        });

        return completion.choices[0]?.message?.content || transcript;
    } catch (err) {
        console.error("Diarization failed:", err);
        return transcript;
    }
};

export const liveExtractTaskFromText = async (text) => {
    if (!process.env.GROQ_API_KEY) {
        return [];
    }
    try {
        const completion = await getGroq().chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `Return strict JSON only. Detect if this live meeting speech snippet contains any clear action items, tasks, or commitments. If yes, extract them. If no, return an empty array.
Extract the task title and assignee in the same language as the spoken snippet (e.g., if the speaker speaks Arabic, return the task title in Arabic).
Schema:
{
  "tasks": [
    {
      "title": "string (clear summary of the task)",
      "assignee": "string (name of person assigned, or 'You' or 'Unassigned')",
      "priority": "LOW | MED | HIGH"
    }
  ]
}`
                },
                {
                    role: "user",
                    content: `Transcript text: "${text}"`
                }
            ],
            temperature: 0.1,
            max_tokens: 600,
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(completion.choices[0]?.message?.content);
        return parsed.tasks || [];
    } catch (err) {
        console.error("Failed to parse live extract tasks:", err);
        return [];
    }
};
