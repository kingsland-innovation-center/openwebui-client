/**
 * Test setup file for vitest
 * Provides File and Blob APIs for Node.js test environment
 */

// File API is available in Node.js 20.5.0+ globally
// Ensure File and Blob are available in the test environment
import { File as NodeFile, Blob as NodeBlob } from 'node:buffer';

// Make File and Blob available globally if they're not already
if (typeof globalThis.File === 'undefined') {
  globalThis.File = NodeFile as any;
}
if (typeof globalThis.Blob === 'undefined') {
  globalThis.Blob = NodeBlob as any;
}

