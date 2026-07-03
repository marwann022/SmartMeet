import { getEmbedding } from "./embeddingService.js";
import { queryMeetingVectors, upsertMeetingVectors } from "./vectorStoreService.js";
import { chunkTranscript } from "./chunkingService.js";

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

export const searchMeetings = async (question, teamId, topK = 5) => {
  const queryEmbedding = await getEmbedding(question);
  const results = await queryMeetingVectors({ queryEmbedding, topK });
  return results;
};

