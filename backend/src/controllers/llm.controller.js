import axios from "axios";
import fs from "fs";
import path from "path";

import { ENV } from "../lib/env.js";
import { SUPPORTED_EMBEDDING_MODELS, normalizeEmbeddingModel, resolveEmbeddingDimension } from "../lib/embeddingModels.js";
import {
  assertEmbeddingAccess,
  assertModelAccess,
  assertProviderAccess,
  assertVectorStoreAccess,
  filterModelsForPlan,
  getPlanDefinition,
} from "../lib/plan.js";
import { consumeRequests, ensureRequestCapacity } from "../services/usage.service.js";

const PROVIDER_METADATA = {
  openai: { label: "OpenAI", description: "GPT series via FastRouter" },
  anthropic: { label: "Anthropic", description: "Claude family via FastRouter" },
  google: { label: "Google Gemini", description: "Gemini models via FastRouter" },
  grok: { label: "Grok (xAI)", description: "xAI Grok models via FastRouter" },
  deepseek: { label: "DeepSeek", description: "DeepSeek reasoning models via FastRouter" },
};

const MODEL_ENV_PREFIXES = {
  openai: "FASTROUTER_OPENAI_MODEL_",
  anthropic: "FASTROUTER_ANTHROPIC_MODEL_",
  google: "FASTROUTER_GEMINI_MODEL_",
  grok: "FASTROUTER_GROK_MODEL_",
  deepseek: "FASTROUTER_DEEPSEEK_MODEL_",
};

// Use /tmp for Render deployment (ephemeral filesystem)
const testDirectory = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'test')
  : path.join(process.cwd(), 'test');

const sampleEvalPath = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'sample_test.csv')
  : path.join(process.cwd(), 'assets', 'sample_test.csv');

if (!fs.existsSync(testDirectory)) {
  fs.mkdirSync(testDirectory, { recursive: true });
}

const ensureSampleFile = () => {
  if (!fs.existsSync(sampleEvalPath)) {
    const fallback = "sr.no,input,output\n1,What is Krira AI?,It is an AI assistant platform.";
    fs.mkdirSync(path.dirname(sampleEvalPath), { recursive: true });
    fs.writeFileSync(sampleEvalPath, fallback, "utf8");
  }
};

