const { ChromaClient, CloudClient } = require('chromadb');

function isTruthy(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

function getCloudConfig() {
  const enabled = isTruthy(process.env.CHROMA_CLOUD_ENABLED || '');
  const apiKey = (process.env.CHROMA_API_KEY || '').trim();
  const tenant = (process.env.CHROMA_TENANT || '').trim();
  const database = (process.env.CHROMA_DATABASE || '').trim();

  return {
    enabled,
    apiKey,
    tenant,
    database,
    host: (process.env.CHROMA_CLOUD_HOST || 'api.trychroma.com').trim(),
    port: Number(process.env.CHROMA_CLOUD_PORT || 443),
  };
}

function usingCloud(config) {
  return config.enabled || Boolean(config.apiKey);
}

function getChromaConnectionLabel() {
  const cloud = getCloudConfig();
  if (usingCloud(cloud)) {
    return `Chroma Cloud (${cloud.host})`;
  }

  return process.env.CHROMA_URL || 'http://127.0.0.1:8000';
}

function getChromaClient() {
  const cloud = getCloudConfig();

  if (usingCloud(cloud)) {
    if (!cloud.apiKey) {
      throw new Error('CHROMA_API_KEY is missing for Chroma Cloud mode.');
    }
    if (!cloud.tenant) {
      throw new Error('CHROMA_TENANT is missing for Chroma Cloud mode.');
    }
    if (!cloud.database) {
      throw new Error('CHROMA_DATABASE is missing for Chroma Cloud mode.');
    }

    return new CloudClient({
      apiKey: cloud.apiKey,
      tenant: cloud.tenant,
      database: cloud.database,
      host: cloud.host,
      port: cloud.port,
    });
  }

  const chromaUrl = process.env.CHROMA_URL || 'http://127.0.0.1:8000';
  const parsed = new URL(chromaUrl);

  return new ChromaClient({
    host: parsed.hostname,
    port: Number(parsed.port || (parsed.protocol === 'https:' ? 443 : 8000)),
    ssl: parsed.protocol === 'https:',
  });
}

module.exports = {
  getChromaClient,
  getChromaConnectionLabel,
};
