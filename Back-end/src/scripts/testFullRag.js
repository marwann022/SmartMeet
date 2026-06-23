import dotenv from "dotenv";
dotenv.config();

import { pipeline } from "@xenova/transformers";
import { searchMeetings } from "../services/ragService.js";

const run = async () => {
  const question = process.argv[2] || "What was decided about authentication?";

  console.log(`Question: "${question}"\n---\n`);

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

  const contextPassages = matches.map((doc, i) => {
    const meta = metadatas[i] || {};
    return `[Meeting: ${meta.title || meta.meeting_id}] ${doc}`;
  });

  const contextString = contextPassages.join("\n\n");

  const prompt = `Answer the question using ONLY the context provided. If the answer is not in the context, say you cannot find it.

Context:
${contextString}

Question: ${question}

Answer:`;

  console.log("Generating answer with local LLM...\n");

  const generator = await pipeline("text2text-generation", "Xenova/LaMini-Flan-T5-783M");

  const output = await generator(prompt, {
    max_new_tokens: 256,
    temperature: 0.2,
    do_sample: true,
  });

  const answer = Array.isArray(output) ? output[0]?.generated_text : output;

  console.log("ANSWER:", answer);
};

run().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
