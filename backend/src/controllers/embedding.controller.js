import axios from "axios";

import { ENV } from "../lib/env.js";
import { SUPPORTED_EMBEDDING_MODELS, normalizeEmbeddingModel, resolveEmbeddingDimension } from "../lib/embeddingModels.js";
import { assertEmbeddingAccess, assertVectorStoreAccess } from "../lib/plan.js";
const SUPPORTED_VECTOR_STORES = new Set(["pinecone", "chroma"]);
const SUPPORTED_DATASET_TYPES = new Set(["csv", "json", "website", "pdf"]);

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeDataset = (dataset, index) => {
  const id = sanitizeString(dataset?.id) || `dataset-${index}`;
  const label = sanitizeString(dataset?.label) || `Dataset ${index + 1}`;
  const datasetType = sanitizeString(dataset?.dataset_type).toLowerCase();
  const chunkSize = Number.parseInt(dataset?.chunk_size, 10);
  const chunkOverlap = Number.parseInt(dataset?.chunk_overlap, 10);
  const chunks = Array.isArray(dataset?.chunks) ? dataset.chunks : [];

  const normalizedChunks = chunks
    .map((chunk, chunkIndex) => ({
      order: Number.parseInt(chunk?.order ?? chunkIndex, 10),
      text: sanitizeString(chunk?.text),
    }))
    .filter((chunk) => Number.isInteger(chunk.order) && chunk.text.length > 0);

  if (!datasetType || !SUPPORTED_DATASET_TYPES.has(datasetType)) {
    return { error: `${label}: dataset_type is invalid` };
  }

  if (!Number.isFinite(chunkSize) || chunkSize <= 0) {
    return { error: `${label}: chunk_size must be a positive number` };
  }

  if (!Number.isFinite(chunkOverlap) || chunkOverlap < 0) {
    return { error: `${label}: chunk_overlap must be zero or greater` };
  }

  if (normalizedChunks.length === 0) {
    return { error: `${label}: contains no valid chunks to embed` };
  }

  return {
    dataset: {
      id,
      label,
      dataset_type: datasetType,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
      chunks: normalizedChunks,
    },
  };
};

const buildPineconeConfig = (pineconeConfig = {}) => {
  const apiKey = sanitizeString(pineconeConfig.apiKey) || sanitizeString(ENV.PINECONE_API_KEY);
  const indexName = sanitizeString(pineconeConfig.indexName);
  const namespace = sanitizeString(pineconeConfig.namespace);

  if (!apiKey) {
    return { error: "Pinecone API key is required" };
  }

  if (!indexName) {
    return { error: "Pinecone index name is required" };
  }

  const payload = { api_key: apiKey, index_name: indexName };
  if (namespace) {
    payload.namespace = namespace;
  }

  return { config: payload };
};

export const startEmbedding = async (req, res) => {
  try {
    const rawEmbeddingModel = sanitizeString(req.body?.embeddingModel).toLowerCase();
    const vectorDatabase = sanitizeString(req.body?.vectorDatabase).toLowerCase();
    const datasetsInput = Array.isArray(req.body?.datasets) ? req.body.datasets : [];
    const pineconeConfig = req.body?.pineconeConfig ?? {};

    if (!SUPPORTED_EMBEDDING_MODELS.has(rawEmbeddingModel)) {
      return res.status(400).json({ message: "Invalid embedding model selected" });
    }

    try {
      assertEmbeddingAccess(req.user?.plan, rawEmbeddingModel);
      assertVectorStoreAccess(req.user?.plan, vectorDatabase);
    } catch (accessError) {
      return res.status(accessError.statusCode ?? 403).json({ message: accessError.message });
    }

    const embeddingModel = normalizeEmbeddingModel(rawEmbeddingModel);
    const dimensionOutcome = resolveEmbeddingDimension(rawEmbeddingModel, req.body?.embeddingDimension);
    if (dimensionOutcome.error) {
      return res.status(400).json({ message: dimensionOutcome.error });
    }
    const embeddingDimension = dimensionOutcome.value;

    if (!SUPPORTED_VECTOR_STORES.has(vectorDatabase)) {
      return res.status(400).json({ message: "Invalid vector database selected" });
    }

    if (datasetsInput.length === 0) {
      return res.status(400).json({ message: "At least one dataset is required for embedding" });
    }

    const normalizedDatasets = [];
    const datasetErrors = [];

    datasetsInput.forEach((dataset, index) => {
      const outcome = normalizeDataset(dataset, index);
      if (outcome.error) {
        datasetErrors.push(outcome.error);
        return;
      }
      normalizedDatasets.push(outcome.dataset);
    });

    if (datasetErrors.length > 0) {
      return res.status(400).json({ message: datasetErrors.join("; ") });
    }

    const payload = {
      embedding_model: embeddingModel,
      dimension: embeddingDimension,
      vector_store: vectorDatabase,
      datasets: normalizedDatasets,
    };

    if (vectorDatabase === "pinecone") {
      const pineconeOutcome = buildPineconeConfig(pineconeConfig);
      if (pineconeOutcome.error) {
        return res.status(400).json({ message: pineconeOutcome.error });
      }
      payload.pinecone = pineconeOutcome.config;
    }

    if (!ENV.PYTHON_BACKEND_URL) {
      return res.status(500).json({ message: "Python backend URL is not configured" });
    }

    const baseUrl = ENV.PYTHON_BACKEND_URL.replace(/\/$/, "");
    const response = await axios.post(`${baseUrl}/embed`, payload, {
      timeout: 600000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      const detail =
        error.response?.data?.detail ??
        error.response?.data?.message ??
        error.message ??
        "Embedding service request failed";
      return res.status(status).json({ message: detail });
    }

    return res.status(500).json({ message: "Failed to start embedding", detail: error.message });
  }
};