const formatModelLabel = (modelId = "") => {
  const candidate = modelId.split("/").pop() ?? modelId;
  return candidate
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((segment) => {
      const lower = segment.toLowerCase();
      if (["gpt", "oss", "xai"].includes(lower)) {
        return lower.toUpperCase();
      }
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join(" ");
};

const collectModelsFromEnv = () => {
  const providers = Object.keys(MODEL_ENV_PREFIXES).reduce((acc, provider) => {
    const prefix = MODEL_ENV_PREFIXES[provider];
    const discovered = new Set();

    Object.entries(process.env).forEach(([key, value]) => {
      if (key.startsWith(prefix) && value) {
        discovered.add(value.trim());
      }
    });

    for (let index = 1; index <= 20; index += 1) {
      const entry = process.env[`${prefix}${index}`];
      if (entry) {
        discovered.add(entry.trim());
      }
    }

    acc[provider] = Array.from(discovered)
      .filter(Boolean)
      .map((id) => ({ id, label: formatModelLabel(id) }))
      .sort((a, b) => a.id.localeCompare(b.id));

    return acc;
  }, {});

  return providers;
};

const mergeProvidersWithEnvFallback = (payload) => {
  const envModels = collectModelsFromEnv();
  const providers = Array.isArray(payload?.providers) ? payload.providers : [];

  const providersById = providers.reduce((acc, provider) => {
    if (provider?.id) {
      acc[provider.id] = provider;
    }
    return acc;
  }, {});

  Object.entries(envModels).forEach(([providerId, models]) => {
    if (!providersById[providerId]) {
      const metadata = PROVIDER_METADATA[providerId] ?? {};
      providersById[providerId] = {
        id: providerId,
        label: metadata.label ?? providerId,
        description: metadata.description,
        models,
      };
      return;
    }

    const existingModels = Array.isArray(providersById[providerId].models)
      ? providersById[providerId].models
      : [];

    if (!providersById[providerId].label) {
      const metadata = PROVIDER_METADATA[providerId] ?? {};
      providersById[providerId].label = metadata.label ?? providerId;
      providersById[providerId].description = metadata.description;
    }

    if (existingModels.length === 0 && models.length > 0) {
      providersById[providerId].models = models;
    }
  });

  return {
    providers: Object.values(providersById).map((provider) => ({
      ...provider,
      models: Array.isArray(provider.models) ? provider.models : [],
    })),
  };
};

const getPythonBaseUrl = () => {
  if (!ENV.PYTHON_BACKEND_URL) {
    throw new Error("Python backend URL is not configured");
  }

  return ENV.PYTHON_BACKEND_URL.replace(/\/$/, "");
};

const parseDatasetIds = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((entry) => String(entry).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => String(entry).trim()).filter(Boolean);
      }
    } catch (_error) {
      return raw
        .split(/,|\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const parseInteger = (value, fallback = 30) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePineconeConfig = (config, fallbackKey, fallbackIndex) => {
  if (!config || typeof config !== "object") {
    config = {};
  }

  const apiKey =
    config.api_key ??
    config.apiKey ??
    config.key ??
    fallbackKey ??
    null;
  const indexName =
    config.index_name ??
    config.indexName ??
    config.index ??
    fallbackIndex ??
    null;
  const namespace = config.namespace ?? config.nameSpace ?? null;

  if (!apiKey || !indexName) {
    return null;
  }

  const payload = {
    api_key: apiKey,
    index_name: indexName,
  };

  if (namespace) {
    payload.namespace = namespace;
  }

  return payload;
};

const handlePythonError = (error) => {
  if (!axios.isAxiosError(error)) {
    return {
      status: 500,
      message: error?.message ?? "Unexpected LLM service failure",
    };
  }

  const status = error.response?.status ?? 502;
  const message =
    error.response?.data?.detail ??
    error.response?.data?.message ??
    error.message ??
    "LLM service request failed";

  return { status, message };
};

export const listLlmModels = async (req, res) => {
  const plan = getPlanDefinition(req.user?.plan);
  const applyPlanFilters = (providers) => {
    let filtered = providers;
    if (Array.isArray(plan.providers) && plan.providers.length > 0) {
      filtered = filtered.filter((provider) => plan.providers.includes(provider.id));
    }
    return filtered.map((provider) => ({
      ...provider,
      models: filterModelsForPlan(req.user?.plan, provider.id, provider.models),
    }));
  };

  try {
    const baseUrl = getPythonBaseUrl();
    const response = await axios.get(`${baseUrl}/api/llm/models`, {
      timeout: 20000,
    });
    const merged = mergeProvidersWithEnvFallback(response.data);
    merged.providers = applyPlanFilters(merged.providers);
    return res.status(200).json(merged);
  } catch (error) {
    const fallback = mergeProvidersWithEnvFallback(null);
    fallback.providers = applyPlanFilters(fallback.providers);

    if (fallback.providers.some((provider) => provider.models.length > 0)) {
      return res.status(200).json(fallback);
    }

    const { status, message } = handlePythonError(error);
    return res.status(status).json({ message });
  }
};

export const downloadEvalSample = async (_req, res) => {
  try {
    ensureSampleFile();
    return res.download(sampleEvalPath, "sample_test.csv");
  } catch (error) {
    return res.status(500).json({ message: "Unable to download sample CSV", detail: error.message });
  }
};

export const testLlmConfiguration = async (req, res) => {
  try {
    const baseUrl = getPythonBaseUrl();
    const body = req.body ?? {};

    const rawEmbeddingModel = typeof body.embeddingModel === "string" ? body.embeddingModel.trim().toLowerCase() : "";
    if (!SUPPORTED_EMBEDDING_MODELS.has(rawEmbeddingModel)) {
      return res.status(400).json({ message: "Invalid embedding model selected" });
    }

    const dimensionOutcome = resolveEmbeddingDimension(rawEmbeddingModel, body.embeddingDimension);
    if (dimensionOutcome.error) {
      return res.status(400).json({ message: dimensionOutcome.error });
    }

    const embeddingModel = normalizeEmbeddingModel(rawEmbeddingModel);
    const requestedTopK = Number(body.topK);
    const datasetIds = Array.isArray(body.datasetIds) ? body.datasetIds : parseDatasetIds(body.datasetIds);

    const vectorStore = typeof body.vectorStore === "string" ? body.vectorStore.trim() : "";

    try {
      assertProviderAccess(req.user?.plan, body.provider);
      if (body.modelId) {
        assertModelAccess(req.user?.plan, body.provider, body.modelId);
      }
      assertEmbeddingAccess(req.user?.plan, rawEmbeddingModel);
      if (vectorStore) {
        assertVectorStoreAccess(req.user?.plan, vectorStore);
      }
    } catch (accessError) {
      return res.status(accessError.statusCode ?? 403).json({ message: accessError.message });
    }

    const payload = {
      provider: body.provider,
      modelId: body.modelId,
      systemPrompt: body.systemPrompt,
      question: body.question,
      embeddingModel,
      embeddingDimension: dimensionOutcome.value,
      vectorStore,
      datasetIds,
      topK: Number.isFinite(requestedTopK) ? requestedTopK : 30,
    };

    if (body.pinecone) {
      payload.pinecone = body.pinecone;
    }

    const response = await axios.post(`${baseUrl}/api/llm/test`, payload);

    await consumeRequests(req.user, 1, { source: "llm_test", provider: body.provider, model: body.modelId });

    return res.status(200).json(response.data);
  } catch (error) {
    const { status, message } = handlePythonError(error);
    return res.status(status).json({
      message,
      detail: error.response?.data ?? null,
    });
  }
};

export const runLlmEvaluation = async (req, res) => {
  try {
    const uploadedFile = req.file;
    if (!uploadedFile) {
      return res.status(400).json({ message: "Evaluation CSV file is required" });
    }

    let csvContent;
    try {
      const fileBuffer = await fs.promises.readFile(uploadedFile.path);
      const csvText = fileBuffer.toString("utf8");
      csvContent = Buffer.from(csvText, "utf8").toString("base64");
      req.fileRowCount = Math.max(csvText.split(/\r?\n/).filter((line) => line.trim().length > 0).length - 1, 1);
    } catch (error) {
      console.error("Failed to read uploaded evaluation CSV", error);
      return res.status(500).json({ message: "Unable to read evaluation CSV content" });
    }

    const body = req.body ?? {};
    const provider = typeof body.provider === "string" ? body.provider.trim() : "";
    const modelId = typeof body.modelId === "string" ? body.modelId.trim() : "";
    const rawEmbeddingModel = typeof body.embeddingModel === "string" ? body.embeddingModel.trim().toLowerCase() : "";
    const vectorStore = typeof body.vectorStore === "string" ? body.vectorStore.trim() : "";
    const systemPrompt = typeof body.systemPrompt === "string" ? body.systemPrompt : "";
    const datasetIdList = parseDatasetIds(body.datasetIds);

    if (!provider || !modelId || !rawEmbeddingModel || !vectorStore) {
      return res.status(400).json({ message: "Missing evaluation configuration" });
    }

    if (!SUPPORTED_EMBEDDING_MODELS.has(rawEmbeddingModel)) {
      return res.status(400).json({ message: "Invalid embedding model selected" });
    }

    const dimensionOutcome = resolveEmbeddingDimension(rawEmbeddingModel, body.embeddingDimension);
    if (dimensionOutcome.error) {
      return res.status(400).json({ message: dimensionOutcome.error });
    }

    const embeddingModel = normalizeEmbeddingModel(rawEmbeddingModel);

    try {
      assertProviderAccess(req.user?.plan, provider);
      assertModelAccess(req.user?.plan, provider, modelId);
      assertEmbeddingAccess(req.user?.plan, rawEmbeddingModel);
      assertVectorStoreAccess(req.user?.plan, vectorStore);
    } catch (accessError) {
      return res.status(accessError.statusCode ?? 403).json({ message: accessError.message });
    }

    if (datasetIdList.length === 0) {
      return res.status(400).json({ message: "At least one dataset must be selected for evaluation" });
    }

    const pineconeRaw = typeof body.pinecone === "string" ? body.pinecone : null;
    let pinecone = null;
    if (pineconeRaw) {
      try {
        pinecone = JSON.parse(pineconeRaw);
      } catch (_error) {
        return res.status(400).json({ message: "Invalid Pinecone configuration" });
      }
    }

    const evaluationPayload = {
      provider,
      modelId,
      systemPrompt,
      embeddingModel,
      embeddingDimension: dimensionOutcome.value,
      vectorStore,
      datasetIds: datasetIdList,
      topK: parseInteger(body.topK, 30),
      csvPath: uploadedFile.path.split(path.sep).join("/"),
      csvContent,
      originalFilename: uploadedFile.originalname,
    };

    if (vectorStore === "pinecone") {
      const pineconePayload = normalizePineconeConfig(pinecone, body?.pineconeKey, body?.pineconeIndex);
      if (!pineconePayload) {
        return res.status(400).json({ message: "Pinecone API key and index name are required" });
      }
      evaluationPayload.pinecone = pineconePayload;
    }

    const estimatedRows = req.fileRowCount ?? Math.max(datasetIdList.length, 1);

    try {
      ensureRequestCapacity(req.user, estimatedRows);
    } catch (limitError) {
      return res.status(limitError.statusCode ?? 402).json({ message: limitError.message });
    }

    const baseUrl = getPythonBaseUrl();
    const response = await axios.post(`${baseUrl}/api/llm/evaluate`, evaluationPayload, {
      timeout: 600000,
    });

    fs.promises.unlink(uploadedFile.path).catch(() => null);

    await consumeRequests(req.user, estimatedRows, { source: "evaluation", provider, model: modelId });

    return res.status(200).json(response.data);
  } catch (error) {
    const { status, message } = handlePythonError(error);
    return res.status(status).json({
      message,
      detail: error.response?.data ?? null,
    });
  }
};
