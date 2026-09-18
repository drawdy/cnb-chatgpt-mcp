import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import CnbApiClient from '../api/client.js';
import { createGroup, getGroup, listGroups, listSubGroups } from '../api/group.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';

export default function registerGroupTools(server: McpServer, client: CnbApiClient) {
  server.tool(
    ToolNames.LIST_GROUPS,
    toolDescriptions[ToolNames.LIST_GROUPS],
    {
      page: z.number().default(1).describe('第几页，从1开始'),
      page_size: z.number().default(10).describe('每页多少条数据'),
      search: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('仓库关键字'),
      role: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['Guest', 'Reporter', 'Developer', 'Master', 'Owner']).optional()
        )
        .describe('最小仓库权限')
    },
    async ({ page, page_size, search, role }) => {
      try {
        const groups = await listGroups(client, { page, page_size, search, role });
        return formatTextToolResult(JSON.stringify(groups, null, 2), ToolNames.LIST_GROUPS);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_GROUPS);
      }
    }
  );

  server.tool(
    ToolNames.LIST_SUB_GROUPS,
    toolDescriptions[ToolNames.LIST_SUB_GROUPS],
    {
      group: z.string().describe('组织名称'),
      page: z.number().default(1).describe('第几页，从1开始'),
      page_size: z.number().default(10).describe('每页多少条数据'),
      access: z.preprocess((val) => (val === null ? undefined : val), z.number().optional()).describe('权限等级')
    },
    async ({ group, page, page_size, access }) => {
      try {
        const subGroups = await listSubGroups(client, group, { page, page_size, access });
        return formatTextToolResult(JSON.stringify(subGroups, null, 2), ToolNames.LIST_SUB_GROUPS);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_SUB_GROUPS);
      }
    }
  );

  server.tool(
    ToolNames.GET_GROUP,
    toolDescriptions[ToolNames.GET_GROUP],
    {
      group: z.string().describe('组织路径')
    },
    async ({ group }) => {
      try {
        const groupInfo = await getGroup(client, group);
        return formatTextToolResult(JSON.stringify(groupInfo, null, 2), ToolNames.GET_GROUP);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_GROUP);
      }
    }
  );

  server.tool(
    ToolNames.CREATE_GROUP,
    toolDescriptions[ToolNames.CREATE_GROUP],
    {
      path: z.string().describe('组织路径'),
      description: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('组织描述'),
      remark: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('仓库备注'),
      bind_domain: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('根组织绑定的域名')
    },
    async ({ path, description, remark, bind_domain }) => {
      try {
        const data = await createGroup(client, { path, description, remark, bind_domain });
        return formatTextToolResult(JSON.stringify(data, null, 2), ToolNames.CREATE_GROUP);
      } catch (error) {
        return formatToolError(error, ToolNames.CREATE_GROUP);
      }
    }
  );
}
