import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import CnbApiClient from '../api/client.js';
import { createRepository, getRepository, listGroupRepositories, listRepositories } from '../api/repository.js';
import { getUser } from '../api/user.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';
import { getRepoPath } from '../helpers/formatRepoUrl.js';
import { buildRepositoryListParams } from '../helpers/repositoryListParams.js';

const optionalString = z.preprocess((val) => (val === null ? undefined : val), z.string().optional());
const optionalBoolean = z.preprocess((val) => (val === null ? undefined : val), z.boolean().optional());

export default function registerRepoTools(server: McpServer, client: CnbApiClient) {
  server.tool(
    ToolNames.LIST_REPOSITORIES,
    toolDescriptions[ToolNames.LIST_REPOSITORIES],
    {
      remote_url: optionalString.describe('兼容旧客户端保留；仓库列表权限完全由 CNB Token 决定，此参数不会改变查询范围'),
      page: z.number().int().positive().default(1).describe('第几页,从1开始,默认值是1'),
      page_size: z.number().int().min(1).max(100).default(10).describe('每页多少条数据,默认值为10'),
      search: optionalString.describe('查询关键字'),
      filter_type: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['private', 'public', 'secret']).optional())
        .describe('仓库类型,为空表示所有仓库类型'),
      role: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['Guest', 'Reporter', 'Developer', 'Master', 'Owner']).default('Guest')
        )
        .describe('最小仓库权限；默认 Guest，以返回当前 Token 可访问的全部仓库'),
      flags: optionalString.describe('仓库类型标记，可按 CNB API 约定使用逗号分隔，例如 KnowledgeBase,NPC'),
      flags_match: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['intersection', 'union']).optional())
        .describe('flags 多值匹配模式'),
      status: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['active', 'archived']).optional())
        .describe('仓库状态'),
      order_by: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['created_at', 'last_updated_at', 'stars', 'slug_path', 'forks']).optional()
        )
        .describe('排序类型,默认值是last_updated_at'),
      desc: optionalBoolean.default(true).describe('是否倒序排序，默认值为true')
    },
    async ({ remote_url, page, page_size, search, filter_type, role, flags, flags_match, status, order_by, desc }) => {
      try {
        const repos = await listRepositories(
          client,
          buildRepositoryListParams({
            remote_url,
            page,
            page_size,
            search,
            filter_type,
            role,
            flags,
            flags_match,
            status,
            order_by,
            desc
          })
        );
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
      page: z.number().int().positive().default(1).describe('第几页,从1开始,默认值是1'),
      page_size: z.number().int().min(1).max(100).default(10).describe('每页多少条数据,默认值为10'),
      search: optionalString.describe('仓库关键字'),
      filter_type: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['private', 'public', 'secret']).optional())
        .describe('仓库类型'),
      flags: optionalString.describe('仓库类型标记，可按 CNB API 约定使用逗号分隔，例如 KnowledgeBase,NPC'),
      flags_match: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['intersection', 'union']).optional())
        .describe('flags 多值匹配模式'),
      status: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['active', 'archived']).optional())
        .describe('仓库状态'),
      descendant: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['all', 'sub', 'grand']).optional())
        .describe('查全部、直接属于当前组织的仓库、子组织的仓库'),
      order_by: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['created_at', 'last_updated_at', 'stars', 'slug_path', 'forks']).optional()
        )
        .describe('排序类型'),
      desc: optionalBoolean.default(true).describe('是否倒序排序，默认值为true')
    },
    async ({ group, page, page_size, search, filter_type, flags, flags_match, status, descendant, order_by, desc }) => {
      try {
        const repos = await listGroupRepositories(client, group, {
          page,
          page_size,
          search,
          filter_type,
          flags,
          flags_match,
          status,
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
      group: optionalString.describe('仓库所属分组'),
      name: z.string().describe('仓库名称'),
      description: optionalString.describe('仓库描述'),
      license: optionalString.describe('仓库许可'),
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

        const data = await getRepository(client, repoPath);
        return formatTextToolResult(JSON.stringify(data, null, 2), ToolNames.GET_CURRENT_REPOSITORY);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_CURRENT_REPOSITORY);
      }
    }
  );
}
