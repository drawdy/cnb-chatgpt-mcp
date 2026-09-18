import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import CnbApiClient from '../api/client.js';
import {
  listPulls,
  getPull,
  createPull,
  updatePull,
  mergePull,
  listPullComments,
  createPullComment
} from '../api/pull.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';

export default function registerPullTools(server: McpServer, client: CnbApiClient) {
  server.tool(
    ToolNames.LIST_PULLS,
    toolDescriptions[ToolNames.LIST_PULLS],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      state: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['open', 'closed', 'all']).optional())
        .describe('Pull Request状态'),
      authors: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('按作者过滤，多个值按CNB API约定传递'),
      reviewers: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('按评审人过滤'),
      assignees: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('按负责人过滤'),
      base_ref: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('按目标分支过滤'),
      page: z.number().int().positive().default(1).describe('页码'),
      page_size: z.number().int().min(1).max(100).default(30).describe('每页数量')
    },
    async ({ repo, ...params }) => {
      try {
        const pulls = await listPulls(client, repo, params);
        return formatTextToolResult(JSON.stringify(pulls, null, 2), ToolNames.LIST_PULLS);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_PULLS);
      }
    }
  );

  server.tool(
    ToolNames.GET_PULL,
    toolDescriptions[ToolNames.GET_PULL],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      number: z.number().describe('Pull Request编号')
    },
    async ({ repo, number }) => {
      try {
        const pull = await getPull(client, repo, number);
        return formatTextToolResult(JSON.stringify(pull, null, 2), ToolNames.GET_PULL);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_PULL);
      }
    }
  );

  server.tool(
    ToolNames.CREATE_PULL,
    toolDescriptions[ToolNames.CREATE_PULL],
    {
      repo: z.string().describe('目标仓库路径，格式为 {group}/{repo}'),
      base: z.string().describe('目标仓库目标分支'),
      head_repo: z.string().optional().describe('来源仓库路径，格式为 {group}/{repo},不填则为目标仓库'),
      head: z.string().describe('来源仓库分支'),
      title: z.string().describe('标题'),
      body: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('描述')
    },
    async ({ repo, ...params }) => {
      try {
        const pull = await createPull(client, repo, params);
        return formatTextToolResult(JSON.stringify(pull, null, 2), ToolNames.CREATE_PULL);
      } catch (error) {
        return formatToolError(error, ToolNames.CREATE_PULL);
      }
    }
  );

  server.tool(
    ToolNames.UPDATE_PULL,
    toolDescriptions[ToolNames.UPDATE_PULL],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      number: z.number().describe('Pull Request编号'),
      title: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('标题'),
      body: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('描述'),
      state: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['open', 'closed']).optional())
        .describe('状态')
    },
    async ({ repo, number, ...params }) => {
      try {
        const pull = await updatePull(client, repo, number, params);
        return formatTextToolResult(JSON.stringify(pull, null, 2), ToolNames.UPDATE_PULL);
      } catch (error) {
        return formatToolError(error, ToolNames.UPDATE_PULL);
      }
    }
  );

  server.tool(
    ToolNames.MERGE_PULL,
    toolDescriptions[ToolNames.MERGE_PULL],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      number: z.number().describe('Pull Request编号'),
      merge_style: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['merge', 'squash', 'rebase']).optional())
        .describe('合并方式'),
      commit_title: z.preprocess((val) => (val === null ? undefined : val), z.string()).describe('合并提交标题'),
      commit_message: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('合并提交信息')
    },
    async ({ repo, number, ...params }) => {
      try {
        const result = await mergePull(client, repo, number, params);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.MERGE_PULL);
      } catch (error) {
        return formatToolError(error, ToolNames.MERGE_PULL);
      }
    }
  );

  server.tool(
    ToolNames.LIST_PULL_COMMENTS,
    toolDescriptions[ToolNames.LIST_PULL_COMMENTS],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      number: z.number().describe('Pull Request编号'),
      page: z.number().int().positive().default(1).describe('页码'),
      page_size: z.number().int().min(1).max(100).default(30).describe('每页数量')
    },
    async ({ repo, number, ...params }) => {
      try {
        const comments = await listPullComments(client, repo, number, params);
        return formatTextToolResult(JSON.stringify(comments, null, 2), ToolNames.LIST_PULL_COMMENTS);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_PULL_COMMENTS);
      }
    }
  );

  server.tool(
    ToolNames.CREATE_PULL_COMMENT,
    toolDescriptions[ToolNames.CREATE_PULL_COMMENT],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      number: z.number().describe('Pull Request编号'),
      body: z.string().describe('评论内容')
    },
    async ({ repo, number, body }) => {
      try {
        await createPullComment(client, repo, number, { body });
        return formatTextToolResult('Comment created', ToolNames.CREATE_PULL_COMMENT);
      } catch (error) {
        return formatToolError(error, ToolNames.CREATE_PULL_COMMENT);
      }
    }
  );
}
