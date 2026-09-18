import CnbApiClient from './client.js';

import type { operations, definitions } from '../schema.js';

export async function listRepositories(client: CnbApiClient, params?: ListRepositoriesParams): Promise<Repository[]> {
  const url = new URL('/user/repos', client.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, value.toString());
    }
  }
  return client.request<Repository[]>('GET', `${url.pathname}${url.search}`);
}

export async function listGroupRepositories(
  client: CnbApiClient,
  group: string,
  params?: ListGroupRepositoriesParams
): Promise<GroupRepository[]> {
  const url = new URL(`/${group}/-/repos`, client.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, value.toString());
    }
  }
  return client.request<GroupRepository[]>('GET', `${url.pathname}${url.search}`);
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

export type ListRepositoriesParams = operations['GetRepos']['parameters']['query'];

export type ListGroupRepositoriesParams = operations['GetGroupSubRepos']['parameters']['query'];

export type Repository = definitions['dto.Repos4User'];

export type GroupRepository = definitions['dto.Repos4UserBase'];

export type CreateRepositoryParams = definitions['dto.CreateRepoReq'];
