import MeetingEmbedding from "../models/MeetingEmbedding.js";
import { addVectors as addChromaVectors, queryVectors as queryChromaVectors } from "./vectorStore.js";
import { upsertVectors as upsertPineconeVectors, queryVectors as queryPineconeVectors } from "./pineconeStore.js";

const getProvider = () => (process.env.VECTOR_STORE_PROVIDER || "mongo").toLowerCase();

export const upsertMeetingVectors = async ({ meeting, meetingId, title, chunksWithEmbeddings }) => {
    const provider = getProvider();
    const vectorDocuments = chunksWithEmbeddings.map((chunk) => ({
        vectorId: `${meetingId}_chunk_${chunk.index}`,
        chunk,
        metadata: {
            meetingId,
            meeting: meeting.toString(),
            title,
            chunkIndex: chunk.index,
            text: chunk.text,
        },
    }));

    await MeetingEmbedding.bulkWrite(
        vectorDocuments.map((doc) => ({
            updateOne: {
                filter: { vectorId: doc.vectorId },
                update: {
                    $set: {
                        meeting,
                        vectorId: doc.vectorId,
                        chunkIndex: doc.chunk.index,
                        text: doc.chunk.text,
                        embedding: doc.chunk.embedding,
                        metadata: doc.metadata,
                    },
                },
                upsert: true,
            },
        })),
        { ordered: false }
    );

    if (provider === "pinecone") {
        await upsertPineconeVectors(vectorDocuments.map((doc) => ({
            id: doc.vectorId,
            values: doc.chunk.embedding,
            metadata: doc.metadata,
        })));
    }

    if (provider === "chroma") {
        await addChromaVectors(
            vectorDocuments.map((doc) => doc.vectorId),
            vectorDocuments.map((doc) => doc.chunk.embedding),
            vectorDocuments.map((doc) => doc.metadata),
            vectorDocuments.map((doc) => doc.chunk.text)
        );
    }

    return {
        provider,
        count: vectorDocuments.length,
        vectorIds: vectorDocuments.map((doc) => doc.vectorId),
    };
};

export const queryMeetingVectors = async ({ queryEmbedding, topK = 5, meetingId }) => {
    const provider = getProvider();

    if (provider === "pinecone") {
        return queryPineconeVectors(queryEmbedding, topK);
    }

    if (provider === "chroma") {
        const filter = meetingId ? { meetingId } : {};
        return queryChromaVectors(queryEmbedding, topK, filter);
    }

    const candidates = await MeetingEmbedding.find(meetingId ? { "metadata.meetingId": meetingId } : {})
        .select("+embedding text metadata vectorId")
        .limit(1000);

    const scored = candidates
        .map((candidate) => ({
            id: candidate.vectorId,
            score: cosineSimilarity(queryEmbedding, candidate.embedding),
            metadata: Object.fromEntries(candidate.metadata || []),
            text: candidate.text,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    return { provider, matches: scored };
};

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
