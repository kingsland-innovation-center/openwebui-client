/**
 * Test file for OpenWebUI Client Plugin (TypeScript)
 */

import OpenWebUIClient from './index.js';

async function runTests(): Promise<void> {
  console.log('🧪 OpenWebUI Client Plugin Tests\n');

  // Test 1: Initialize client with missing URL
  console.log('Test 1: Initialize without URL');
  try {
    new OpenWebUIClient({ apiKey: 'test-key' } as any);
    console.log('❌ FAILED: Should throw error when URL is missing\n');
  } catch (error) {
    if (error instanceof Error) {
      console.log('✅ PASSED:', error.message, '\n');
    }
  }

  // Test 2: Initialize client with missing API key
  console.log('Test 2: Initialize without API key');
  try {
    new OpenWebUIClient({ url: 'http://localhost:3000' } as any);
    console.log('❌ FAILED: Should throw error when API key is missing\n');
  } catch (error) {
    if (error instanceof Error) {
      console.log('✅ PASSED:', error.message, '\n');
    }
  }

  // Test 3: Initialize client successfully
  console.log('Test 3: Initialize with valid config');
  try {
    const client = new OpenWebUIClient({
      url: 'http://localhost:3000',
      apiKey: 'test-api-key',
    });
    console.log('✅ PASSED: Client initialized successfully');
    console.log('   URL:', client['url']);
    console.log('   API Key:', client['apiKey'].substring(0, 10) + '...\n');
  } catch (error) {
    if (error instanceof Error) {
      console.log('❌ FAILED:', error.message, '\n');
    }
  }

  // Test 4: URL trailing slash removal
  console.log('Test 4: URL trailing slash removal');
  try {
    const client = new OpenWebUIClient({
      url: 'http://localhost:3000/',
      apiKey: 'test-api-key',
    });
    if (client['url'] === 'http://localhost:3000') {
      console.log('✅ PASSED: Trailing slash removed correctly\n');
    } else {
      console.log('❌ FAILED: URL still has trailing slash\n');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('❌ FAILED:', error.message, '\n');
    }
  }

  // Test 5: Default timeout
  console.log('Test 5: Default timeout value');
  try {
    const client = new OpenWebUIClient({
      url: 'http://localhost:3000',
      apiKey: 'test-api-key',
    });
    if (client['timeout'] === 30000) {
      console.log('✅ PASSED: Default timeout is 30000ms\n');
    } else {
      console.log('❌ FAILED: Default timeout is incorrect\n');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('❌ FAILED:', error.message, '\n');
    }
  }

  // Test 6: Custom timeout
  console.log('Test 6: Custom timeout value');
  try {
    const client = new OpenWebUIClient({
      url: 'http://localhost:3000',
      apiKey: 'test-api-key',
      timeout: 60000,
    });
    if (client['timeout'] === 60000) {
      console.log('✅ PASSED: Custom timeout is set correctly\n');
    } else {
      console.log('❌ FAILED: Custom timeout is incorrect\n');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('❌ FAILED:', error.message, '\n');
    }
  }

  console.log('\n📝 Note: To test actual API calls, provide a valid OpenWebUI instance URL and API key:');
  console.log('   const client = new OpenWebUIClient({');
  console.log('     url: "http://your-openwebui-instance:3000",');
  console.log('     apiKey: "your-api-key"');
  console.log('   });');
  console.log('   const models = await client.getModels();');
}

runTests().catch((error) => {
  console.error('Test execution error:', error);
  process.exit(1);
});
