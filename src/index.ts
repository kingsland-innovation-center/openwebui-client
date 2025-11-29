/**
 * OpenWebUI Client Plugin
 * Supports Node.js 18+
 * Written in TypeScript
 */

import type {
  OpenWebUIConfig,
  ChatCompletionPayload,
  ChatCompletionResponse,
  Model,
  Chat,
  UserInfo,
  HealthStatus,
  FunctionDefinition,
  ConversationPayload,
  UpdateChatPayload,
  RequestOptions,
  DeleteResponse,
} from './types.js';

export type {
  OpenWebUIConfig,
  ChatMessage,
  ChatCompletionPayload,
  ChatCompletionResponse,
  Model,
  Chat,
  UserInfo,
  HealthStatus,
  FunctionDefinition,
  ConversationPayload,
  UpdateChatPayload,
  RequestOptions,
  DeleteResponse,
  MessageRole,
} from './types.js';

export class OpenWebUIClient {
  private readonly url: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor(config: OpenWebUIConfig) {
    if (!config.url) {
      throw new Error('URL is required');
    }

    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    this.url = config.url.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;
  }

  /**
   * Make a request to the OpenWebUI API
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Response data
   */
  private async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.url}${endpoint}`;
    const method = options.method || 'GET';

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    if (options.body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TimeoutError' || error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  /**
   * Get models available in OpenWebUI
   * @returns List of models
   */
  async getModels(): Promise<Model[]> {
    return await this.request<Model[]>('/api/models');
  }

  /**
   * Create a chat completion
   * @param payload - Chat completion payload
   * @returns Chat completion response
   */
  async createChatCompletion(
    payload: ChatCompletionPayload
  ): Promise<ChatCompletionResponse> {
    return await this.request<ChatCompletionResponse>(
      '/api/chat/completions',
      {
        method: 'POST',
        body: payload,
      }
    );
  }

  /**
   * Get chat history
   * @returns Chat history
   */
  async getChatHistory(): Promise<Chat[]> {
    return await this.request<Chat[]>('/api/chats');
  }

  /**
   * Get a specific chat by ID
   * @param chatId - Chat ID
   * @returns Chat details
   */
  async getChat(chatId: string): Promise<Chat> {
    return await this.request<Chat>(`/api/chats/${chatId}`);
  }

  /**
   * Delete a chat
   * @param chatId - Chat ID
   * @returns Deletion response
   */
  async deleteChat(chatId: string): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>(`/api/chats/${chatId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get user info
   * @returns User information
   */
  async getUserInfo(): Promise<UserInfo> {
    return await this.request<UserInfo>('/api/users/me');
  }

  /**
   * Health check
   * @returns Health status
   */
  async healthCheck(): Promise<HealthStatus> {
    return await this.request<HealthStatus>('/health');
  }

  /**
   * Create a new conversation
   * @param payload - Conversation payload
   * @returns Created conversation
   */
  async createConversation(payload: ConversationPayload): Promise<Chat> {
    return await this.request<Chat>('/api/chats', {
      method: 'POST',
      body: payload,
    });
  }

  /**
   * Update chat metadata
   * @param chatId - Chat ID
   * @param payload - Update payload
   * @returns Updated chat
   */
  async updateChat(chatId: string, payload: UpdateChatPayload): Promise<Chat> {
    return await this.request<Chat>(`/api/chats/${chatId}`, {
      method: 'PATCH',
      body: payload,
    });
  }

  /**
   * Get available functions/tools
   * @returns List of functions
   */
  async getFunctions(): Promise<FunctionDefinition[]> {
    return await this.request<FunctionDefinition[]>('/api/functions');
  }

  /**
   * Execute a custom API call
   * @param endpoint - Custom endpoint
   * @param options - Request options
   * @returns Response
   */
  async customRequest<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    return await this.request<T>(endpoint, options);
  }
}

export default OpenWebUIClient;
