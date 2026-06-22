import { ChromaClient } from "chromadb";

const CHROMA_HOST = process.env.CHROMA_HOST || "localhost";
const CHROMA_PORT = parseInt(process.env.CHROMA_PORT || "8000");
const COLLECTION_NAME = "smartmeet_meetings";

let client = null;
let collection = null;

const getClient = () => {
  if (!client) {
    client = new ChromaClient({
      host: CHROMA_HOST,
      port: CHROMA_PORT,
    });
  }
  return client;
};

export const getOrCreateCollection = async () => {
  if (collection) return collection;

  const c = getClient();
  collection = await c.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { "hnsw:space": "cosine" },
  });
  return collection;
};

export const addVectors = async (ids, embeddings, metadatas, documents) => {
  const col = await getOrCreateCollection();
  await col.add({ ids, embeddings, metadatas, documents });
};

export const queryVectors = async (queryEmbedding, nResults = 5, filter = {}) => {
  const col = await getOrCreateCollection();
  const results = await col.query({
    queryEmbeddings: [queryEmbedding],
    nResults,
    where: filter,
    include: ["metadatas", "documents", "distances"],
  });
  return results;
};

export const deleteCollection = async () => {
  const c = getClient();
  await c.deleteCollection({ name: COLLECTION_NAME });
  collection = null;
};
