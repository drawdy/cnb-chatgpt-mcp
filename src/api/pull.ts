import CnbApiClient from './client.js';

import type { operations, definitions } from '../schema.js';

export async function listPulls(client: CnbApiClient, repo: string, params?: ListPullsParams): Promise<PullRequest[]> {
  const url = new URL(`/${repo}/-/pulls`, client.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, value.toString());
    }
  }
  return client.request<PullRequest[]>('GET', `${url.pathname}${url.search}`);
}

export async function getPull(client: CnbApiClient, repo: string, number: number): Promise<PullRequest> {
  return client.request<PullRequest>('GET', `/${repo}/-/pulls/${number}`);
}

export async function createPull(client: CnbApiClient, repo: string, params: CreatePullParams): Promise<PullRequest> {
  return client.request<PullRequest>('POST', `/${repo}/-/pulls`, params, {
    header: { 'Content-Type': 'application/json' }
  });
}

export async function updatePull(
  client: CnbApiClient,
  repo: string,
  number: number,
  params: UpdatePullParams
): Promise<PullRequest> {
  return client.request<PullRequest>('PATCH', `/${repo}/-/pulls/${number}`, params, {
    header: { 'Content-Type': 'application/json' }
  });
}

export async function mergePull(
  client: CnbApiClient,
  repo: string,
  number: number,
  params: MergePullParams
): Promise<MergePullResponse> {
  return client.request<MergePullResponse>('PUT', `/${repo}/-/pulls/${number}/merge`, params, {
    header: { 'Content-Type': 'application/json' }
  });
}

export async function listPullComments(
  client: CnbApiClient,
  repo: string,
  number: number,
  params?: ListPullCommentsParams
): Promise<PullRequestComment[]> {
  const url = new URL(`/${repo}/-/pulls/${number}/comments`, client.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, value.toString());
    }
  }
  return client.request<PullRequestComment[]>('GET', `${url.pathname}${url.search}`);
}

export async function createPullComment(
  client: CnbApiClient,
  repo: string,
  number: number,
  params: CreatePullCommentParams
): Promise<unknown> {
  const response = await client.request<Response>(
    'POST',
    `/${repo}/-/pulls/${number}/comments`,
    params,
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

export type ListPullsParams = operations['ListPulls']['parameters']['query'];
export type CreatePullParams = definitions['api.PullCreationForm'];
export type UpdatePullParams = definitions['api.PatchPullRequest'];
export type MergePullParams = definitions['api.MergePullRequest'];
export type ListPullCommentsParams = operations['ListPullComments']['parameters']['query'];
export type CreatePullCommentParams = definitions['api.PullCommentCreationForm'];
export type PullRequest = definitions['api.PullRequest'];
export type PullRequestComment = definitions['api.PullRequestComment'];
export type MergePullResponse = definitions['api.MergePullResponse'];
