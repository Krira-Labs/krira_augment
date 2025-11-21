const MODEL_ALIASES = {
  "text-embedding-3-small": "openai-small",
  "text-embedding-3-large": "openai-large",
}

const MODEL_DIMENSIONS = {
  "openai-small": [1536, 512],
  "openai-large": [3072, 1024, 256],
  huggingface: [384],
}

const SUPPORTED_EMBEDDING_MODELS = new Set([
  ...Object.keys(MODEL_DIMENSIONS),
  ...Object.keys(MODEL_ALIASES),
])

const normalizeEmbeddingModel = (modelId = "") => MODEL_ALIASES[modelId] ?? modelId

const resolveEmbeddingDimension = (modelId, rawDimension) => {
  const normalized = normalizeEmbeddingModel(modelId)
  const allowedDimensions = MODEL_DIMENSIONS[normalized]

  if (!allowedDimensions) {
    return { error: `Embedding model '${modelId}' is not supported` }
  }

  if (rawDimension === undefined || rawDimension === null || rawDimension === "") {
    return { value: allowedDimensions[0] }
  }

  const parsed = Number.parseInt(rawDimension, 10)
  if (!Number.isFinite(parsed)) {
    return { error: "Embedding dimension must be a valid integer" }
  }

  if (!allowedDimensions.includes(parsed)) {
    return {
      error: `Dimension ${parsed} is not allowed for ${normalized}. Choose one of ${allowedDimensions.join(", ")}.`,
    }
  }

  return { value: parsed }
}

export { SUPPORTED_EMBEDDING_MODELS, normalizeEmbeddingModel, resolveEmbeddingDimension }
