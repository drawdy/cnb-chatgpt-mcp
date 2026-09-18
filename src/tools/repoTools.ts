import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import CnbApiClient from '../api/client.js';
import { createRepository, getRepository, listGroupRepositories, listRepositories } from '../api/repository.js';
import { getUser } from '../api/user.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';
import { getRepoPath } from '../helpers/formatRepoUrl.js';
import { isRepoPublic } from '../helpers/checkRepoVisibility.js';

export default function registerRepoTools(server: McpServer, client: CnbApiClient) {
  server.tool(
    ToolNames.LIST_REPOSITORIES,
    toolDescriptions[ToolNames.LIST_REPOSITORIES],
    {
      remote_url: z.string().describe('远程仓库URL，需要先执行`git remote get-url origin`命令获取，获取不到传空字符串'),
      page: z.number().default(1).describe('第几页,从1开始,默认值是1'),
      page_size: z.number().default(10).describe('每页多少条数据,默认值为10'),
      search: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('查询关键字'),
      filter_type: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['private', 'public', 'encrypted']).optional())
        .describe('仓库类型,为空表示所有仓库类型,默认值为空'),
      role: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['Reporter', 'Developer', 'Master', 'Owner']).optional()
        )
        .describe('最小仓库权限,当用户未指定角色时,需要主动传入Reporter'),
      order_by: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['created_at', 'last_updated_at', 'stars']).optional()
        )
        .describe('排序类型,默认值是last_updated_at'),
      desc: z
        .preprocess((val) => (val === null ? undefined : val), z.boolean().optional())
        .describe('是否开启倒叙排序，默认值是false')
    },
    async ({ remote_url, page, page_size, search, filter_type, role, order_by, desc }) => {
      const isPublic = await isRepoPublic(client, remote_url);
      if (isPublic) {
        filter_type = 'public';
      }
      try {
        const repos = await listRepositories(client, { page, page_size, search, filter_type, role, order_by, desc });
        return formatTextToolResult(JSON.stringify(repos, null, 2), ToolNames.LIST_REPOSITORIES);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_REPOSITORIES);
      }
    }
  );

  server.tool(
    ToolNames.LIST_GROUP_REPOSITORIES,
    toolDescriptions[ToolNames.LIST_GROUP_REPOSITORIES],
    {
      group: z.string().describe('组织名称'),
      page: z.number().default(1).describe('第几页,从1开始,默认值是1'),
      page_size: z.number().default(10).describe('每页多少条数据,默认值为10'),
      search: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('仓库关键字'),
      filter_type: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['private', 'public', 'encrypted']).optional())
        .describe('仓库类型'),
      descendant: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['all', 'sub', 'grand']).optional())
        .describe('查全部、直接属于当前组织的仓库、子组织的仓库'),
      order_by: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['created_at', 'last_updated_at', 'stars', 'slug_path']).optional()
        )
        .describe('排序类型'),
      desc: z
        .preprocess((val) => (val === null ? undefined : val), z.boolean().optional())
        .describe('是否开启倒叙排序，默认值是false')
    },
    async ({ group, page, page_size, search, filter_type, descendant, order_by, desc }) => {
      try {
        const repos = await listGroupRepositories(client, group, {
          page,
          page_size,
          search,
          filter_type,
          descendant,
          order_by,
          desc
        });
        return formatTextToolResult(JSON.stringify(repos, null, 2), ToolNames.LIST_GROUP_REPOSITORIES);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_GROUP_REPOSITORIES);
      }
    }
  );

  server.tool(
    ToolNames.GET_REPOSITORY,
    toolDescriptions[ToolNames.GET_REPOSITORY],
    {
      repo: z.string().describe('仓库路径')
    },
    async ({ repo }) => {
      try {
        const repoInfo = await getRepository(client, repo);
        return formatTextToolResult(JSON.stringify(repoInfo, null, 2), ToolNames.GET_REPOSITORY);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_REPOSITORY);
      }
    }
  );

  server.tool(
    ToolNames.CREATE_REPOSITORY,
    toolDescriptions[ToolNames.CREATE_REPOSITORY],
    {
      group: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('仓库所属分组'),
      name: z.string().describe('仓库名称'),
      description: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('仓库描述'),
      license: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('仓库许可'),
      visibility: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['public', 'private', 'secret']).default('public')
        )
        .describe('仓库可见性')
    },
    async ({ group, name, description, license, visibility }) => {
      let repoGroup = group;
      if (!repoGroup) {
        const { username = '' } = await getUser(client);
        repoGroup = username;
      }
      try {
        const data = await createRepository(client, repoGroup, { name, description, license, visibility });
        return formatTextToolResult(JSON.stringify(data, null, 2), ToolNames.CREATE_REPOSITORY);
      } catch (error) {
        return formatToolError(error, ToolNames.CREATE_REPOSITORY);
      }
    }
  );

  server.tool(
    ToolNames.GET_CURRENT_REPOSITORY,
    toolDescriptions[ToolNames.GET_CURRENT_REPOSITORY],
    {
      remote_url: z.string().describe('远程仓库URL, 需要先执行`git remote get-url origin`命令获取')
    },
    async ({ remote_url }) => {
      try {
        const repoPath = getRepoPath(remote_url);

        if (!repoPath) {
          return formatToolError(`无法从远程仓库URL解析出仓库路径: ${remote_url}`, ToolNames.GET_CURRENT_REPOSITORY);
        }

        // 获取仓库信息
        const data = await getRepository(client, repoPath);
        return formatTextToolResult(JSON.stringify(data, null, 2), ToolNames.GET_CURRENT_REPOSITORY);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_CURRENT_REPOSITORY);
      }
    }
  );
}
