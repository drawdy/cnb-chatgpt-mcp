import CnbApiClient from './client.js';

import type { operations, definitions } from '../schema.js';

export async function listWorkspace(client: CnbApiClient, params?: ListWorkspaceParams): Promise<Workspace> {
  const url = new URL('/workspace/list', client.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, value.toString());
    }
  }
  return client.request<Workspace>('GET', `${url.pathname}${url.search}`);
}

export async function deleteWorkspace(
  client: CnbApiClient,
  params?: DeleteWorkspaceParams
): Promise<DeleteWorkspaceResponse> {
  const url = new URL('/workspace/delete', client.baseUrl);
  return client.request<DeleteWorkspaceResponse>('POST', `${url.pathname}`, params, {
    header: { 'Content-Type': 'application/json' }
  });
}

export async function startWorkspace(
  client: CnbApiClient,
  repo: string,
  params: StartWorkspaceParams
): Promise<StartWorkspaceResponse> {
  return client.request<StartWorkspaceResponse>('POST', `/${repo}/-/workspace/start`, params, {
    header: { 'Content-Type': 'application/json' }
  });
}

export type ListWorkspaceParams = operations['ListWorkspaces']['parameters']['query'];

export type Workspace = definitions['dto.WorkspaceListResult'];

export type DeleteWorkspaceParams = operations['DeleteWorkspace']['parameters']['body']['request'];

export type DeleteWorkspaceResponse = definitions['dto.WorkspaceDeleteResult'];

export type StartWorkspaceParams = operations['StartWorkspace']['parameters']['body']['request'];

export type StartWorkspaceResponse = definitions['dto.StartWorkspaceResult'];
