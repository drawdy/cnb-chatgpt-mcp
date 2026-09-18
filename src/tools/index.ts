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

export function registerTools(server: McpServer, token?: string) {
  const client = new CnbApiClient({
    baseUrl: getBaseUrl(),
    token: getToken(token)
  });

  registerGroupTools(server, client);
  registerRepoTools(server, client);
  registerIssueTools(server, client);
  registerWorkspaceTools(server, client);
  registerPullTools(server, client);

  // ================
  // 使用 cnb-request
  // ================

  registerBuildTools(server, token);
  registerKnowledgeBaseTools(server, token);
}
