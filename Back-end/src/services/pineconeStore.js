import { Pinecone } from "@pinecone-database/pinecone";

let pc = null;
let index = null;

const getClient = () => {
  if (!pc) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) throw new Error("PINECONE_API_KEY is not set in .env");
    pc = new Pinecone({ apiKey });
  }
  return pc;
};

const getIndexName = () => process.env.PINECONE_INDEX || "smartmeet-meetings";

const getIndex = () => {
  if (!index) {
    const client = getClient();
    index = client.index(getIndexName());
  }
  return index;
};

export const upsertVectors = async (vectors, namespace = "") => {
  const idx = getIndex();
  await idx.namespace(namespace).upsert({ records: vectors });
};

export const queryVectors = async (queryEmbedding, topK = 5, namespace = "") => {
  const idx = getIndex();
  const results = await idx.namespace(namespace).query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    includeValues: false,
  });
  return results;
};

export const deleteAllVectors = async (namespace = "") => {
  const idx = getIndex();
  await idx.namespace(namespace).deleteAll();
};
