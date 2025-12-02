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
  RequestOptions,
  UploadedFile,
  OllamaGeneratePayload,
  OllamaGenerateResponse,
  OllamaEmbedPayload,
  OllamaEmbedResponse,
  OllamaTagsResponse,
} from './types.js';

export type {
  OpenWebUIConfig,
  ChatMessage,
  ChatCompletionPayload,
  ChatCompletionResponse,
  Model,
  RequestOptions,
  MessageRole,
  FileReference,
  UploadedFile,
  OllamaGeneratePayload,
  OllamaGenerateResponse,
  OllamaEmbedPayload,
  OllamaEmbedResponse,
  OllamaTagsResponse,
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
    const response = await this.request<Model[] | { data: Model[] }>('/api/models');
    // Handle both array response and object with data property
    if (Array.isArray(response)) {
      return response;
    }
    if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Unexpected response format from /api/models');
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
   * Upload a file for RAG (Retrieval Augmented Generation)
   * @param file - File to upload (File object or file path)
   * @returns Uploaded file information
   * @see https://docs.openwebui.com/getting-started/api-endpoints#uploading-files
   */
  async uploadFile(file: File | Blob | { path: string; name?: string }): Promise<UploadedFile> {
    const url = `${this.url}/api/v1/files/`;
    const formData = new FormData();

    if (file instanceof File || file instanceof Blob) {
      formData.append('file', file);
    } else {
      // For Node.js, we'd need to use a different approach
      // This is a placeholder - in a real implementation, you'd use fs to read the file
      throw new Error('File path upload not yet implemented. Please use File or Blob objects.');
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    };

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      return (await response.json()) as UploadedFile;
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
   * Add a file to a knowledge collection
   * @param knowledgeId - Knowledge collection ID
   * @param fileId - File ID to add
   * @returns Response
   * @see https://docs.openwebui.com/getting-started/api-endpoints#adding-files-to-knowledge-collections
   */
  async addFileToKnowledge(knowledgeId: string, fileId: string): Promise<{ success: boolean }> {
    return await this.request<{ success: boolean }>(
      `/api/v1/knowledge/${knowledgeId}/file/add`,
      {
        method: 'POST',
        body: { file_id: fileId },
      }
    );
  }

  // ============================================================================
  // Ollama API Proxy Endpoints
  // @see https://docs.openwebui.com/getting-started/api-endpoints#ollama-api-proxy-support
  // ============================================================================

  /**
   * Generate completion using Ollama (streaming supported)
   * @param payload - Ollama generate payload
   * @returns Generate response (or stream if stream=true)
   * @see https://docs.openwebui.com/getting-started/api-endpoints#generate-completion-streaming
   */
  async ollamaGenerate(payload: OllamaGeneratePayload): Promise<OllamaGenerateResponse> {
    return await this.request<OllamaGenerateResponse>('/ollama/api/generate', {
      method: 'POST',
      body: payload,
    });
  }

  /**
   * List available Ollama models
   * @returns List of Ollama models
   * @see https://docs.openwebui.com/getting-started/api-endpoints#list-available-models
   */
  async ollamaListModels(): Promise<OllamaTagsResponse> {
    return await this.request<OllamaTagsResponse>('/ollama/api/tags');
  }

  /**
   * Generate embeddings using Ollama
   * @param payload - Ollama embed payload
   * @returns Embeddings response
   * @see https://docs.openwebui.com/getting-started/api-endpoints#generate-embeddings
   */
  async ollamaEmbed(payload: OllamaEmbedPayload): Promise<OllamaEmbedResponse> {
    return await this.request<OllamaEmbedResponse>('/ollama/api/embed', {
      method: 'POST',
      body: payload,
    });
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
