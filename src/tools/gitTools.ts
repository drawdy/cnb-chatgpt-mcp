import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import CnbApiClient from '../api/client.js';
import {
  compareCommits,
  createBranch,
  getBranch,
  getCommit,
  getCommitStatuses,
  getContent,
  getHead,
  listBranches,
  listCommits
} from '../api/git.js';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';
import { applyPatchAndPush } from '../helpers/gitProcess.js';

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function registerGitTools(server: McpServer, client: CnbApiClient, token: string) {
  server.tool(
    ToolNames.GET_HEAD,
    toolDescriptions[ToolNames.GET_HEAD],
    { repo: z.string().describe('仓库路径，格式为 {group}/{repo}') },
    async ({ repo }) => {
      try {
        return formatTextToolResult(json(await getHead(client, repo)), ToolNames.GET_HEAD);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_HEAD);
      }
    }
  );

  server.tool(
    ToolNames.LIST_BRANCHES,
    toolDescriptions[ToolNames.LIST_BRANCHES],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      page: z.number().int().positive().default(1),
      page_size: z.number().int().min(1).max(100).default(30)
    },
    async ({ repo, page, page_size }) => {
      try {
        return formatTextToolResult(
          json(await listBranches(client, repo, { page, page_size })),
          ToolNames.LIST_BRANCHES
        );
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_BRANCHES);
      }
    }
  );

  server.tool(
    ToolNames.GET_BRANCH,
    toolDescriptions[ToolNames.GET_BRANCH],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      branch: z.string().describe('分支名')
    },
    async ({ repo, branch }) => {
      try {
        return formatTextToolResult(json(await getBranch(client, repo, branch)), ToolNames.GET_BRANCH);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_BRANCH);
      }
    }
  );

  server.tool(
    ToolNames.CREATE_BRANCH,
    toolDescriptions[ToolNames.CREATE_BRANCH],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      name: z.string().describe('新分支名'),
      start_point: z.string().describe('起始分支、tag 或 commit SHA')
    },
    async ({ repo, name, start_point }) => {
      try {
        return formatTextToolResult(json(await createBranch(client, repo, name, start_point)), ToolNames.CREATE_BRANCH);
      } catch (error) {
        return formatToolError(error, ToolNames.CREATE_BRANCH);
      }
    }
  );

  server.tool(
    ToolNames.GET_CONTENT,
    toolDescriptions[ToolNames.GET_CONTENT],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      path: z.string().default('').describe('仓库内文件或目录路径；空字符串表示仓库根目录'),
      ref: z
        .preprocess((value) => (value === null ? undefined : value), z.string().optional())
        .describe('分支、tag 或 commit SHA')
    },
    async ({ repo, path, ref }) => {
      try {
        const result = await getContent(client, repo, path, ref);
        return formatTextToolResult(json(result), ToolNames.GET_CONTENT);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_CONTENT);
      }
    }
  );

  server.tool(
    ToolNames.LIST_COMMITS,
    toolDescriptions[ToolNames.LIST_COMMITS],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      sha: z
        .preprocess((value) => (value === null ? undefined : value), z.string().optional())
        .describe('分支或 commit'),
      author: z.preprocess((value) => (value === null ? undefined : value), z.string().optional()),
      committer: z.preprocess((value) => (value === null ? undefined : value), z.string().optional()),
      since: z.preprocess((value) => (value === null ? undefined : value), z.string().optional()),
      until: z.preprocess((value) => (value === null ? undefined : value), z.string().optional()),
      page: z.number().int().positive().default(1),
      page_size: z.number().int().min(1).max(100).default(30)
    },
    async ({ repo, ...params }) => {
      try {
        return formatTextToolResult(json(await listCommits(client, repo, params)), ToolNames.LIST_COMMITS);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_COMMITS);
      }
    }
  );

  server.tool(
    ToolNames.GET_COMMIT,
    toolDescriptions[ToolNames.GET_COMMIT],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      ref: z.string().describe('commit SHA、分支或 tag')
    },
    async ({ repo, ref }) => {
      try {
        return formatTextToolResult(json(await getCommit(client, repo, ref)), ToolNames.GET_COMMIT);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_COMMIT);
      }
    }
  );

  server.tool(
    ToolNames.COMPARE_COMMITS,
    toolDescriptions[ToolNames.COMPARE_COMMITS],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      base: z.string().describe('基准 commit/ref'),
      head: z.string().describe('待比较 commit/ref')
    },
    async ({ repo, base, head }) => {
      try {
        return formatTextToolResult(json(await compareCommits(client, repo, base, head)), ToolNames.COMPARE_COMMITS);
      } catch (error) {
        return formatToolError(error, ToolNames.COMPARE_COMMITS);
      }
    }
  );

  server.tool(
    ToolNames.GET_COMMIT_STATUSES,
    toolDescriptions[ToolNames.GET_COMMIT_STATUSES],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      commitish: z.string().describe('commit SHA 或 ref')
    },
    async ({ repo, commitish }) => {
      try {
        return formatTextToolResult(
          json(await getCommitStatuses(client, repo, commitish)),
          ToolNames.GET_COMMIT_STATUSES
        );
      } catch (error) {
        return formatToolError(error, ToolNames.GET_COMMIT_STATUSES);
      }
    }
  );

  server.tool(
    ToolNames.APPLY_PATCH,
    toolDescriptions[ToolNames.APPLY_PATCH],
    {
      repo: z.string().describe('仓库路径，格式为 {group}/{repo}'),
      branch: z.string().describe('提交并推送到的分支；不存在时自动创建'),
      base_ref: z
        .preprocess((value) => (value === null ? undefined : value), z.string().optional())
        .describe('新建分支时的基准分支/ref'),
      patch: z.string().describe('标准 unified diff，可包含多个文件'),
      commit_message: z.string().min(1).describe('Git commit message'),
      author_name: z.preprocess((value) => (value === null ? undefined : value), z.string().optional()),
      author_email: z.preprocess((value) => (value === null ? undefined : value), z.string().email().optional()),
      force: z.boolean().default(false).describe('是否使用 --force-with-lease 推送；默认 false')
    },
    async ({ repo, branch, base_ref, patch, commit_message, author_name, author_email, force }) => {
      try {
        const result = await applyPatchAndPush({
          repo,
          branch,
          baseRef: base_ref,
          patch,
          commitMessage: commit_message,
          token,
          authorName: author_name,
          authorEmail: author_email,
          force
        });
        return formatTextToolResult(json(result), ToolNames.APPLY_PATCH);
      } catch (error) {
        return formatToolError(error, ToolNames.APPLY_PATCH);
      }
    }
  );
}
