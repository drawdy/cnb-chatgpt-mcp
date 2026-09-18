import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';
import { createHeaders } from '../helpers/request/index.js';
import { getKnowledgeBaseInfo } from '../api/knowledge-base/get-knowledge-base-info.js';
import { queryKnowledgeBase } from '../api/knowledge-base/query-knowledge-base.js';

export default function registerKnowledgeBaseTools(server: McpServer, token?: string) {
  const headers = createHeaders(token);

  server.tool(
    ToolNames.GET_KNOWLEDGE_BASE_INFO,
    toolDescriptions[ToolNames.GET_KNOWLEDGE_BASE_INFO],
    {
      repo: z.string().describe('仓库路径')
    },
    async ({ repo }) => {
      try {
        const { error, result } = await getKnowledgeBaseInfo(repo, { headers });
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.GET_KNOWLEDGE_BASE_INFO);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_KNOWLEDGE_BASE_INFO);
      }
    }
  );

  server.tool(
    ToolNames.QUERY_KNOWLEDGE_BASE,
    toolDescriptions[ToolNames.QUERY_KNOWLEDGE_BASE],
    {
      repo: z.string().describe('仓库路径'),
      query: z.string().describe('要查询的关键词或问题'),
      score_threshold: z.number().default(0).describe('匹配相关性分数阈值'),
      top_k: z.number().default(5).describe('返回结果的最大数量'),
      metadata_filtering_conditions: z
        .object({
          conditions: z.array(
            z.object({
              comparison_operator: z
                .enum([
                  'is',
                  'is not',
                  'contains',
                  'not contains',
                  'starts with',
                  'ends with',
                  'is empty',
                  'is not empty'
                ])
                .describe('运算符'),
              name: z.enum(['position', 'path', 'type']).describe('字段名称'),
              value: z.string().describe('比较值。运算符 "is empty" 和 "is not empty" 时忽略此字段')
            })
          ),
          logical_operator: z.enum(['and', 'or']).default('and').describe('逻辑连接条件')
        })
        .optional()
        .describe('元数据过滤条件')
    },
    async ({ repo, query, score_threshold, top_k, metadata_filtering_conditions }) => {
      try {
        const { error, result } = await queryKnowledgeBase(
          repo,
          { query, score_threshold, top_k, metadata_filtering_conditions },
          { headers }
        );
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.QUERY_KNOWLEDGE_BASE);
      } catch (error) {
        return formatToolError(error, ToolNames.QUERY_KNOWLEDGE_BASE);
      }
    }
  );
}
