import { pipeline } from "@xenova/transformers";

let extractor = null;

const getExtractor = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return extractor;
};

export const getEmbedding = async (text) => {
  const e = await getExtractor();
  const result = await e(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
};
