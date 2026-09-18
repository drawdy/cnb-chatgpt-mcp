import CnbApiClient from './client.js';

import type { definitions } from '../schema.js';

export interface ListRepositoriesParams {
  page?: number;
  page_size?: number;
  search?: string;
  filter_type?: 'private' | 'public' | 'secret';
  role?: 'Guest' | 'Reporter' | 'Developer' | 'Master' | 'Owner';
  flags?: string;
  flags_match?: 'intersection' | 'union';
  status?: 'active' | 'archived';
  order_by?: 'created_at' | 'last_updated_at' | 'stars' | 'slug_path' | 'forks';
  desc?: boolean;
}

export interface ListGroupRepositoriesParams {
  page?: number;
  page_size?: number;
  search?: string;
  filter_type?: 'private' | 'public' | 'secret';
  flags?: string;
  flags_match?: 'intersection' | 'union';
  status?: 'active' | 'archived';
  descendant?: 'all' | 'sub' | 'grand';
  order_by?: 'created_at' | 'last_updated_at' | 'stars' | 'slug_path' | 'forks';
  desc?: boolean;
}

function addQuery(
  path: string,
  client: CnbApiClient,
  params?: Record<string, string | number | boolean | undefined>
) {
  const url = new URL(path, client.baseUrl);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined) continue;
    url.searchParams.set(key, String(value));
  }
  return `${url.pathname}${url.search}`;
}

export async function listRepositories(client: CnbApiClient, params?: ListRepositoriesParams): Promise<Repository[]> {
  return client.request<Repository[]>('GET', addQuery('/user/repos', client, params));
}

export async function listGroupRepositories(
  client: CnbApiClient,
  group: string,
  params?: ListGroupRepositoriesParams
): Promise<GroupRepository[]> {
  return client.request<GroupRepository[]>('GET', addQuery(`/${group}/-/repos`, client, params));
}

export async function getRepository(client: CnbApiClient, repo: string): Promise<Repository> {
  return client.request<Repository>('GET', `/${repo}`);
}

export async function createRepository(
  client: CnbApiClient,
  group: string,
  params: CreateRepositoryParams
): Promise<unknown> {
  const body = Object.entries(params).reduce((acc, [key, value]) => {
    if (value === undefined) return acc;
    Object.assign(acc, { [key]: value });
    return acc;
  }, {});
  const response = await client.request<Response>(
    'POST',
    `/${group}/-/repos`,
    body,
    {
      header: { 'Content-Type': 'application/json' }
    },
    'raw'
  );
  if (response.status === 201) {
    return { message: 'Created' };
  } else {
    return { status: response.status, message: response.statusText };
  }
}

export type Repository = definitions['dto.Repos4User'];

export type GroupRepository = definitions['dto.Repos4UserBase'];

export type CreateRepositoryParams = definitions['dto.CreateRepoReq'];
