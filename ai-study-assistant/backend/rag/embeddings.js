const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { collectionNameForUser } = require('./userCollection');
const { getChromaClient, getChromaConnectionLabel } = require('./chromaClient');

const LOCAL_CHROMA_DIR = path.join(__dirname, '..', 'chroma_db');

if (!fs.existsSync(LOCAL_CHROMA_DIR)) {
  fs.mkdirSync(LOCAL_CHROMA_DIR, { recursive: true });
}

function getGeminiConfig() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. It is required for embedding generation.');
  }

  const model = (process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001').trim();
  return { apiKey, model };
}

function getModelPath(model) {
  return model.startsWith('models/') ? model : `models/${model}`;
}

async function embedTexts(texts) {
  const filtered = texts.map((text) => (typeof text === 'string' ? text.trim() : '')).filter(Boolean);
  if (!filtered.length) {
    return [];
  }

  const { apiKey, model } = getGeminiConfig();
  const modelPath = getModelPath(model);

  const embeddings = await Promise.all(
    filtered.map(async (text) => {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/${modelPath}:embedContent`,
        {
          content: {
            parts: [{ text }],
          },
        },
        {
          headers: {
            'x-goog-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      const values = response.data?.embedding?.values;
      if (!Array.isArray(values) || values.length === 0) {
        throw new Error('Gemini returned an empty embedding vector.');
      }
      return values;
    })
  );

  return embeddings;
}

function createChromaEmbeddingFunction() {
  return {
    name: 'gemini-embeddings',
    generate: async (texts) => embedTexts(texts),
    generateForQueries: async (texts) => embedTexts(texts),
    defaultSpace: () => 'cosine',
    supportedSpaces: () => ['cosine', 'l2', 'ip'],
  };
}

async function storeDocument(userId, text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Document text is empty.');
  }

  try {
    const collectionName = collectionNameForUser(userId);
    console.log(`[RAG] collection: ${collectionName}`);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);
    const chunks = docs.map((doc) => doc.pageContent).filter(Boolean);

    if (!chunks.length) {
      throw new Error('No chunks generated from document text.');
    }

    const vectors = await embedTexts(chunks);

    const client = getChromaClient();
    const collection = await client.getOrCreateCollection({
      name: collectionName,
      metadata: { source: 'ai-study-assistant', userId },
      embeddingFunction: createChromaEmbeddingFunction(),
    });

    const now = Date.now();
    const ids = chunks.map((_, idx) => `${collectionName}-${now}-${idx}`);
    const metadatas = chunks.map((_, idx) => ({
      userId,
      chunkIndex: idx,
      createdAt: new Date(now).toISOString(),
    }));

    await collection.add({
      ids,
      documents: chunks,
      embeddings: vectors,
      metadatas,
    });

    return {
      collection: collectionName,
      chunksStored: chunks.length,
    };
  } catch (error) {
    if (error?.message?.toLowerCase().includes('fetch failed') || error?.message?.includes('ECONNREFUSED')) {
      const connection = getChromaConnectionLabel();
      throw new Error(
        `Unable to reach ${connection}. Start local ChromaDB (persistent) with Docker: docker run -p 8000:8000 -v ${LOCAL_CHROMA_DIR}:/data chromadb/chroma:latest`
      );
    }

    throw new Error(`Failed to store document embeddings: ${error.message || 'Unknown error'}`);
  }
}

module.exports = {
  storeDocument,
};
