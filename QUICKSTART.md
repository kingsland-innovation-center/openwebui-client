# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

This will compile TypeScript files from `src/` to JavaScript in `dist/`.

### 3. Run Tests

```bash
npm test
```

All 6 tests should pass! ✅

## Usage

### Basic Example

```typescript
import OpenWebUIClient from './dist/index.js';

// Initialize the client
const client = new OpenWebUIClient({
  url: 'http://localhost:3000',      // Your OpenWebUI instance URL
  apiKey: 'your-api-key-here',       // Your API key
  timeout: 30000                      // Optional (default: 30000ms)
});

// Use the client
const models = await client.getModels();
console.log('Available models:', models);
```

### With TypeScript Type Safety

```typescript
import OpenWebUIClient, {
  type ChatCompletionPayload,
  type ChatMessage,
} from './dist/index.js';

const client = new OpenWebUIClient({
  url: 'http://localhost:3000',
  apiKey: 'your-api-key-here'
});

// Type-safe chat completion
const payload: ChatCompletionPayload = {
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'You are helpful.' },
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  max_tokens: 100
};

const response = await client.createChatCompletion(payload);
console.log(response);
```

## Configuration

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | string | OpenWebUI instance URL (e.g., `http://localhost:3000`) |
| `apiKey` | string | Your OpenWebUI API key |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timeout` | number | 30000 | Request timeout in milliseconds |

## Available Methods

### Core Methods

- `getModels()` - Get available models
- `createChatCompletion(payload)` - Create chat completion
- `getChatHistory()` - Get all chats
- `getChat(chatId)` - Get specific chat
- `deleteChat(chatId)` - Delete a chat
- `getUserInfo()` - Get current user info
- `healthCheck()` - Check API health

### Conversation Management

- `createConversation(payload)` - Create new conversation
- `updateChat(chatId, payload)` - Update chat metadata

### Advanced

- `getFunctions()` - Get available functions/tools
- `customRequest(endpoint, options)` - Make custom API calls

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run watch` | Watch mode for development |
| `npm test` | Run test suite |
| `npm run example` | Run example code |
| `npm run clean` | Remove build artifacts |

## Getting Your API Key

1. Open your OpenWebUI instance in a browser
2. Log in to your account
3. Go to **Settings** → **Account**
4. Navigate to **API Keys** section
5. Click **Create API Key** or copy an existing one

## Error Handling

```typescript
try {
  const models = await client.getModels();
  console.log(models);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  }
}
```

## Environment Variables (Recommended)

Create `.env` file:

```env
OPENWEBUI_URL=http://localhost:3000
OPENWEBUI_API_KEY=your-api-key-here
```

Install dotenv:

```bash
npm install dotenv
```

Use in your code:

```typescript
import dotenv from 'dotenv';
import OpenWebUIClient from './dist/index.js';

dotenv.config();

const client = new OpenWebUIClient({
  url: process.env.OPENWEBUI_URL!,
  apiKey: process.env.OPENWEBUI_API_KEY!
});
```

## Node.js Version

This plugin requires **Node.js 18 or higher** because it uses the native `fetch` API.

Check your Node.js version:

```bash
node --version
```

If you need to upgrade, visit [nodejs.org](https://nodejs.org/)

## Project Structure

```
open-web-ui-client/
├── src/              # TypeScript source files
│   ├── index.ts      # Main client implementation
│   ├── types.ts      # Type definitions
│   ├── test.ts       # Test suite
│   └── example.ts    # Usage examples
├── dist/             # Compiled JavaScript + type definitions
├── package.json      # Project configuration
├── tsconfig.json     # TypeScript configuration
└── README.md         # Full documentation
```

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Run the example: `npm run example`
- Review type definitions in `dist/types.d.ts`

## License

MIT

