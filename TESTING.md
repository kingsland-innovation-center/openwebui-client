# Testing Guide

## Overview

This project uses [Vitest](https://vitest.dev/) as the testing framework. Vitest is a fast, Vite-native unit test framework that works seamlessly with TypeScript and ES modules.

## Test Structure

Tests are located in `src/index.test.ts` and cover:

- ✅ Client initialization and configuration validation
- ✅ All API methods (getModels, createChatCompletion, uploadFile, etc.)
- ✅ Error handling (timeouts, HTTP errors, network failures)
- ✅ File upload functionality (File and Blob objects)
- ✅ Ollama proxy endpoints (generate, embed, list models)
- ✅ Custom request handling
- ✅ Response format handling (array vs object responses)

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite aims for comprehensive coverage of all public methods and error scenarios. Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`.

## Writing New Tests

When adding new features, follow these guidelines:

1. **Test Structure**: Use `describe` blocks to group related tests
2. **Mocking**: Use Vitest's `vi.fn()` to mock `fetch` calls
3. **Assertions**: Use Vitest's `expect` API for assertions
4. **Error Cases**: Always test error scenarios (HTTP errors, timeouts, invalid inputs)

### Example Test

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OpenWebUIClient from './index.js';

describe('NewFeature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle success case', async () => {
    const mockResponse = { success: true };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse,
    });

    const client = new OpenWebUIClient({
      url: 'http://localhost:3000',
      apiKey: 'test-key',
    });

    const result = await client.newMethod();
    expect(result).toEqual(mockResponse);
  });
});
```

## CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop` branches
- Every pull request
- Multiple Node.js versions (18.x, 20.x, 22.x)

See `.github/workflows/ci.yml` for the CI configuration.

## Legacy Tests

The original test file (`src/test.ts`) is still available and can be run with:

```bash
npm run test:legacy
```

This runs the old test suite that doesn't use Vitest.

