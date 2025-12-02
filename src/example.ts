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
    // 1. Get Available Models
    console.log('1️⃣  Fetching available models...');
    const models: Model[] = await client.getModels();
    console.log('📋 Available Models:', models);
    if (models.length > 0) {
      console.log(`   Found ${models.length} model(s)`);
      console.log(`   First model: ${models[0].id}`);
    }
    console.log();

    // 2. Create a Chat Completion with type safety
    console.log('2️⃣  Creating a chat completion...');
    const modelId = models.length > 0 ? models[0].id : 'gpt-3.5-turbo';
    const payload: ChatCompletionPayload = {
      model: modelId,
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
    if (chatResponse.choices && chatResponse.choices.length > 0) {
      console.log(`   Message: ${chatResponse.choices[0].message.content}`);
    }
    console.log();

    // 3. List Ollama Models
    console.log('3️⃣  Listing Ollama models...');
    const ollamaModels = await client.ollamaListModels();
    console.log('🤖 Ollama Models:', ollamaModels.models?.length || 0);
    if (ollamaModels.models && ollamaModels.models.length > 0) {
      console.log(`   First model: ${ollamaModels.models[0].name}`);
    }
    console.log();

    // 4. Generate with Ollama
    if (models.length > 0) {
      console.log('4️⃣  Generating with Ollama...');
      const ollamaResponse = await client.ollamaGenerate({
        model: modelId,
        prompt: 'Say hello in one sentence.',
        stream: false,
      });
      console.log('🤖 Ollama Response:', ollamaResponse.response);
      console.log();
    }

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
