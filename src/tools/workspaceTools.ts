import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import { deleteWorkspace, listWorkspace } from '../api/workspace.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';
import CnbApiClient from '../api/client.js';

export default function registerWorkspaceTools(server: McpServer, client: CnbApiClient) {
  server.tool(
    ToolNames.LIST_WORKSPACES,
    toolDescriptions[ToolNames.LIST_WORKSPACES],
    {
      branch: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('分支名，例如：main'),
      start: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('查询开始时间，格式：YYYY-MM-DD HH:mm:ssZZ，例如：2024-12-01 00:00:00+0800'),
      end: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('查询结束时间，格式：YYYY-MM-DD HH:mm:ssZZ，例如：2024-12-01 00:00:00+0800'),
      page: z
        .preprocess((val) => (val === null ? undefined : val), z.number().int().positive().optional())
        .describe('分页页码，从 1 开始，默认为 1'),
      page_size: z
        .preprocess((val) => (val === null ? undefined : val), z.number().int().min(1).max(100).optional())
        .describe('每页条数，默认为 20，最高 100'),
      slug: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('仓库路径，例如：groupname/reponame'),
      status: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['running', 'closed']).optional())
        .describe('开发环境状态，running: 开发环境已启动，closed：开发环境已关闭，默认为所有状态')
    },
    async ({ branch, page, page_size, start, end, slug, status }) => {
      try {
        const workspaces = await listWorkspace(client, {
          branch,
          page,
          page_size,
          start,
          end,
          slug,
          status
        });
        return formatTextToolResult(JSON.stringify(workspaces, null, 2), ToolNames.LIST_WORKSPACES);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_WORKSPACES);
      }
    }
  );

  server.tool(
    ToolNames.DELETE_WORKSPACE,
    toolDescriptions[ToolNames.DELETE_WORKSPACE],
    {
      pipelineId: z.string().describe('开发环境 ID')
    },
    async ({ pipelineId }) => {
      try {
        const result = await deleteWorkspace(client, {
          pipelineId
        });
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.DELETE_WORKSPACE);
      } catch (error) {
        return formatToolError(error, ToolNames.DELETE_WORKSPACE);
      }
    }
  );
}
