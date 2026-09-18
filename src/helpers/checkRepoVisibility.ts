import { RepoVisibility } from '../constants/index.js';
import CnbApiClient from '../api/client.js';
import { getRepository } from '../api/repository.js';
import { getRepoPath } from './formatRepoUrl.js';

export async function isRepoPublic(client: CnbApiClient, url: string) {
  const repoPath = getRepoPath(url);
  if (!repoPath) return true;

  try {
    const { visibility_level } = await getRepository(client, repoPath);
    // 字段类型转换过，但 swagger 无法感知
    return visibility_level === RepoVisibility.public;
  } catch {
    return true;
  }
}
