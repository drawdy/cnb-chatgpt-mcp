/**
 * baseUrl 降级获取
 *
 * 环境变量 API_BASE_URL（mcp 客户端配置）--不存在--> CNB 流水线提供的 CNB_API_ENDPOINT ---不存在--> 'https://api.cnb.cool'
 */
export function getBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.CNB_API_ENDPOINT ?? 'https://api.cnb.cool';
  return baseUrl;
}

/**
 * token 降级获取
 *
 * token --不存在--> 环境变量 API_TOKEN（mcp 客户端配置）--不存在--> CNB 流水线提供的 CNB_TOKEN ---不存在--> ''
 */
export function getToken(token?: string) {
  const newToken = token ?? process.env.API_TOKEN ?? process.env.CNB_TOKEN ?? '';
  return newToken;
}
