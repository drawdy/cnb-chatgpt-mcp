import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ToolNames } from '../constants/toolNames.js';
import { toolDescriptions } from '../constants/toolDescriptions.js';
import { formatTextToolResult, formatToolError } from '../helpers/formatToolResult.js';
import { createHeaders } from '../helpers/request/index.js';
import { buildLogsDelete } from '../api/build/build-logs-delete.js';
import { buildRunnerDownloadLog } from '../api/build/build-runner-download-log.js';
import { getBuildLogs } from '../api/build/get-build-logs.js';
import { getBuildStage } from '../api/build/get-build-stage.js';
import { getBuildStatus } from '../api/build/get-build-status.js';
import { startBuild } from '../api/build/start-build.js';
import { stopBuild } from '../api/build/stop-build.js';

export default function registerBuildTools(server: McpServer, token?: string) {
  const headers = createHeaders(token);

  server.tool(
    ToolNames.BUILD_LOGS_DELETE,
    toolDescriptions[ToolNames.BUILD_LOGS_DELETE],
    {
      repo: z.string().describe('仓库路径'),
      sn: z.string().describe('构建 ID')
    },
    async ({ repo, sn }) => {
      try {
        const { error, result } = await buildLogsDelete({ repo, sn }, { headers });
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.BUILD_LOGS_DELETE);
      } catch (error) {
        return formatToolError(error, ToolNames.BUILD_LOGS_DELETE);
      }
    }
  );

  server.tool(
    ToolNames.BUILD_RUNNER_DOWNLOAD_LOG,
    toolDescriptions[ToolNames.BUILD_RUNNER_DOWNLOAD_LOG],
    {
      repo: z.string().describe('仓库路径'),
      pipelineId: z.string().describe('流水线 ID')
    },
    async ({ repo, pipelineId }) => {
      try {
        const { error, result } = await buildRunnerDownloadLog({ repo, pipelineId }, { headers });
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.BUILD_RUNNER_DOWNLOAD_LOG);
      } catch (error) {
        return formatToolError(error, ToolNames.BUILD_RUNNER_DOWNLOAD_LOG);
      }
    }
  );

  server.tool(
    ToolNames.GET_BUILD_LOGS,
    toolDescriptions[ToolNames.GET_BUILD_LOGS],
    {
      repo: z.string().describe('仓库路径'),
      createTime: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('构建开始时间，格式为 YYYY-MM-DD'),
      endTime: z
        .preprocess((val) => (val === null ? undefined : val), z.string().optional())
        .describe('构建结束时间，格式为 YYYY-MM-DD'),
      event: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('触发事件'),
      page: z.number().default(1).describe('页码'),
      pagesize: z.number().max(100).default(30).describe('每页数据的条数'),
      sha: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Commit ID'),
      sn: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('构建 ID'),
      sourceRef: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('源分支名'),
      status: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('构建状态'),
      targetRef: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('目标分支名'),
      userId: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('用户 ID'),
      userName: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('用户名')
    },
    async (params) => {
      try {
        console.error(params, headers);
        const { error, result } = await getBuildLogs(params, { headers });
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.GET_BUILD_LOGS);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_BUILD_LOGS);
      }
    }
  );

  server.tool(
    ToolNames.GET_BUILD_STAGE,
    toolDescriptions[ToolNames.GET_BUILD_STAGE],
    {
      repo: z.string().describe('仓库路径'),
      sn: z.string().describe('构建序列号或 ID'),
      pipelineId: z
        .string()
        .describe('流水线 ID，一个构建可以包含多条流水线。格式 {sn}-001, {sn}-002 等等，001 为起始，加一递增'),
      stageId: z
        .string()
        .describe(
          '流水线阶段 ID，一条流水线可以包含多个阶段。格式 prepare, beforeEnd, end, stage-0, stage-1 等等，0 为起始，加一递增'
        )
    },
    async (params) => {
      const { sn, pipelineId, stageId } = params;
      // 流水线 ID 格式检查
      const pipelineIdRegexp = new RegExp(`^${sn}-\\d{3}$`);
      if (!pipelineIdRegexp.test(pipelineId)) {
        return formatToolError(
          '流水线 ID 格式错误。正确格式：<构建 ID>-<三位序号>，001 为起始，加一递增',
          ToolNames.GET_BUILD_STAGE
        );
      }
      // 流水线阶段 ID 格式检查
      const fixedStageId = ['prepare', 'beforeEnd', 'end'];
      const stageIdRegexp = /^stage-\d$/;
      if (!fixedStageId.includes(stageId) && !stageIdRegexp.test(stageId)) {
        return formatToolError(
          '流水线阶段 ID 格式错误。正确格式：prepare、beforeEnd、end、stage-<序号>，0 为起始，加一递增',
          ToolNames.GET_BUILD_STAGE
        );
      }
      try {
        const { error, result } = await getBuildStage(params, { headers });
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.GET_BUILD_STAGE);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_BUILD_STAGE);
      }
    }
  );

  server.tool(
    ToolNames.GET_BUILD_STATUS,
    toolDescriptions[ToolNames.GET_BUILD_STATUS],
    {
      repo: z.string().describe('仓库路径'),
      sn: z.string().describe('构建 ID')
    },
    async ({ repo, sn }) => {
      try {
        const { error, result } = await getBuildStatus({ repo, sn }, { headers });
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.GET_BUILD_STATUS);
      } catch (error) {
        return formatToolError(error, ToolNames.GET_BUILD_STATUS);
      }
    }
  );

  server.tool(
    ToolNames.START_BUILD,
    toolDescriptions[ToolNames.START_BUILD],
    {
      repo: z.string().describe('仓库路径'),
      branch: z.string().describe('分支名'),
      event: z.string().describe('触发事件'),
      sync: z.string().default('false').describe('同步模式，等待请求完成'),
      config: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('配置'),
      env: z
        .preprocess((val) => (val === null ? undefined : val), z.record(z.string(), z.string()).optional())
        .describe('环境变量'),
      sha: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('Commit ID'),
      tag: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()).describe('git tag')
    },
    async ({ repo, ...body }) => {
      try {
        const { error, result } = await startBuild(repo, body, { headers });
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.START_BUILD);
      } catch (error) {
        return formatToolError(error, ToolNames.START_BUILD);
      }
    }
  );

  server.tool(
    ToolNames.STOP_BUILD,
    toolDescriptions[ToolNames.STOP_BUILD],
    {
      repo: z.string().describe('仓库路径'),
      sn: z.string().describe('构建 ID')
    },
    async ({ repo, sn }) => {
      try {
        const { error, result } = await stopBuild({ repo, sn }, { headers });
        if (error) throw new Error(`ERROR ${error.code}: ${error.message}`);
        return formatTextToolResult(JSON.stringify(result, null, 2), ToolNames.STOP_BUILD);
      } catch (error) {
        return formatToolError(error, ToolNames.STOP_BUILD);
      }
    }
  );
}
