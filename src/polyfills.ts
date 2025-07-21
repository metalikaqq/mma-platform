// Global polyfills for Node.js environment
import { webcrypto } from 'crypto';

// Polyfill global crypto for TypeORM and other libraries that expect browser crypto API
if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}
