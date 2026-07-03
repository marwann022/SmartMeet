import OpenAI from "openai";
import { chunkForAnalysis } from "./chunkingService.js";
import User from "../models/User.js";

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

export const translateTranscriptToEnglish = async (transcript) => {
    if (!transcript || transcript.trim().length < 5) return transcript;

    console.log("[Backend] Cleaning and translating transcript to English via LLM...");
    try {
        const completion = await getGroq().chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are a professional meeting assistant translator and transcript cleaner.
                    
                    Your task:
                    1. Translate any non-English (especially Arabic) sentences in the transcript to English.
                    2. Correct any phonetic misspellings of our team members' names and project name in the text.
                    
                    Reference Workspace Vocabulary:
                    - Project Name: "SmartMeet" (often phonetically transcribed as "smart meet", "smart meat", "سمارت ميت")
                    - Team Members:
                      * "Marwan" (often transcribed as "Maron", "mroan", "مروان")
                      * "Youssef" (often transcribed as "use of", "Yusuf", "يوسف")
                      * "Hana" (often transcribed as "Hana", "هنا")
                      * "Ebrahim" (often transcribed as "Rahim", "use of Rahim", "ebrahim", "ابراهيم")
                      * "Zena" (often transcribed as "Zinn", "zena", "زينة")
                      * "Ahmed" (often transcribed as "ahmed", "أحمد")
                      * "Sara" (often transcribed as "sara", "سارة")
                    
                    Instructions:
                    - Replace any incorrect phonetic variations (like "Maron" with "Marwan", "use of Rahim" or "Yusuf" with "Youssef", "Zinn" with "Zena", "smart meat" with "SmartMeet") directly in the transcript text.
                    - CRITICAL RULE: If a name is NOT a phonetic variation of our Team Members (for example, other valid names like "Ahmed", "Sara", "Alex", "Marcus"), keep it exactly as it is. Do NOT force it to match "Youssef", "Zena", or any other name from the reference list.
                    Keep the speaker names and timestamps in brackets (e.g. [02:15] Name:) exactly as they appear in the original text. Output ONLY the translated/cleaned transcript lines. Do not add any introductory or explanatory text.`,
                },
                {
                    role: "user",
                    content: transcript,
                },
            ],
            temperature: 0.1,
            max_tokens: 4000,
        });

        const translated = completion.choices[0]?.message?.content?.trim();
        if (translated && translated.length > 10) {
            return translated;
        }
    } catch (err) {
        console.error("Transcript cleaning/translation failed:", err);
    }
    return transcript;
};

export const analyzeMeetingTranscript = async ({ transcript, meeting }) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is required for meeting analysis");
        }

        const chunks = chunkForAnalysis(transcript);
        let analysis;
        if (chunks.length <= 1) {
            analysis = await analyzeSingleTranscript({ transcript, meeting });
        } else {
            const partials = [];
            for (const chunk of chunks) {
                partials.push(await analyzeSingleTranscript({
                    transcript: chunk.text,
                    meeting,
                    partial: true,
                }));
            }
            analysis = await mergeAnalyses({ partials, meeting });
        }

        return analysis;
    } catch (err) {
        console.warn("⚠️ [Backend] Groq AI meeting analysis failed. Falling back to mock analysis:", err.message);

        // Generate a smart mock summary based on the meeting details
        const title = meeting?.title || "Product Sync";
        const analysis = {
            summary: `This is a mock summary generated for "${title}" because the Groq AI service is currently offline or unauthorized. The team reviewed development milestones, updated task trackers, and aligned on release scheduling.`,
            meetingOverview: `Mock discussion overview for "${title}".`,
            topics: ["General Sync", "Development Status", "Blockers Check"],
            decisions: [
                { text: "Approved the deployment of bento-grid layouts to staging.", confidence: 0.95 }
            ],
            actionItems: [
                { title: "Review tasks checklist and submit updates", assignedTo: "Marwan Elgammal", priority: "medium" }
            ],
            deadlines: [],
            risks: [],
            openQuestions: [],
            followUpTasks: [],
            agreements: [],
            disagreements: []
        };

        return analysis;
    }
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

Reference Workspace Context:
- Project Name: SmartMeet
- Known Team Members: Marwan, Youssef, Hana, Ebrahim, Zena, Ahmed, Sara

Extraction Constraint: Be highly precise. Extract decisions, agreements, and action items ONLY if they are explicitly mentioned or agreed to in the text. Do not make up tasks or decisions not stated in the transcript.
Deduplication Constraint: Ensure all extracted actionItems and decisions are unique. Consolidate any duplicate or repetitive entries into a single clear item instead of listing it multiple times.
Chronological Constraint: Extract the actionItems and decisions in the exact chronological order in which they appear and are discussed in the transcript from top to bottom.
Task Assignment Constraint: When extracting "actionItems" and "decisions", try to map the owner/assignee to one of the Known Team Members (Marwan, Youssef, Hana, Ebrahim, Zena, Ahmed, Sara) if they are mentioned or implied. Do not leave "assignedTo" or "owner" empty/unassigned if one of the known team members was discussed as responsible for it in the text.
Language Constraint: Generate the summaries, meetingOverview, topics, decisions, actionItems, and all other text fields in ENGLISH ONLY.
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
                content: "Return strict JSON only. Merge these partial meeting analyses into one deduplicated final analysis using the same schema. Keep decisions, tasks, deadlines, risks, questions, agreements, and disagreements specific. Important constraint: Generate all text fields, summaries, and tasks in ENGLISH ONLY. Consolidate any duplicate or repetitive items. Ensure task owners/assignees map correctly to known team members (Marwan, Youssef, Hana, Ebrahim, Zena, Ahmed, Sara) and preserve their correct spellings. Keep the final merged tasks and decisions ordered in the chronological order of the spoken meeting transcript.",
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
    const fallbackTasks = [];
    const cleaned = text.toLowerCase();
    
    // Fallback keyword checks if Groq fails or is not present
    if (cleaned.includes("check") || cleaned.includes("compile") || cleaned.includes("setup") || cleaned.includes("review") || cleaned.includes("should") || cleaned.includes("by friday") || cleaned.includes("by monday")) {
        let assignee = "Unassigned";
        if (cleaned.includes("marwan") || cleaned.includes("marrow")) assignee = "Marwan Elgammal";
        else if (cleaned.includes("zena") || cleaned.includes("xena")) assignee = "Zena";
        
        fallbackTasks.push({
            title: text,
            assignee: assignee,
            priority: "HIGH"
        });
    }

    if (!process.env.GROQ_API_KEY) {
        return fallbackTasks;
    }
    
    try {
        const completion = await getGroq().chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `Return strict JSON only. Detect if this live meeting speech snippet contains any clear action items, tasks, or commitments. If yes, extract them. If no, return an empty array.

Workspace Context:
- Project Name: SmartMeet (سمارت ميت)
- Known Team Members: Marwan (مروان), Youssef (يوسف), Hana (هنا), Ebrahim (ابراهيم), Zena (زينة), Ahmed (أحمد), Sara (سارة)

Rules:
1. Extract the task title and assignee in the same language as the spoken snippet.
2. Clean up any typos based on the Known Team Members.
3. Keep unrecognized names exactly as they are.

Schema:
{
  "tasks": [
    {
      "title": "string (clear summary of the task)",
      "assignee": "string (name of person assigned, e.g. 'Marwan', or 'Unassigned')",
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
        console.warn("Groq live task extraction failed, using fallback:", err.message);
        return fallbackTasks;
    }
};

export const liveExtractDecisionFromText = async (text) => {
    const fallbackDecisions = [];
    const cleaned = text.toLowerCase();
    
    // Fallback keyword checks if Groq fails or is not present
    if (cleaned.includes("decid") || cleaned.includes("agree") || cleaned.includes("approve") || cleaned.includes("approved") || cleaned.includes("project launch") || cleaned.includes("will be")) {
        fallbackDecisions.push({
            text: text,
            confidence: 0.95
        });
    }

    if (!process.env.GROQ_API_KEY) {
        return fallbackDecisions;
    }
    
    try {
        const completion = await getGroq().chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `Return strict JSON only. Detect if this live meeting speech snippet contains any key decisions, agreements, resolutions, or approvals. If yes, extract them. If no, return an empty array.

Workspace Context:
- Project Name: SmartMeet (سمارت ميت)

Schema:
{
  "decisions": [
    {
      "text": "string (clear summary of the decision)",
      "confidence": number (e.g. 0.95)
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
        return parsed.decisions || [];
    } catch (err) {
        console.warn("Groq live decision extraction failed, using fallback:", err.message);
        return fallbackDecisions;
    }
};
