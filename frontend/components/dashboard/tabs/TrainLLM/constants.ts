import { FileDatasetType, LLMProviderId, LLMModelOption, EmbeddingModelId } from "./types"

export const FILE_DATASET_TYPES: FileDatasetType[] = ["csv", "json", "pdf"]

export const STEPS = [
  { title: "Create Chatbot", subtitle: "Name your assistant" },
  { title: "Upload Dataset", subtitle: "Ingest your knowledge sources" },
  { title: "Configure Embedding", subtitle: "Select embeddings and storage" },
  { title: "Choose LLM", subtitle: "Connect provider and prompt" },
  { title: "Test & Evaluate", subtitle: "Measure accuracy and quality" },
  { title: "Deploy Chatbot", subtitle: "Customize and ship your bot" },
]

export const EMBEDDING_DIMENSION_OPTIONS: Record<EmbeddingModelId, number[]> = {
  "openai-small": [1536, 512],
  "openai-large": [3072, 1024, 256],
  huggingface: [384],
}

export const DEFAULT_EMBEDDING_DIMENSIONS: Record<EmbeddingModelId, number> = {
  "openai-small": EMBEDDING_DIMENSION_OPTIONS["openai-small"][0],
  "openai-large": EMBEDDING_DIMENSION_OPTIONS["openai-large"][0],
  huggingface: EMBEDDING_DIMENSION_OPTIONS["huggingface"][0],
}

export const EMBEDDING_MODELS = [
  {
    id: "openai-small",
    name: "text-embedding-3-small",
    badge: "Free",
    dimensionOptions: EMBEDDING_DIMENSION_OPTIONS["openai-small"],
    // price: "$0.0004 / 1K tokens",
    description: "Core OpenAI embedding model with full 1536-d output or a compact 512-d variant.",
    useCases: "Best for knowledge bases, FAQ bots, and balanced latency vs. recall.",
    notes: "Requires OpenAI/FastRouter access.",
    icon: "/openai.svg",
  },
  {
    id: "openai-large",
    name: "text-embedding-3-large",
    badge: "Paid",
    dimensionOptions: EMBEDDING_DIMENSION_OPTIONS["openai-large"],
    // price: "$0.0008 / 1K tokens",
    description: "High-precision embeddings with up to 3072 dimensions plus lower-dimensional projections.",
    useCases: "Recommended for enterprise-scale assistants and complex semantic retrieval.",
    notes: "Higher recall when using the 3072-d space; lower dims reduce storage cost.",
    icon: "/openai.svg",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    badge: "Free",
    dimensionOptions: EMBEDDING_DIMENSION_OPTIONS["huggingface"],
    // price: "Free",
    description: "Open-source small footprint embeddings for free use.",
    useCases: "Ideal for experimentation and MVPs.",
    notes: "Runs on Krira AI managed infrastructure.",
    icon: "/huggingface.svg",
  },
]

export const LLM_PROVIDERS: Array<{ value: LLMProviderId; label: string; logo: string }> = [
  {
    value: "openai",
    label: "OpenAI",
    
    logo: "/openai.svg",
  },
  {
    value: "anthropic",
    label: "Anthropic",
    
    logo: "/anthropic-logo.webp",
  },
  {
    value: "google",
    label: "Google ",
    
    logo: "/google-logo.png",
  },
  {
    value: "grok",
    label: "xAI",
    
    logo: "/xai-logo.webp",
  },
  {
    value: "deepseek",
    label: "DeepSeek",
    
    logo: "/deepseek-logo.png",
  },
  {
    value: "perplexity",
    label: "Perplexity",
    
    logo: "/perplexity-logo.png",
  },
  {
    value: "glm",
    label: "z-ai",
    
    logo: "/glm-logo.png",
  },
]

// Frontend-side defaults in case the backend does not return configured models.
export const DEFAULT_FRONTEND_MODELS: Record<LLMProviderId, LLMModelOption[]> = {
  openai: [
    { id: "openai/gpt-5", label: "GPT 5", badge: "Paid" },
    { id: "openai/gpt-oss-120b", label: "GPT OSS 120B", badge: "Free" },
    { id: "openai/gpt-5.1", label: "GPT 5.1", badge: "Paid" },
    { id: "openai/gpt-4.1", label: "GPT 4.1", badge: "Free" },
  ],
  anthropic: [
    { id: "anthropic/claude-4.5-sonnet", label: "Claude 4.5 Sonnet", badge: "Paid" },
    { id: "anthropic/claude-3-7-sonnet-20250219:thinking", label: "Claude 3.7 Sonnet", badge: "Paid" },
    { id: "anthropic/claude-opus-4.1", label: "Claude Opus 4.1", badge: "Paid" },
    { id: "anthropic/claude-opus-4-20250514", label: "Claude Opus 4", badge: "Paid" },
  ],
  google: [
    { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", badge: "Paid" },
    { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", badge: "Free" },
  ],
  grok: [
    { id: "x-ai/grok-4", label: "Grok 4", badge: "Paid" },
    { id: "x-ai/grok-3-mini-beta", label: "Grok 3 Mini", badge: "Paid" },
  ],
  deepseek: [
    { id: "deepseek-ai/DeepSeek-R1", label: "DeepSeek R1", badge: "Free" },
    { id: "deepseek/deepseek-v3.1", label: "DeepSeek v3.1", badge: "Paid" },
  ],
  perplexity: [
    { id: "perplexity/sonar-reasoning-pro", label: "Sonar Reasoning Pro", badge: "Paid" },
    { id: "perplexity/sonar-pro", label: "Sonar Pro", badge: "Paid" },
    { id: "perplexity/sonar-deep-research", label: "Sonar Deep Research", badge: "Paid" },
  ],
  glm: [
    { id: "z-ai/glm-4.6", label: "GLM 4.6", badge: "Free" },
    { id: "z-ai/glm-4.5", label: "GLM 4.5", badge: "Free" },
  ],
}

const PUBLIC_API_SNIPPET_URL = process.env.NEXT_PUBLIC_PUBLIC_API_URL ?? "https://rag-python-backend.onrender.com/v1"

export const CODE_SNIPPETS: Record<string, { language: string; code: string }> = {
  python: {
    language: "python",
    code: `from krira_augment import KriraAugment

client = KriraAugment(
    api_key="YOUR_KEY",
    pipeline_name="support-pro-bot"
)

response = client.ask("How do I reset my password?")
print(response.answer)`,
  },
  curl: {
    language: "bash",
    code: `curl -X POST ${PUBLIC_API_SNIPPET_URL}/chat \\
    -H "Authorization: Bearer $KRIRA_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{
        "pipeline_name": "support-pro-bot",
        "query": "How can I update billing?"
    }'`,
  },
}

export const MAX_CONTEXT_PREVIEW = 5
