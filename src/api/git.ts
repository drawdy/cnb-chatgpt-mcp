import CnbApiClient from './client.js';

export interface PageParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  page_size?: number;
}

export interface ListCommitsParams extends PageParams {
  sha?: string;
  author?: string;
  committer?: string;
  since?: string;
  until?: string;
}

export interface Branch {
  name?: string;
  protected?: boolean;
  commit?: {
    sha?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ContentEntry {
  name?: string;
  path?: string;
  sha?: string;
  type?: string;
  [key: string]: unknown;
}

export interface RepositoryContent {
  content?: string;
  encoding?: string;
  entries?: ContentEntry[];
  name?: string;
  path?: string;
  sha?: string;
  size?: number;
  type?: string;
  [key: string]: unknown;
}

export type Commit = Record<string, unknown>;
export type CommitStatus = Record<string, unknown>;
export type CompareResponse = Record<string, unknown>;

function addQuery(path: string, client: CnbApiClient, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, client.baseUrl);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined) continue;
    url.searchParams.set(key, String(value));
  }
  return `${url.pathname}${url.search}`;
}

function encodePath(value: string) {
  return value
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export async function getHead(client: CnbApiClient, repo: string): Promise<Branch> {
  return client.request<Branch>('GET', `/${repo}/-/git/head`);
}

export async function listBranches(client: CnbApiClient, repo: string, params?: PageParams): Promise<Branch[]> {
  return client.request<Branch[]>('GET', addQuery(`/${repo}/-/git/branches`, client, params));
}

export async function getBranch(client: CnbApiClient, repo: string, branch: string): Promise<Branch> {
  return client.request<Branch>('GET', `/${repo}/-/git/branches/${encodeURIComponent(branch)}`);
}

export async function createBranch(
  client: CnbApiClient,
  repo: string,
  name: string,
  startPoint: string
): Promise<Branch> {
  return client.request<Branch>(
    'POST',
    `/${repo}/-/git/branches`,
    {
      name,
      start_point: startPoint
    },
    {
      header: { 'Content-Type': 'application/json' }
    }
  );
}

export async function getContent(
  client: CnbApiClient,
  repo: string,
  filePath = '',
  ref?: string
): Promise<RepositoryContent> {
  const suffix = encodePath(filePath);
  const path = `/${repo}/-/git/contents/${suffix}`;
  return client.request<RepositoryContent>('GET', addQuery(path, client, { ref }));
}

export async function listCommits(client: CnbApiClient, repo: string, params?: ListCommitsParams): Promise<Commit[]> {
  return client.request<Commit[]>('GET', addQuery(`/${repo}/-/git/commits`, client, params));
}

export async function getCommit(client: CnbApiClient, repo: string, ref: string): Promise<Commit> {
  return client.request<Commit>('GET', `/${repo}/-/git/commits/${encodeURIComponent(ref)}`);
}

export async function compareCommits(
  client: CnbApiClient,
  repo: string,
  base: string,
  head: string
): Promise<CompareResponse> {
  const baseHead = `${encodeURIComponent(base)}...${encodeURIComponent(head)}`;
  return client.request<CompareResponse>('GET', `/${repo}/-/git/compare/${baseHead}`);
}

export async function getCommitStatuses(
  client: CnbApiClient,
  repo: string,
  commitish: string
): Promise<CommitStatus[]> {
  return client.request<CommitStatus[]>('GET', `/${repo}/-/git/commit-statuses/${encodeURIComponent(commitish)}`);
}
