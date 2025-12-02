/**
 * TypeScript type definitions for OpenWebUI Client Plugin
 */

/**
 * Client configuration options
 */
export interface OpenWebUIConfig {
  /** OpenWebUI instance URL (required) */
  url: string;
  /** OpenWebUI API key (required) */
  apiKey: string;
  /** Request timeout in milliseconds (optional, default: 30000) */
  timeout?: number;
}

/**
 * Chat message role
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'function';

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
  name?: string;
  function_call?: FunctionCall;
}

/**
 * Function call structure
 */
export interface FunctionCall {
  name: string;
  arguments: string;
}

/**
 * File reference for RAG (Retrieval Augmented Generation)
 */
export interface FileReference {
  type: 'file' | 'collection';
  id: string;
}

/**
 * Chat completion request payload
 * Supports RAG via files parameter
 */
export interface ChatCompletionPayload {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  stream?: boolean;
  functions?: FunctionDefinition[];
  function_call?: 'none' | 'auto' | { name: string };
  /** RAG: Reference files or knowledge collections */
  files?: FileReference[];
}

/**
 * Chat completion response
 */
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatChoice[];
  usage?: Usage;
}

/**
 * Chat choice in completion response
 */
export interface ChatChoice {
  index: number;
  message: ChatMessage;
  finish_reason: string;
}

/**
 * Token usage information
 */
export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Model information
 */
export interface Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  permission?: ModelPermission[];
  root?: string;
  parent?: string;
}

/**
 * Model permission
 */
export interface ModelPermission {
  id: string;
  object: string;
  created: number;
  allow_create_engine: boolean;
  allow_sampling: boolean;
  allow_logprobs: boolean;
  allow_search_indices: boolean;
  allow_view: boolean;
  allow_fine_tuning: boolean;
  organization: string;
  group?: string;
  is_blocking: boolean;
}

/**
 * Chat/Conversation structure
 */
export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
  metadata?: Record<string, unknown>;
}

/**
 * User information
 */
export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Health check response
 */
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  version?: string;
  timestamp?: string;
}

/**
 * Function/tool definition
 */
export interface FunctionDefinition {
  name: string;
  description?: string;
  parameters?: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * New conversation payload
 */
export interface ConversationPayload {
  title?: string;
  messages?: ChatMessage[];
  metadata?: Record<string, unknown>;
}

/**
 * Chat update payload
 */
export interface UpdateChatPayload {
  title?: string;
  messages?: ChatMessage[];
  metadata?: Record<string, unknown>;
}

/**
 * Custom request options
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Delete response
 */
export interface DeleteResponse {
  success: boolean;
  message?: string;
}

/**
 * Uploaded file information
 */
export interface UploadedFile {
  id: string;
  filename: string;
  size?: number;
  content_type?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

/**
 * Ollama generate request payload
 */
export interface OllamaGeneratePayload {
  model: string;
  prompt: string;
  stream?: boolean;
  context?: number[];
  options?: Record<string, unknown>;
}

/**
 * Ollama generate response
 */
export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Ollama embed request payload
 */
export interface OllamaEmbedPayload {
  model: string;
  input: string | string[];
  options?: Record<string, unknown>;
}

/**
 * Ollama embed response
 */
export interface OllamaEmbedResponse {
  embeddings: number[][];
}

/**
 * Ollama tags response (list of models)
 */
export interface OllamaTagsResponse {
  models: Array<{
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    details?: {
      format: string;
      family: string;
      families?: string[];
      parameter_size?: string;
      quantization_level?: string;
    };
  }>;
}
