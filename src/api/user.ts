import CnbApiClient from './client.js';

import type { definitions } from '../schema.js';

export async function getUser(client: CnbApiClient): Promise<UserInfo> {
  return client.request<UserInfo>('GET', '/user');
}

export type UserInfo = definitions['dto.UsersResultForSelf'];
