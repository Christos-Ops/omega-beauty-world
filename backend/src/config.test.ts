import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveApiBaseUrl, getRuntimeConfig } from './config.js';

test('resolveApiBaseUrl normalizes a base URL without trailing slash', () => {
  assert.equal(resolveApiBaseUrl('https://example.com/'), 'https://example.com');
  assert.equal(resolveApiBaseUrl(''), 'http://localhost:4000');
});

test('getRuntimeConfig exposes sensible defaults for local development', () => {
  const config = getRuntimeConfig({ PORT: '5000', JWT_SECRET: 'abc123' });
  assert.equal(config.port, 5000);
  assert.equal(config.jwtSecret, 'abc123');
  assert.equal(config.clientOrigin, 'http://localhost:5173');
});
