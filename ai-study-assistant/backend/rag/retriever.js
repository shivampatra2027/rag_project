const axios = require('axios');
const { collectionNameForUser } = require('./userCollection');
const { getChromaClient, getChromaConnectionLabel } = require('./chromaClient');

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

async function retrieveContext(userId, query) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    throw new Error('Query is empty.');
  }

  try {
    const collectionName = collectionNameForUser(userId);
    console.log(`[RAG] collection: ${collectionName}`);

    const queryVectors = await embedTexts([query]);
    const queryEmbedding = queryVectors[0];

    const client = getChromaClient();
    const collection = await client.getCollection({
      name: collectionName,
      embeddingFunction: createChromaEmbeddingFunction(),
    });

    const result = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 4,
      include: ['documents'],
    });

    const chunks = result?.documents?.[0] || [];
    return chunks.filter(Boolean).slice(0, 4);
  } catch (error) {
    const message = (error?.message || '').toLowerCase();

    if (
      message.includes('does not exist') ||
      message.includes('not found') ||
      message.includes('could not be found') ||
      message.includes('requested resource')
    ) {
      throw new Error('No study material uploaded yet');
    }

    if (message.includes('fetch failed') || message.includes('econnrefused')) {
      throw new Error(`Unable to reach ${getChromaConnectionLabel()}. Ensure your Chroma instance is running.`);
    }

    throw new Error(`Failed to retrieve context: ${error.message || 'Unknown error'}`);
  }
}

module.exports = {
  retrieveContext,
};
