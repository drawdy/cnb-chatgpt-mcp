import type { ListRepositoriesParams } from '../api/repository.js';

export interface RepositoryListToolInput extends ListRepositoriesParams {
  remote_url?: string;
}

export function buildRepositoryListParams(input: RepositoryListToolInput): ListRepositoriesParams {
  const { remote_url: _remoteUrl, ...params } = input;
  return params;
}
