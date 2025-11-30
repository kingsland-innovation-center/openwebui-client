/**
 * Example usage of OpenWebUI Client Plugin (TypeScript)
 *
 * Before running this example:
 * 1. Make sure your OpenWebUI instance is running
 * 2. Replace the URL and API key with your actual values
 * 3. Build: npm run build
 * 4. Run: npm run example
 */

import OpenWebUIClient, {
  type ChatCompletionPayload,
  type Model,
} from './index.js';

async function main(): Promise<void> {
  // Initialize the client
  const client = new OpenWebUIClient({
    url: 'http://localhost:3000', // Replace with your OpenWebUI URL
    apiKey: 'your-api-key-here', // Replace with your API key
    timeout: 30000, // Optional: 30 seconds timeout
  });

  console.log('🚀 OpenWebUI Client Example\n');

  try {
    // 1. Health Check
    console.log('1️⃣  Checking OpenWebUI health...');
    const health = await client.healthCheck();
    console.log('✅ Health Status:', health);
    console.log();

    // 2. Get User Info
    console.log('2️⃣  Getting user information...');
    const userInfo = await client.getUserInfo();
    console.log('👤 User Info:', userInfo);
    console.log();

    // 3. Get Available Models
    console.log('3️⃣  Fetching available models...');
    const models: Model[] = await client.getModels();
    console.log('📋 Available Models:', models);
    console.log();

    // 4. Create a Chat Completion with type safety
    console.log('4️⃣  Creating a chat completion...');
    const payload: ChatCompletionPayload = {
      model: 'gpt-3.5-turbo', // Use a model from your available models
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: 'What is the meaning of life in one sentence?',
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    };

    const chatResponse = await client.createChatCompletion(payload);
    console.log('💬 Chat Response:', chatResponse);
    console.log();

    // 5. Get Chat History
    console.log('5️⃣  Fetching chat history...');
    const chatHistory = await client.getChatHistory();
    console.log('📜 Chat History:', chatHistory);
    console.log();

    // 6. Get Available Functions
    console.log('6️⃣  Fetching available functions...');
    const functions = await client.getFunctions();
    console.log('🔧 Functions:', functions);
    console.log();

    // 7. Create a new conversation
    console.log('7️⃣  Creating a new conversation...');
    const conversation = await client.createConversation({
      title: 'TypeScript Example Chat',
      messages: [],
    });
    console.log('💬 Created Conversation:', conversation);
    console.log();

    console.log('✅ All operations completed successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error occurred:', error.message);

      // Handle specific error types
      if (error.message.includes('timeout')) {
        console.error('💡 Tip: Try increasing the timeout value');
      } else if (error.message.includes('HTTP 401')) {
        console.error('💡 Tip: Check your API key');
      } else if (error.message.includes('HTTP 404')) {
        console.error('💡 Tip: Verify the endpoint URL is correct');
      } else if (error.message.includes('fetch')) {
        console.error(
          '💡 Tip: Make sure your OpenWebUI instance is running and accessible'
        );
      }
    } else {
      console.error('❌ Unknown error:', error);
    }
  }
}

// Run the example
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
