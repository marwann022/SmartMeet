import MeetingTranscript from "../models/MeetingTranscript.js";
import MeetingKnowledge from "../models/MeetingKnowledge.js";
import ActionItem from "../models/ActionItem.js";
import { chunkTranscript } from "./chunkingService.js";
import { generateEmbeddingsForChunks } from "./embeddingService.js";
import { upsertMeetingVectors } from "./vectorStoreService.js";

export const storeTranscriptLayer = async ({ meeting, transcript, sourceAudioPath, durationSeconds = 0 }) => {
    const chunks = chunkTranscript(transcript);

    return MeetingTranscript.findOneAndUpdate(
        { meeting: meeting._id },
        {
            meeting: meeting._id,
            transcript,
            sourceAudioPath: sourceAudioPath || "",
            durationSeconds,
            chunks,
        },
        { upsert: true, returnDocument: "after", runValidators: true }
    );
};

export const storeKnowledgeLayers = async ({ meeting, analysis }) => {
    const knowledge = await MeetingKnowledge.findOneAndUpdate(
        { meeting: meeting._id },
        {
            meeting: meeting._id,
            summary: analysis.summary || "No summary generated.",
            meetingOverview: analysis.meetingOverview || "",
            topics: analysis.topics || [],
            participants: (meeting.participants || []).map((participant) => participant.name),
            decisions: normalizeNotes(analysis.decisions),
            deadlines: normalizeNotes(analysis.deadlines),
            risks: normalizeNotes(analysis.risks),
            openQuestions: normalizeNotes(analysis.openQuestions),
            agreements: normalizeNotes(analysis.agreements),
            disagreements: normalizeNotes(analysis.disagreements),
            followUpTasks: normalizeNotes(analysis.followUpTasks),
            analysisModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        },
        { upsert: true, returnDocument: "after", runValidators: true }
    );

    await ActionItem.deleteMany({ meeting: meeting._id });
    if (Array.isArray(analysis.actionItems) && analysis.actionItems.length > 0) {
        await ActionItem.insertMany(analysis.actionItems.map((item) => ({
            meeting: meeting._id,
            title: item.title || item.text || "Untitled action item",
            description: item.description || item.sourceText || "",
            assignedTo: item.assignedTo || item.owner || "Unassigned",
            deadline: parseOptionalDate(item.deadline),
            priority: ["low", "medium", "high"].includes(item.priority) ? item.priority : "medium",
            sourceText: item.sourceText || item.text || "",
        })));
    }

    return knowledge;
};

export const generateAndStoreEmbeddings = async ({ meeting, transcript }) => {
    const chunks = chunkTranscript(transcript);
    const chunksWithEmbeddings = await generateEmbeddingsForChunks(chunks);
    const result = await upsertMeetingVectors({
        meeting: meeting._id,
        meetingId: meeting.meetingId,
        title: meeting.title,
        chunksWithEmbeddings,
    });

    await MeetingTranscript.updateOne(
        { meeting: meeting._id },
        {
            $set: {
                chunks: chunks.map((chunk) => ({
                    ...chunk,
                    vectorId: `${meeting.meetingId}_chunk_${chunk.index}`,
                    embeddingStored: true,
                })),
            },
        }
    );

    return result;
};

const normalizeNotes = (notes = []) => notes.map((note) => ({
    text: note.text || note.title || note.description || "",
    owner: note.owner || note.assignedTo || "",
    deadline: parseOptionalDate(note.deadline),
    confidence: typeof note.confidence === "number" ? note.confidence : 0.8,
})).filter((note) => note.text);

const parseOptionalDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};
