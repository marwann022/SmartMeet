import { getEmbedding } from "./embeddingService.js";
import { upsertVectors, queryVectors } from "./pineconeStore.js";

export const chunkTranscript = (transcript, chunkSize = 500, overlap = 100) => {
  const chunks = [];
  let start = 0;

  while (start < transcript.length) {
    const end = start + chunkSize;
    chunks.push(transcript.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
};

export const ingestMeeting = async (meetingId, teamId, title, transcript) => {
  const chunks = chunkTranscript(transcript);
  const vectors = [];

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await getEmbedding(chunks[i]);
    vectors.push({
      id: `${meetingId}_chunk_${i}`,
      values: embedding,
      metadata: {
        meeting_id: meetingId,
        team_id: teamId,
        title,
        chunk_index: i,
        text: chunks[i],
      },
    });
  }

  await upsertVectors(vectors);
  return { chunksCount: chunks.length, meetingId };
};

export const searchMeetings = async (question, teamId, topK = 5) => {
  const queryEmbedding = await getEmbedding(question);
  const results = await queryVectors(queryEmbedding, topK);
  return results;
};
