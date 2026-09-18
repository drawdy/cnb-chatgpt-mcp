import assert from 'node:assert/strict';
import test from 'node:test';

import { buildRepositoryListParams } from '../dist/helpers/repositoryListParams.js';

test('remote_url never changes repository filters', () => {
  const privateQuery = buildRepositoryListParams({
    remote_url: '',
    filter_type: 'private',
    role: 'Guest',
    desc: true
  });
  assert.deepEqual(privateQuery, { filter_type: 'private', role: 'Guest', desc: true });

  const publicRemote = buildRepositoryListParams({
    remote_url: 'https://cnb.cool/example/public.git',
    filter_type: 'secret',
    role: 'Reporter'
  });
  assert.deepEqual(publicRemote, { filter_type: 'secret', role: 'Reporter' });
});
