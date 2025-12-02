# OpenWebUI Client Plugin (TypeScript)

A Node.js client plugin for interacting with OpenWebUI APIs. Written in TypeScript and supports Node.js 18 and above.

## Features

- ✅ **Node.js 18+ Support** - Uses native fetch API (no external dependencies)
- 🔐 **API Key Authentication** - Secure authentication with Bearer tokens
- ⚡ **TypeScript** - Full type safety and IntelliSense support
- 📦 **Modern ES Modules** - Uses ES6 import/export syntax
- 🎯 **Type-Safe** - Comprehensive type definitions for all API methods
- 🔄 **Comprehensive API Coverage** - Covers major OpenWebUI endpoints
- ⏱️ **Configurable Timeout** - Prevent hanging requests
- 🛠️ **Custom Requests** - Make custom API calls with full type support

## Installation

```bash
npm install
```

## Requirements

- Node.js >= 18.0.0
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
import OpenWebUIClient from './dist/index.js';

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
} from './dist/index.js';
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
import type { ChatCompletionPayload } from './dist/index.js';

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

#### Get Chat History

```typescript
const chats = await client.getChatHistory();
console.log('Chat history:', chats);
// Returns: Chat[]
```

#### Get Specific Chat

```typescript
const chat = await client.getChat('chat-id-here');
console.log('Chat details:', chat);
// Returns: Chat
```

#### Create New Conversation

```typescript
const conversation = await client.createConversation({
  title: 'My New Chat',
  messages: []
});
console.log('Created conversation:', conversation);
// Returns: Chat
```

#### Update Chat

```typescript
const updated = await client.updateChat('chat-id-here', {
  title: 'Updated Title'
});
console.log('Updated chat:', updated);
// Returns: Chat
```

#### Delete Chat

```typescript
const result = await client.deleteChat('chat-id-here');
console.log('Deletion result:', result);
// Returns: { success: boolean }
```

#### Get User Info

```typescript
const userInfo = await client.getUserInfo();
console.log('User info:', userInfo);
// Returns: UserInfo
```

#### Health Check

```typescript
const health = await client.healthCheck();
console.log('Health status:', health);
// Returns: HealthStatus
```

#### Get Functions/Tools

```typescript
const functions = await client.getFunctions();
console.log('Available functions:', functions);
// Returns: FunctionDefinition[]
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

## Type Definitions

The plugin includes comprehensive TypeScript type definitions:

- `OpenWebUIConfig` - Client configuration
- `ChatMessage` - Chat message structure
- `ChatCompletionPayload` - Chat completion request
- `ChatCompletionResponse` - Chat completion response
- `Model` - Model information
- `Chat` - Chat/conversation structure
- `UserInfo` - User information
- `HealthStatus` - Health check response
- `FunctionDefinition` - Function/tool definition
- `ConversationPayload` - New conversation payload
- `UpdateChatPayload` - Chat update payload
- `RequestOptions` - Custom request options

All types are exported and available for import:

```typescript
import type {
  OpenWebUIConfig,
  ChatMessage,
  ChatCompletionPayload,
  Model,
  UserInfo,
} from './dist/index.js';
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

```bash
npm test
```

## Running Examples

```bash
npm run example
```

## Example: Complete Chat Flow (TypeScript)

```typescript
import OpenWebUIClient, {
  type ChatCompletionPayload,
  type Model,
} from './dist/index.js';

async function chatExample(): Promise<void> {
  const client = new OpenWebUIClient({
    url: 'http://localhost:3000',
    apiKey: 'your-api-key'
  });

  try {
    // Check health
    await client.healthCheck();
    console.log('✅ OpenWebUI is healthy');

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

    // Get user info
    const userInfo = await client.getUserInfo();
    console.log('👤 User:', userInfo);

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
│   └── example.ts        # Usage examples
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development
- `npm test` - Run tests
- `npm run example` - Run example code
- `npm run clean` - Remove build artifacts

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
npm install dotenv
```

```typescript
import OpenWebUIClient from './dist/index.js';
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
