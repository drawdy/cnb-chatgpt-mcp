import type { ListRepositoriesParams } from '../api/repository.js';

export interface RepositoryListToolInput extends ListRepositoriesParams {
  remote_url?: string;
}

export function buildRepositoryListParams(input: RepositoryListToolInput): ListRepositoriesParams {
  const params: RepositoryListToolInput = { ...input };
  delete params.remote_url;
  return params;
}
