# OpenWebUI Client Plugin (TypeScript)

A Node.js client plugin for interacting with OpenWebUI APIs. Written in TypeScript and supports Node.js 20 and above.

📦 [npm package](https://www.npmjs.com/package/@kingsland/open-webui-client)

## Features

- ✅ **Node.js 20+ Support** - Uses native fetch API (no external dependencies)
- 🔐 **API Key Authentication** - Secure authentication with Bearer tokens
- ⚡ **TypeScript** - Full type safety and IntelliSense support
- 📦 **Modern ES Modules** - Uses ES6 import/export syntax
- 🎯 **Type-Safe** - Comprehensive type definitions for all API methods
- 🔄 **Official API Compliance** - Implements all documented OpenWebUI API endpoints
- 🧠 **RAG Support** - File upload and knowledge collection management
- 🤖 **Ollama Proxy** - Full support for Ollama API proxy endpoints
- ⏱️ **Configurable Timeout** - Prevent hanging requests
- 🛠️ **Custom Requests** - Make custom API calls with full type support

## Installation

```bash
npm i @kingsland/open-webui-client
```

## Requirements

- Node.js >= 20.0.0
- OpenWebUI instance running and accessible
- Valid OpenWebUI API key

## Building

```bash
# Build the TypeScript project
npm run build

# Watch mode for development
npm run watch

# Clean build artifacts
npm run clean
```

## Usage

### Basic Setup

```typescript
import OpenWebUIClient from '@kingsland/open-webui-client';

const client = new OpenWebUIClient({
  url: 'http://localhost:3000',  // Your OpenWebUI instance URL
  apiKey: 'your-api-key-here',   // Your OpenWebUI API key
  timeout: 30000                  // Optional: Request timeout in ms (default: 30000)
});
```

### With Type Imports

```typescript
import OpenWebUIClient, {
  type ChatCompletionPayload,
  type ChatMessage,
  type Model,
  type UserInfo,
} from '@kingsland/open-webui-client';
```

### Available Methods

#### Get Models

```typescript
const models = await client.getModels();
console.log('Available models:', models);
// Returns: Model[]
```

#### Create Chat Completion

```typescript
import type { ChatCompletionPayload } from '@kingsland/open-webui-client';

const payload: ChatCompletionPayload = {
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'user', content: 'Hello, how are you?' }
  ],
  temperature: 0.7,
  max_tokens: 100
};

const response = await client.createChatCompletion(payload);
console.log('Response:', response);
// Returns: ChatCompletionResponse
```

#### Ollama API Proxy (Official API)

```typescript
// List available Ollama models
const ollamaModels = await client.ollamaListModels();
console.log('Ollama models:', ollamaModels.models);

// Generate completion using Ollama
const ollamaResponse = await client.ollamaGenerate({
  model: 'gemma3:12b',
  prompt: 'Hello, how are you?',
  stream: false
});
console.log('Ollama response:', ollamaResponse.response);

// Generate embeddings
const embeddings = await client.ollamaEmbed({
  model: 'embeddinggemma:latest',
  input: 'Hello world'
});
console.log('Embeddings:', embeddings.embeddings);
```

#### RAG (Retrieval Augmented Generation) - Official API

```typescript
// Upload a file for RAG
const file = new File(['content'], 'document.txt', { type: 'text/plain' });
const uploadedFile = await client.uploadFile(file);
console.log('Uploaded file ID:', uploadedFile.id);

// Add file to knowledge collection
await client.addFileToKnowledge('knowledge-collection-id', uploadedFile.id);

// Use files in chat completion
const response = await client.createChatCompletion({
  model: 'gemma3:12b',
  messages: [{ role: 'user', content: 'What is in the document?' }],
  files: [{ type: 'file', id: uploadedFile.id }]
});
```

#### Custom API Request

```typescript
interface CustomResponse {
  data: string;
  status: number;
}

const result = await client.customRequest<CustomResponse>('/api/custom-endpoint', {
  method: 'POST',
  body: { key: 'value' },
  headers: { 'Custom-Header': 'value' }
});
console.log('Custom request result:', result);
// Returns: CustomResponse
```

## API Endpoints

### Official Endpoints (Documented)

- ✅ `GET /api/models` - Get available models
- ✅ `POST /api/chat/completions` - Create chat completion
- ✅ `POST /api/v1/files/` - Upload file for RAG
- ✅ `POST /api/v1/knowledge/{id}/file/add` - Add file to knowledge collection
- ✅ `GET /ollama/api/tags` - List Ollama models
- ✅ `POST /ollama/api/generate` - Generate completion via Ollama
- ✅ `POST /ollama/api/embed` - Generate embeddings via Ollama


## Type Definitions

The plugin includes comprehensive TypeScript type definitions:

- `OpenWebUIConfig` - Client configuration
- `ChatMessage` - Chat message structure
- `ChatCompletionPayload` - Chat completion request (supports RAG via `files` parameter)
- `ChatCompletionResponse` - Chat completion response
- `Model` - Model information
- `FileReference` - File reference for RAG
- `UploadedFile` - Uploaded file information
- `OllamaGeneratePayload` - Ollama generate request
- `OllamaGenerateResponse` - Ollama generate response
- `OllamaEmbedPayload` - Ollama embed request
- `OllamaEmbedResponse` - Ollama embed response
- `OllamaTagsResponse` - Ollama models list response
- `RequestOptions` - Custom request options

All types are exported and available for import:

```typescript
import type {
  OpenWebUIConfig,
  ChatMessage,
  ChatCompletionPayload,
  Model,
} from '@kingsland/open-webui-client';
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | string | (required) | OpenWebUI instance URL |
| `apiKey` | string | (required) | OpenWebUI API key |
| `timeout` | number | 30000 | Request timeout in milliseconds |

## Error Handling

The client includes comprehensive error handling with TypeScript:

```typescript
try {
  const models = await client.getModels();
  console.log(models);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      console.error('Request timed out');
    } else if (error.message.includes('HTTP')) {
      console.error('API error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

## Running Tests

The project uses [Vitest](https://vitest.dev/) for testing.

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

The test suite includes comprehensive coverage of:
- Client initialization and configuration
- All API methods (getModels, createChatCompletion, etc.)
- Error handling (timeouts, HTTP errors, etc.)
- File upload functionality
- Ollama proxy endpoints
- Custom request handling

## Running Examples

```bash
npm run example
```

## Example: Complete Chat Flow (TypeScript)

```typescript
import OpenWebUIClient, {
  type ChatCompletionPayload,
  type Model,
} from '@kingsland/open-webui-client';

async function chatExample(): Promise<void> {
  const client = new OpenWebUIClient({
    url: 'http://localhost:3000',
    apiKey: 'your-api-key'
  });

  try {
    // Get available models
    const models: Model[] = await client.getModels();
    console.log('📋 Available models:', models);

    // Create a chat completion with type safety
    const payload: ChatCompletionPayload = {
      model: models[0]?.id || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is the capital of France?' }
      ],
      temperature: 0.7,
      max_tokens: 100
    };

    const response = await client.createChatCompletion(payload);
    console.log('💬 Response:', response);

    // List Ollama models
    const ollamaModels = await client.ollamaListModels();
    console.log('🤖 Ollama models:', ollamaModels.models);

  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message);
    }
  }
}

chatExample();
```

## Development

### Project Structure

```
open-web-ui-client/
├── src/
│   ├── index.ts          # Main client implementation
│   ├── types.ts          # TypeScript type definitions
│   ├── test.ts           # Test suite
│   ├── index.test.ts     # Vitest test suite
│   └── example.ts        # Usage examples
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── vitest.config.ts      # Vitest configuration
├── CHANGELOG.md          # Auto-generated changelog
└── README.md
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run example` - Run example code
- `npm run clean` - Remove build artifacts
- `npm version <patch|minor|major>` - Bump version and generate changelog

### Changelog

This project uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) to automatically generate changelog entries from git commit messages.

When you run `npm version`, it will:
1. Generate changelog entries from commits since the last tag
2. Update `CHANGELOG.md`
3. Bump the version in `package.json`
4. Create a git commit

**Important**: Use [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages to ensure they appear in the changelog:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Test changes
- `ci:` - CI/CD changes

See `CHANGELOG_GUIDE.md` for detailed information about changelog generation.

## Getting Your API Key

1. Log in to your OpenWebUI instance
2. Go to Settings → Account
3. Navigate to API Keys section
4. Generate a new API key or copy an existing one

## Security Notes

- Never commit your API key to version control
- Store API keys in environment variables or secure configuration files
- Use `.env` files with `.gitignore` for local development
- Rotate API keys regularly

## Environment Variables Example

Create a `.env` file (add to `.gitignore`):

```env
OPENWEBUI_URL=http://localhost:3000
OPENWEBUI_API_KEY=your-api-key-here
OPENWEBUI_TIMEOUT=30000
```

Then use with a package like `dotenv`:

```bash
npm i dotenv
```

```typescript
import OpenWebUIClient from '@kingsland/open-webui-client';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenWebUIClient({
  url: process.env.OPENWEBUI_URL!,
  apiKey: process.env.OPENWEBUI_API_KEY!,
  timeout: Number(process.env.OPENWEBUI_TIMEOUT) || 30000
});
```

## License

MIT

## Support

For issues or questions, please refer to the OpenWebUI documentation or create an issue in the repository.
