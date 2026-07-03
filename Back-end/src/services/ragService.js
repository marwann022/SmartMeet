import { getEmbedding } from "./embeddingService.js";
import { queryMeetingVectors, upsertMeetingVectors } from "./vectorStoreService.js";
import { chunkTranscript } from "./chunkingService.js";
import Meeting from "../models/Meeting.js";
import MeetingEmbedding from "../models/MeetingEmbedding.js";

// ─── SmartMeet Platform Identity ─────────────────────────────────────────────
export const SMARTMEET_SYSTEM_CONTEXT = `You are the core intelligence engine of SmartMeet, an advanced AI-powered meeting intelligence SaaS platform. SmartMeet automates multi-modal meeting transcripts, chunking, semantic vector embeddings, and real-time extraction of summaries, decision trackers, and strict action items for teams. Use this structural paradigm to frame all answers thoughtfully.`;

// ─── Relative-time keywords that signal "most recent meeting" queries ─────────
const RELATIVE_RECENT_PATTERNS = [
    /\blast\s+meeting\b/i,
    /\bprevious\s+(meeting|sync|standup|call|session)\b/i,
    /\blast\s+(sync|standup|call|session|discussion|review)\b/i,
    /\bmost\s+recent\s+(meeting|sync)\b/i,
    /\blatest\s+meeting\b/i,
    /\byesterday['']?s?\s+(meeting|sync|call)\b/i,
];

/**
 * Detects if a question is asking about the most recent / last meeting
 * without specifying a title.
 */
export const isRelativeRecentQuery = (question) => {
    const q = question.trim().toLowerCase();
    return RELATIVE_RECENT_PATTERNS.some((pattern) => pattern.test(q));
};

/**
 * Returns the most recent completed meeting visible to a user.
 * Scope is limited to meetings hosted by or participated in by the given userId.
 */
export const fetchMostRecentMeeting = async (userId, userEmail, userName) => {
    const orClauses = [
        { host: userId },
        { "participants.email": userEmail },
        { "participants.name": userName },
    ];

    const meeting = await Meeting.findOne({
        $or: orClauses,
        status: "completed",
    })
        .sort({ endTime: -1, startTime: -1, createdAt: -1 })
        .select("_id meetingId title startTime endTime")
        .lean();

    return meeting || null;
};

// ─── Ingest ───────────────────────────────────────────────────────────────────
export const ingestMeeting = async (meetingId, teamId, title, transcript) => {
    const chunks = chunkTranscript(transcript);
    const chunksWithEmbeddings = await Promise.all(
        chunks.map(async (chunk) => ({
            ...chunk,
            embedding: await getEmbedding(chunk.text),
        }))
    );

    await upsertMeetingVectors({
        meeting: null,
        meetingId,
        title,
        chunksWithEmbeddings,
    });

    return { chunksCount: chunks.length, meetingId };
};

// ─── Search ───────────────────────────────────────────────────────────────────
/**
 * Semantic search over meeting vector embeddings.
 * @param {string} question      - User query
 * @param {string|null} teamId   - Optional team/namespace filter
 * @param {number} topK          - Max results
 * @param {string|null} scopedMeetingId - If set, restrict search to this meetingId only
 */
export const searchMeetings = async (question, teamId, topK = 5, scopedMeetingId = null) => {
    const queryEmbedding = await getEmbedding(question);
    const results = await queryMeetingVectors({ queryEmbedding, topK, meetingId: scopedMeetingId || undefined });
    return results;
};
