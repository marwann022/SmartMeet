import dotenv from "dotenv";
dotenv.config();

import { getEmbedding } from "./services/embeddingService.js";

const run = async () => {
  const vec = await getEmbedding("Hello RAG system");
  console.log("vector length:", vec.length);
};

run();