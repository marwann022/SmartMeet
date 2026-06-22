import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { ingestMeeting } from "../services/ragService.js";

const meetings = JSON.parse(
  fs.readFileSync("./src/data/meetings.json", "utf-8")
);

const run = async () => {
  console.log(`Ingesting ${meetings.length} meetings into Pinecone...`);

  for (const meeting of meetings) {
    console.log(`  Processing: ${meeting.title} (${meeting.meetingId})`);
    const result = await ingestMeeting(
      meeting.meetingId,
      meeting.teamId || "team1",
      meeting.title,
      meeting.transcript
    );
    console.log(`    ✓ ${result.chunksCount} chunks indexed`);
  }

  console.log("Done! All meetings ingested.");
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
