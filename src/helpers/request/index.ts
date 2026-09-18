import { getBaseUrl, getToken } from '../getConfig';
import { CnbRequest } from './cnb';

import type { AxiosRequestConfig } from 'axios';

const baseURL = getBaseUrl();
const timeout = 10000; // 客户端10秒超时

const CnbFetcher = new CnbRequest({
  baseURL,
  timeout
});

export default CnbFetcher;

export function createHeaders(token?: string): AxiosRequestConfig['headers'] {
  return {
    Authorization: `Bearer ${getToken(token)}`,
    Accept: 'application/vnd.cnb.api+json'
  };
}
