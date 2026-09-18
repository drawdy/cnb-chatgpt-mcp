# CNB ChatGPT MCP

面向 ChatGPT / AI Agent 的 CNB MCP Server。该仓库基于已归档的 CNB 官方 MCP Server 持续维护，重点补齐代码读取、分支、Commit、Pull Request、CI 和多文件代码修改能力，用于 HyperEyes 等项目在 CNB 上进行完整研发闭环。

> 这是独立维护的 fork，不是 CNB 官方项目。CNB OpenAPI 的上游地址是 `https://api.cnb.cool`；ChatGPT 应连接本项目部署后的 MCP 地址（通常是 `https://<your-domain>/mcp`），不能直接把 CNB OpenAPI 地址当作 MCP Server。

## 主要能力

- 组织与仓库：组织、仓库查询与创建。
- Git / 研发：读取文件和目录、分支查询与创建、Commit 查询与比较、Commit Status。
- 代码修改：`cnb_apply_patch` 可在临时 Git 工作区应用 unified diff，提交并推送到指定 CNB 分支。
- Issue：查询、创建、更新、评论与标签管理。
- Pull Request：查询、创建、更新、查看变更、评论和合并。
- CNB Build：查询构建、查看状态和 Stage、启动/停止构建、读取构建日志。
- Workspace：查询和删除云原生开发环境。
- Knowledge Base：查询知识库信息和内容。

其中 Git / 研发相关工具包括：

`cnb_get_head`、`cnb_list_branches`、`cnb_get_branch`、`cnb_create_branch`、`cnb_get_content`、`cnb_list_commits`、`cnb_get_commit`、`cnb_compare_commits`、`cnb_get_commit_statuses`、`cnb_apply_patch`、`cnb_get_pull_changes`。

部分早期 CNB Build 工具名称保留了上游的 camelCase 命名，以避免破坏已有客户端兼容性。

## 运行方式

环境要求：Node.js >= 18。

安装和验证：

```bash
npm ci
npm run check
npm run build
```

### Streamable HTTP

远程 ChatGPT / MCP 客户端建议使用 HTTP 模式：

```bash
API_TOKEN=<CNB_TOKEN> APP_PORT=3000 npm start
```

默认端点：

- MCP：`POST /mcp`
- 健康检查：`GET /healthz`
- 默认端口：`3000`

如需要无状态模式：

```bash
MODE_STATELESS=1 API_TOKEN=<CNB_TOKEN> npm start
```

HTTP 模式下，CNB Token 的优先级为：

1. 请求头 `Authorization: Bearer <token>`
2. 服务端环境变量 `API_TOKEN`
3. 服务端环境变量 `CNB_TOKEN`

因此部署到公网时，不要把 Token 写进仓库、镜像或 URL。优先使用部署平台的 Secret；如果 MCP 客户端支持 Bearer 认证，也可以让客户端按请求传入 Token。

### STDIO

本地 MCP 客户端可使用 STDIO：

```bash
npm run build
API_TOKEN=<CNB_TOKEN> npm run start:stdio
```

示例：

```json
{
  "mcpServers": {
    "cnb": {
      "command": "node",
      "args": ["/path/to/cnb-chatgpt-mcp/dist/stdio.js"],
      "env": {
        "API_TOKEN": "<CNB_TOKEN>"
      }
    }
  }
}
```

`API_BASE_URL` 可覆盖 CNB API 地址，默认使用 `https://api.cnb.cool`。

## HyperEyes 研发闭环

该 fork 当前支持如下典型流程：

```text
读取代码 / AGENTS.md / README
        ↓
创建或选择研发分支
        ↓
生成 unified diff
        ↓
cnb_apply_patch
        ↓
Commit + Push
        ↓
创建 Pull Request
        ↓
cnb_get_pull_changes
        ↓
查询 / 执行 CNB Build
        ↓
检查精确 Commit 的 CI 状态
        ↓
合并 Pull Request
```

`cnb_apply_patch` 使用临时 `GIT_ASKPASS` 注入 Token，不会把凭据写入 Git remote URL 或仓库配置。

## 开发说明

仓库只保留一份 `swagger.json` 作为 OpenAPI 快照，用于生成 `src/schema.d.ts`：

```bash
npm run generate:schema
```

`src/schema.d.ts` 是生成文件，不提交到 Git。新增或修改工具时，应优先核对当前 CNB OpenAPI，再更新代码和必要的 schema 快照。

CI 在 Pull Request 和 `main` 分支上执行：

```text
generate:schema -> eslint -> prettier check -> TypeScript build
```

面向 AI Coding 的维护约定见 [AGENTS.md](./AGENTS.md)。

## 项目来源

本项目基于 CNB 官方已归档的 `cnb-mcp-server` 继续维护，并针对 ChatGPT 远程 MCP 和持续研发场景进行了扩展。上游已经停止作为官方推荐方案维护，因此本仓库不追求与原仓库发布流程、CNB 内部 CI 配置或 NPM 发布流程保持一致。
