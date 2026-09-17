import test from 'node:test';
import assert from 'node:assert/strict';

import { createRepositories } from './index.js';

test('createRepositories selects the PostgreSQL product repository when DATABASE_URL is configured', () => {
  const repos = createRepositories({ DATABASE_URL: 'postgresql://user:pass@localhost:5432/omega' });

  assert.equal(repos.products.constructor.name, 'PostgresProductRepository');
});
