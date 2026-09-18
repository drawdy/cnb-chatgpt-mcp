import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getBaseUrl, getToken } from '../helpers/getConfig.js';
import CnbApiClient from '../api/client.js';
import registerGroupTools from './groupTools.js';
import registerRepoTools from './repoTools.js';
import registerIssueTools from './issueTools.js';
import registerWorkspaceTools from './workspaceTools.js';
import registerPullTools from './pullTools.js';
import registerBuildTools from './buildTools.js';
import registerKnowledgeBaseTools from './knowledgeBaseTools.js';
import registerGitTools from './gitTools.js';

export function registerTools(server: McpServer, token?: string) {
  const resolvedToken = getToken(token);
  const client = new CnbApiClient({
    baseUrl: getBaseUrl(),
    token: resolvedToken
  });

  registerGroupTools(server, client);
  registerRepoTools(server, client);
  registerGitTools(server, client, resolvedToken);
  registerIssueTools(server, client);
  registerWorkspaceTools(server, client);
  registerPullTools(server, client);

  // ================
  // 使用 cnb-request
  // ================

  registerBuildTools(server, token);
  registerKnowledgeBaseTools(server, token);
}
