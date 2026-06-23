import dotenv from "dotenv";
dotenv.config();

import { searchMeetings } from "../services/ragService.js";

const run = async () => {
  const question = process.argv[2] || "What was decided about authentication?";

  console.log(`Query: "${question}"\n`);

  const results = await searchMeetings(question, "team1", 5);

  const matches = results.matches 
    ? results.matches.map(m => m.metadata?.text || "") 
    : (results.documents?.[0] || []);
  const metadatas = results.matches 
    ? results.matches.map(m => m.metadata || {}) 
    : (results.metadatas?.[0] || []);

  if (matches.length === 0) {
    console.log("No relevant meetings found.");
    return;
  }

  console.log(`Found ${matches.length} relevant chunks:\n`);

  for (let i = 0; i < matches.length; i++) {
    const meta = metadatas[i] || {};
    console.log(`[${i + 1}] Meeting: ${meta.title || meta.meeting_id}`);
    console.log(`    ${matches[i].substring(0, 200)}...`);
    console.log();
  }
};

run().catch((err) => {
  console.error("Query failed:", err);
  process.exit(1);
});
