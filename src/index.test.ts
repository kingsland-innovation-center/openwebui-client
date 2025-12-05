/**
 * Comprehensive test suite for OpenWebUI Client Plugin
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OpenWebUIClient from './index.js';
import type {
  ChatCompletionPayload,
  ChatCompletionResponse,
  Model,
  OllamaGeneratePayload,
  OllamaGenerateResponse,
  OllamaEmbedPayload,
  OllamaEmbedResponse,
  OllamaTagsResponse,
  UploadedFile,
} from './types.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('OpenWebUIClient', () => {
  const mockUrl = 'http://localhost:3000';
  const mockApiKey = 'test-api-key-12345';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when URL is missing', () => {
      expect(() => {
        new OpenWebUIClient({ apiKey: mockApiKey } as any);
      }).toThrow('URL is required');
    });

    it('should throw error when API key is missing', () => {
      expect(() => {
        new OpenWebUIClient({ url: mockUrl } as any);
      }).toThrow('API key is required');
    });

    it('should initialize successfully with valid config', () => {
      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });
      expect(client).toBeInstanceOf(OpenWebUIClient);
    });

    it('should remove trailing slash from URL', () => {
      const client = new OpenWebUIClient({
        url: `${mockUrl}/`,
        apiKey: mockApiKey,
      });
      // Access private property for testing
      expect((client as any).url).toBe(mockUrl);
    });

    it('should use default timeout when not provided', () => {
      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });
      expect((client as any).timeout).toBe(30000);
    });

    it('should use custom timeout when provided', () => {
      const customTimeout = 60000;
      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
        timeout: customTimeout,
      });
      expect((client as any).timeout).toBe(customTimeout);
    });
  });

  describe('getModels', () => {
    it('should return models array when response is an array', async () => {
      const mockModels: Model[] = [
        {
          id: 'model-1',
          object: 'model',
          created: 1234567890,
          owned_by: 'openai',
        },
        {
          id: 'model-2',
          object: 'model',
          created: 1234567891,
          owned_by: 'openai',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockModels,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const models = await client.getModels();
      expect(models).toEqual(mockModels);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/api/models`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
          }),
        })
      );
    });

    it('should return models from data property when response is an object', async () => {
      const mockModels: Model[] = [
        {
          id: 'model-1',
          object: 'model',
          created: 1234567890,
          owned_by: 'openai',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockModels }),
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const models = await client.getModels();
      expect(models).toEqual(mockModels);
    });

    it('should throw error for unexpected response format', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ unexpected: 'format' }),
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      await expect(client.getModels()).rejects.toThrow(
        'Unexpected response format from /api/models'
      );
    });

    it('should handle HTTP errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      await expect(client.getModels()).rejects.toThrow('HTTP 401: Unauthorized');
    });
  });

  describe('createChatCompletion', () => {
    it('should create chat completion successfully', async () => {
      const payload: ChatCompletionPayload = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello, how are you?' },
        ],
      };

      const mockResponse: ChatCompletionResponse = {
        id: 'chat-123',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'I am doing well, thank you!',
            },
            finish_reason: 'stop',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.createChatCompletion(payload);
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/api/chat/completions`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload),
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle chat completion with RAG files', async () => {
      const payload: ChatCompletionPayload = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'What is in the document?' },
        ],
        files: [{ type: 'file', id: 'file-123' }],
      };

      const mockResponse: ChatCompletionResponse = {
        id: 'chat-456',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'The document contains...',
            },
            finish_reason: 'stop',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.createChatCompletion(payload);
      expect(response).toEqual(mockResponse);
    });
  });

  describe('uploadFile', () => {
    it('should upload a File object successfully', async () => {
      const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });

      const mockResponse: UploadedFile = {
        id: 'file-123',
        filename: 'test.txt',
        size: 12,
        content_type: 'text/plain',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.uploadFile(mockFile);
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/api/v1/files/`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
            Accept: 'application/json',
          }),
        })
      );
    });

    it('should upload a Blob object successfully', async () => {
      const mockBlob = new Blob(['test content'], { type: 'text/plain' });

      const mockResponse: UploadedFile = {
        id: 'file-456',
        filename: 'blob.txt',
        size: 12,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.uploadFile(mockBlob);
      expect(response).toEqual(mockResponse);
    });

    it('should throw error for file path upload (not implemented)', async () => {
      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      await expect(
        client.uploadFile({ path: '/path/to/file.txt' } as any)
      ).rejects.toThrow(
        'File path upload not yet implemented. Please use File or Blob objects.'
      );
    });

    it('should handle upload errors', async () => {
      const mockFile = new File(['test'], 'test.txt');

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      await expect(client.uploadFile(mockFile)).rejects.toThrow(
        'HTTP 400: Bad Request'
      );
    });
  });

  describe('addFileToKnowledge', () => {
    it('should add file to knowledge collection successfully', async () => {
      const knowledgeId = 'knowledge-123';
      const fileId = 'file-456';

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.addFileToKnowledge(knowledgeId, fileId);
      expect(response).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/api/v1/knowledge/${knowledgeId}/file/add`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ file_id: fileId }),
        })
      );
    });
  });

  describe('ollamaGenerate', () => {
    it('should generate completion using Ollama', async () => {
      const payload: OllamaGeneratePayload = {
        model: 'gemma3:12b',
        prompt: 'Hello, how are you?',
        stream: false,
      };

      const mockResponse: OllamaGenerateResponse = {
        model: 'gemma3:12b',
        created_at: '2024-01-01T00:00:00Z',
        response: 'I am doing well!',
        done: true,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.ollamaGenerate(payload);
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/ollama/api/generate`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload),
        })
      );
    });
  });

  describe('ollamaListModels', () => {
    it('should list Ollama models successfully', async () => {
      const mockResponse: OllamaTagsResponse = {
        models: [
          {
            name: 'gemma3:12b',
            modified_at: '2024-01-01T00:00:00Z',
            size: 1234567890,
            digest: 'sha256:abc123',
          },
          {
            name: 'llama2:7b',
            modified_at: '2024-01-02T00:00:00Z',
            size: 987654321,
            digest: 'sha256:def456',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.ollamaListModels();
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/ollama/api/tags`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('ollamaEmbed', () => {
    it('should generate embeddings successfully', async () => {
      const payload: OllamaEmbedPayload = {
        model: 'embeddinggemma:latest',
        input: 'Hello world',
      };

      const mockResponse: OllamaEmbedResponse = {
        embeddings: [[0.1, 0.2, 0.3, 0.4, 0.5]],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.ollamaEmbed(payload);
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/ollama/api/embed`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload),
        })
      );
    });

    it('should handle multiple input strings', async () => {
      const payload: OllamaEmbedPayload = {
        model: 'embeddinggemma:latest',
        input: ['Hello', 'World'],
      };

      const mockResponse: OllamaEmbedResponse = {
        embeddings: [
          [0.1, 0.2, 0.3],
          [0.4, 0.5, 0.6],
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.ollamaEmbed(payload);
      expect(response).toEqual(mockResponse);
    });
  });

  describe('customRequest', () => {
    it('should make custom GET request', async () => {
      const mockResponse = { data: 'custom data' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.customRequest('/api/custom-endpoint');
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/api/custom-endpoint`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should make custom POST request with body', async () => {
      const customBody = { key: 'value' };
      const mockResponse = { success: true };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.customRequest('/api/custom-endpoint', {
        method: 'POST',
        body: customBody,
      });
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/api/custom-endpoint`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(customBody),
        })
      );
    });

    it('should support custom headers', async () => {
      const mockResponse = { data: 'test' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      await client.customRequest('/api/custom-endpoint', {
        headers: { 'Custom-Header': 'custom-value' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockUrl}/api/custom-endpoint`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Custom-Header': 'custom-value',
          }),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'TimeoutError';

      (global.fetch as any).mockRejectedValueOnce(timeoutError);

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
        timeout: 5000,
      });

      await expect(client.getModels()).rejects.toThrow(
        'Request timeout after 5000ms'
      );
    });

    it('should handle abort errors', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';

      (global.fetch as any).mockRejectedValueOnce(abortError);

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
        timeout: 10000,
      });

      await expect(client.getModels()).rejects.toThrow(
        'Request timeout after 10000ms'
      );
    });

    it('should handle non-JSON responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: async () => 'Plain text response',
      });

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      const response = await client.customRequest('/api/text-endpoint');
      expect(response).toBe('Plain text response');
    });

    it('should handle unknown errors', async () => {
      (global.fetch as any).mockRejectedValueOnce('Unknown error');

      const client = new OpenWebUIClient({
        url: mockUrl,
        apiKey: mockApiKey,
      });

      await expect(client.getModels()).rejects.toThrow('Unknown error occurred');
    });
  });
});

