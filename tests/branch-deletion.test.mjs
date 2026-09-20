import assert from 'node:assert/strict';
import test from 'node:test';

import { assertDeletableBranch } from '../dist/api/git.js';

test('allows deleting an explicitly unprotected non-default branch', () => {
  assert.doesNotThrow(() =>
    assertDeletableBranch({ name: 'feat/example', protected: false }, { name: 'main', protected: true }, 'feat/example')
  );
});

test('refuses protected or unverified branches', () => {
  assert.throws(
    () => assertDeletableBranch({ name: 'release', protected: true }, { name: 'main' }, 'release'),
    /protected or unverified/
  );
  assert.throws(
    () => assertDeletableBranch({ name: 'unknown' }, { name: 'main' }, 'unknown'),
    /protected or unverified/
  );
});

test('refuses the default branch even when it is not protected', () => {
  assert.throws(
    () => assertDeletableBranch({ name: 'main', protected: false }, { name: 'main', protected: false }, 'main'),
    /default branch/
  );
});
