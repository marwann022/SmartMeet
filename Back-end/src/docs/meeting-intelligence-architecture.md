# SmartMeet Meeting Intelligence Architecture

## Workflow

1. Jitsi ends a meeting and the client uploads the recording to `POST /api/meetings/:id/upload-recording`.
2. `POST /api/meetings/:id/process` extracts audio with ffmpeg when the upload is video.
3. The backend sends mp3/wav audio to the FastAPI Faster-Whisper service at `STT_SERVICE_URL`.
4. The transcript is stored as raw data in `MeetingTranscript`.
5. Groq Llama 3.3 70B returns strict JSON meeting intelligence.
6. Summary-level knowledge is stored in `MeetingKnowledge`.
7. Structured items are stored in `MeetingKnowledge` and `ActionItem`.
8. Transcript chunks are embedded with `@xenova/transformers`.
9. Embeddings are stored in MongoDB by default. Set `VECTOR_STORE_PROVIDER=pinecone` or `chroma` to mirror vectors to an external store.

## Three Storage Layers

- Level 1 raw data: `MeetingTranscript.transcript` keeps the original transcript for auditability.
- Level 2 knowledge summary: `MeetingKnowledge.summary`, `topics`, `participants`, and `meetingOverview` power fast overview pages.
- Level 3 structured knowledge: `MeetingKnowledge.decisions`, `risks`, `openQuestions`, `agreements`, `disagreements`, and `ActionItem` support direct filtering without scanning long text.

## Retrieval Strategy

Use direct MongoDB queries for factual structured questions such as decisions, deadlines, assignees, risks, and task status. This is faster, cheaper, and deterministic.

Use RAG retrieval for semantic or exploratory questions such as "What was discussed about authentication?" because the answer may live in unstructured transcript text.

## Long Meeting Handling

Transcripts are chunked with overlap before analysis and embedding. Analysis chunks are larger to reduce Groq calls; embedding chunks are smaller to improve semantic search quality.
