import { apiClient } from './client';

// Type definitions
export interface Chatbot {
  _id: string;
  userId: string;
  name: string;
  status?: "draft" | "active";
  isCompleted?: boolean;
  completedAt?: string;
  dataset?: {
    type: string;
    files?: Array<{ datasetId?: string; name: string; size: number; chunks: number }>;
    urls?: string[];
  };
  embedding?: {
    model: string;
    vectorStore: string;
    pineconeConfig?: {
      indexName: string;
    };
    stats?: {
      chunksProcessed: number;
      chunksEmbedded: number;
    };
    dimension?: number;
    isEmbedded: boolean;
    datasetIds?: string[];
    datasets?: Array<{
      id?: string;
      label?: string;
      chunksEmbedded?: number;
      chunksProcessed?: number;
    }>;
  };
  llm?: {
    provider: string;
    model: string;
    topK: number;
    systemPrompt: string;
  };
  tests?: Array<{
    question: string;
    answer: string;
  }>;
  testHistory?: Array<{
    question: string;
    answer: string;
    context: ChatbotContextEntry[];
    timestamp: Date;
  }>;
  evaluation?: {
    file?: {
      name: string;
      size: number;
      path: string;
    };
    metrics?: Record<string, unknown>;
    rows?: Array<Record<string, unknown>>;
    justifications?: Record<string, unknown>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ChatbotContextEntry = {
  text?: string;
  score?: number | null;
  metadata?: Record<string, unknown>;
};

export interface GetAllChatbotsResponse {
  success: boolean;
  count: number;
  chatbots: Chatbot[];
}

export interface ChatbotResponse {
  success: boolean;
  message?: string;
  chatbot?: Chatbot;
}

export interface CreateChatbotData {
  name: string;
}

export interface UpdateChatbotData {
  name?: string;
  dataset?: Chatbot["dataset"];
  embedding?: Chatbot["embedding"];
  llm?: Chatbot["llm"];
  testHistory?: Chatbot["testHistory"];
  evaluation?: Chatbot["evaluation"];
}

// Chatbot Service class
class ChatbotService {
  private baseUrl = '/chatbots';

  /**
   * Get all chatbots for the logged-in user
   */
  async getAllChatbots(): Promise<GetAllChatbotsResponse> {
    return apiClient.get<GetAllChatbotsResponse>(this.baseUrl);
  }

  /**
   * Get a single chatbot by ID
   */
  async getChatbot(id: string): Promise<Chatbot> {
    return apiClient.get<Chatbot>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new chatbot
   */
  async createChatbot(data: CreateChatbotData): Promise<Chatbot> {
    return apiClient.post<Chatbot>(this.baseUrl, data);
  }

  /**
   * Update a chatbot
   */
  async updateChatbot(id: string, data: UpdateChatbotData): Promise<Chatbot> {
    return apiClient.put<Chatbot>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete a chatbot
   */
  async deleteChatbot(id: string): Promise<ChatbotResponse> {
    return apiClient.delete<ChatbotResponse>(`${this.baseUrl}/${id}`);
  }

  async completeChatbot(id: string): Promise<Chatbot> {
    return apiClient.post<Chatbot>(`${this.baseUrl}/${id}/complete`, {});
  }

  /**
   * Add a test result to chatbot history
   */
  async addTestResult(
    id: string,
    question: string,
    answer: string,
    context: ChatbotContextEntry[]
  ): Promise<Chatbot> {
    return apiClient.post<Chatbot>(`${this.baseUrl}/${id}/test-result`, {
      question,
      answer,
      context,
    });
  }
}

// Create and export chatbot service instance
export const chatbotService = new ChatbotService();
