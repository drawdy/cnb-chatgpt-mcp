import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import CnbApiClient from '../api/client.js';
import {
  createIssue,
  createIssueComment,
  getIssue,
  listIssueComments,
  listIssues,
  updateIssue,
  updateIssueComment,
  listIssueLabels,
  addIssueLabels,
  setIssueLabels,
  deleteIssueLabels,
  deleteIssueLabel
} from '../api/issue.js';
import convertLink from '../helpers/convertLink.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';

export default function registerIssueTools(server: McpServer, client: CnbApiClient) {
  server.tool(
    ToolNames.LIST_ISSUES,
    toolDescriptions[ToolNames.LIST_ISSUES],
    {
      repo: z.string().describe('仓库路径'),
      page: z.number().default(1).describe('第几页,从1开始'),
      page_size: z.number().default(10).describe('每页多少条数据,默认是30'),
      state: z
        .preprocess((val) => (val === null ? undefined : val), z.enum(['open', 'closed']).optional())
        .describe('Issue 状态'),
      keyword: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Issue 关键字'),
      priority: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('Issue 优先级,example: p0,p1,p2,p3'),
      labels: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Issue 标签'),
      authors: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('Issue 作者的名字, example: 张三,李四'),
      assignees: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('Issue 处理人,example: 张三,李四,-; - means assign to nobody'),
      updated_time_begin: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('Issue 更新时间的范围,开始时间点,example: 2022-01-31'),
      updated_time_end: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('Issue 更新时间的范围,结束时间点,example: 2022-01-31'),
      order_by: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('Issue 排序顺序.example: created_at, -updated_at, reference_count。‘-’ prefix means descending order')
    },
    async ({
      repo,
      page,
      page_size,
      state,
      keyword,
      priority,
      labels,
      authors,
      assignees,
      updated_time_begin,
      updated_time_end,
      order_by
    }) => {
      try {
        const issues = await listIssues(client, repo, {
          page,
          page_size,
          state,
          keyword,
          priority,
          labels,
          authors,
          assignees,
          updated_time_begin,
          updated_time_end,
          order_by
        });
        return formatTextToolResult(JSON.stringify(issues, null, 2), ToolNames.LIST_ISSUES);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_ISSUES);
      }
    }
  );

  server.tool(
    ToolNames.GET_ISSUE,
    toolDescriptions[ToolNames.GET_ISSUE],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID')
    },
    async ({ repo, issueId }) => {
      try {
        const issue = await getIssue(client, repo, issueId);
        if (typeof (issue as { body?: unknown }).body === 'string') {
          (issue as { body: string }).body = convertLink((issue as { body: string }).body, repo);
        }
        return formatTextToolResult(JSON.stringify(issue, null, 2), ToolNames.GET_ISSUE);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_ISSUE);
      }
    }
  );

  server.tool(
    ToolNames.CREATE_ISSUE,
    toolDescriptions[ToolNames.CREATE_ISSUE],
    {
      repo: z.string().describe('仓库路径'),
      title: z.string().describe('Issue 标题'),
      body: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Issue 描述'),
      assignees: z
        .preprocess((val) => (val === null ? undefined : val), z.array(z.string()).optional())
        .describe('一个或多个 Issue 处理人的用户名'),
      labels: z
        .preprocess((val) => (val === null ? undefined : val), z.array(z.string()).optional())
        .describe('一个或多个 Issue 标签'),
      priority: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Issue 优先级')
    },
    async ({ repo, title, body, assignees, labels, priority }) => {
      try {
        const issue = await createIssue(client, repo, {
          title,
          body,
          assignees,
          labels,
          priority
        });
        return formatTextToolResult(JSON.stringify(issue, null, 2), ToolNames.CREATE_ISSUE);
      } catch (error) {
        return formatToolError(error, ToolNames.CREATE_ISSUE);
      }
    }
  );

  server.tool(
    ToolNames.UPDATE_ISSUE,
    toolDescriptions[ToolNames.UPDATE_ISSUE],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID'),
      title: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Issue 标题'),
      body: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Issue 描述'),
      priority: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Issue 优先级'),
      state: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Issue 状态'),
      state_reason: z
        .preprocess(
          (val) => (val === null ? undefined : val),
          z.enum(['completed', 'not_planned', 'reopened']).optional()
        )
        .describe('Issue 状态原因')
    },
    async ({ repo, issueId, title, body, priority, state, state_reason }) => {
      try {
        const issue = await updateIssue(client, repo, issueId, {
          title,
          body,
          priority,
          state,
          state_reason
        });
        return formatTextToolResult(JSON.stringify(issue, null, 2), ToolNames.UPDATE_ISSUE);
      } catch (error) {
        return formatToolError(error, ToolNames.UPDATE_ISSUE);
      }
    }
  );

  server.tool(
    ToolNames.LIST_ISSUE_COMMENTS,
    toolDescriptions[ToolNames.LIST_ISSUE_COMMENTS],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID'),
      page: z.number().default(1).describe('第几页,从1开始'),
      page_size: z.number().default(30).describe('每页多少条数据,默认是30')
    },
    async ({ repo, issueId, page, page_size }) => {
      try {
        const comments = await listIssueComments(client, repo, issueId, { page, page_size });
        const formattedComments = comments.map((comment) => {
          if (typeof (comment as { body?: unknown }).body === 'string') {
            return {
              ...comment,
              body: convertLink((comment as { body: string }).body, repo)
            };
          }
          return comment;
        });
        return formatTextToolResult(JSON.stringify(formattedComments, null, 2), ToolNames.LIST_ISSUE_COMMENTS);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_ISSUE_COMMENTS);
      }
    }
  );

  server.tool(
    ToolNames.CREATE_ISSUE_COMMENT,
    toolDescriptions[ToolNames.CREATE_ISSUE_COMMENT],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID'),
      body: z.string().describe('评论内容')
    },
    async ({ repo, issueId, body }) => {
      try {
        const comment = await createIssueComment(client, repo, issueId, { body });
        return formatTextToolResult(JSON.stringify(comment, null, 2), ToolNames.CREATE_ISSUE_COMMENT);
      } catch (error) {
        return formatToolError(error, ToolNames.CREATE_ISSUE_COMMENT);
      }
    }
  );

  server.tool(
    ToolNames.UPDATE_ISSUE_COMMENT,
    toolDescriptions[ToolNames.UPDATE_ISSUE_COMMENT],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID'),
      commentId: z.string().describe('评论 ID'),
      body: z.string().describe('评论内容')
    },
    async ({ repo, issueId, commentId, body }) => {
      try {
        const comment = await updateIssueComment(client, repo, issueId, commentId, { body });
        return formatTextToolResult(JSON.stringify(comment, null, 2), ToolNames.UPDATE_ISSUE_COMMENT);
      } catch (error) {
        return formatToolError(error, ToolNames.UPDATE_ISSUE_COMMENT);
      }
    }
  );

  server.tool(
    ToolNames.LIST_ISSUE_LABELS,
    toolDescriptions[ToolNames.LIST_ISSUE_LABELS],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID')
    },
    async ({ repo, issueId }) => {
      try {
        const labels = await listIssueLabels(client, repo, issueId);
        return formatTextToolResult(JSON.stringify(labels, null, 2), ToolNames.LIST_ISSUE_LABELS);
      } catch (error) {
        return formatToolError(error, ToolNames.LIST_ISSUE_LABELS);
      }
    }
  );

  server.tool(
    ToolNames.ADD_ISSUE_LABELS,
    toolDescriptions[ToolNames.ADD_ISSUE_LABELS],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID'),
      labels: z.array(z.string()).describe('要添加的标签列表,每个标签需要从仓库标签列表中选择')
    },
    async ({ repo, issueId, labels }) => {
      try {
        const result = await addIssueLabels(client, repo, issueId, labels);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.ADD_ISSUE_LABELS);
      } catch (error) {
        return formatToolError(error, ToolNames.ADD_ISSUE_LABELS);
      }
    }
  );

  server.tool(
    ToolNames.SET_ISSUE_LABELS,
    toolDescriptions[ToolNames.SET_ISSUE_LABELS],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID'),
      labels: z.array(z.string()).describe('新的标签列表（将替换所有现有标签）,每个标签需要从仓库标签列表中选择')
    },
    async ({ repo, issueId, labels }) => {
      try {
        const result = await setIssueLabels(client, repo, issueId, labels);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.SET_ISSUE_LABELS);
      } catch (error) {
        return formatToolError(error, ToolNames.SET_ISSUE_LABELS);
      }
    }
  );

  server.tool(
    ToolNames.CLEAR_ISSUE_LABELS,
    toolDescriptions[ToolNames.CLEAR_ISSUE_LABELS],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID')
    },
    async ({ repo, issueId }) => {
      try {
        await deleteIssueLabels(client, repo, issueId);
        return formatTextToolResult('All labels deleted', ToolNames.CLEAR_ISSUE_LABELS);
      } catch (error) {
        return formatToolError(error, ToolNames.CLEAR_ISSUE_LABELS);
      }
    }
  );

  server.tool(
    ToolNames.REMOVE_ISSUE_LABEL,
    toolDescriptions[ToolNames.REMOVE_ISSUE_LABEL],
    {
      repo: z.string().describe('仓库路径'),
      issueId: z.number().describe('Issue ID'),
      labelName: z.string().describe('要删除的标签名称')
    },
    async ({ repo, issueId, labelName }) => {
      try {
        await deleteIssueLabel(client, repo, issueId, labelName);
        return formatTextToolResult(`${labelName} deleted`, ToolNames.REMOVE_ISSUE_LABEL);
      } catch (error) {
        return formatToolError(error, ToolNames.REMOVE_ISSUE_LABEL);
      }
    }
  );
}
