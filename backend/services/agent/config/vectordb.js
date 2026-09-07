import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.js";
import dotenv from "dotenv";

dotenv.config();

export const VectorStore = async (docs, collectionName) => {
  return await QdrantVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      url: process.env.QDRANT_URL,
      collectionName,
    }
  );
};
