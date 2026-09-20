# CNB ChatGPT MCP

面向 ChatGPT 和其他支持 MCP 的 AI 客户端提供 CNB 操作能力。通过 MCP Tools，可以在对话中读取仓库、查看分支和 Commit、管理 Issue / Pull Request、执行代码修改、查询和触发 CNB Build 等操作。

> `https://api.cnb.cool` 是 CNB OpenAPI 地址，不是 MCP Server 地址。ChatGPT 应连接本服务暴露的 `/mcp` 端点。

## 能做什么

| 类别 | 主要能力 |
| --- | --- |
| 组织 / 仓库 | 查询组织、仓库，创建仓库 |
| Git | 读取文件和目录、查看/创建分支、查询 Commit、比较 Commit、查询 Commit Status |
| 代码修改 | 通过 `cnb_apply_patch` 应用多文件 unified diff，自动 Commit 并 Push 到 CNB |
| Issue | 查询、创建、更新、评论、标签管理 |
| Pull Request | 查询、创建、更新、查看变更、评论、合并 |
| CNB Build | 查询构建、查看状态、启动/停止构建、读取构建信息 |
| Workspace | 查询、删除云原生开发环境 |
| Knowledge Base | 查询知识库信息和内容 |

常用研发工具包括：

`cnb_get_content`、`cnb_list_branches`、`cnb_create_branch`、`cnb_delete_branch`、`cnb_list_commits`、`cnb_get_commit`、`cnb_compare_commits`、`cnb_get_commit_statuses`、`cnb_apply_patch`、`cnb_get_pull_changes`。

---

## 推荐：Docker 一键启动

这是最简单的使用方式。只需要安装 Docker，不需要在宿主机安装 Node.js 或 npm。

### 1. 准备 Docker

安装 Docker Engine / Docker Desktop，并确认 Docker Compose 可用：

~~~bash
docker --version
docker compose version
~~~

### 2. 下载代码

~~~bash
git clone https://github.com/drawdy/cnb-chatgpt-mcp.git
cd cnb-chatgpt-mcp
~~~

### 3. 配置 CNB Token

Linux / macOS：

~~~bash
cp .env.example .env
~~~

Windows PowerShell：

~~~powershell
Copy-Item .env.example .env
~~~

编辑 `.env`，至少填写 `API_TOKEN`：

~~~dotenv
API_BASE_URL=https://api.cnb.cool
API_TOKEN=你的_CNB_Token
APP_PORT=3000
MODE_STATELESS=
~~~

不要把真实 Token 提交到 Git。

### 4. 一条命令构建并启动

~~~bash
docker compose up -d --build
~~~

该命令会：

1. 构建 TypeScript 项目；
2. 生成运行镜像；
3. 启动 MCP Server；
4. 将宿主机端口映射到容器；
5. 自动启用健康检查。

查看状态：

~~~bash
docker compose ps
~~~

查看日志：

~~~bash
docker compose logs -f
~~~

验证健康检查：

~~~bash
curl http://127.0.0.1:3000/healthz
~~~

Windows PowerShell 也可以：

~~~powershell
Invoke-RestMethod http://127.0.0.1:3000/healthz
~~~

正常返回：

~~~json
{"status":"ok","service":"cnb-chatgpt-mcp"}
~~~

此时 MCP 地址为：

~~~text
http://127.0.0.1:3000/mcp
~~~

如果修改了 `APP_PORT`，端口也随之变化。

### 5. 配置到 ChatGPT

如果 Docker 服务部署在公网服务器，并已经通过域名和 HTTPS 暴露，例如：

~~~text
https://mcp.example.com/mcp
~~~

就在 ChatGPT 的自定义 MCP / 插件连接配置中填写这个地址。

不要填写：

~~~text
https://api.cnb.cool
~~~

因为它是 CNB 的 REST/OpenAPI 服务，不是 MCP Server。

如果 MCP Server 只运行在本机或内网，需要使用 MCP 客户端支持的 Tunnel / 反向代理方式，让 ChatGPT 能访问该 MCP 服务。

### 6. 开始使用

连接成功后，可以直接在对话中提出类似请求：

~~~text
列出我在 CNB 中可以访问的仓库

读取 group/repo 的 README.md

列出 group/repo 的分支

查看最近 20 个 Commit

创建一个 feat/example 分支

删除一个已经合并且不再需要的非保护分支

读取某个 Pull Request 的代码变更

把这组代码修改提交到新分支并创建 Pull Request

查看这个 Commit 对应的构建状态
~~~

### Docker 常用命令

更新代码后重新构建并启动：

~~~bash
git pull
docker compose up -d --build
~~~

停止并删除容器：

~~~bash
docker compose down
~~~

重启：

~~~bash
docker compose restart
~~~

查看最近日志：

~~~bash
docker compose logs --tail=200
~~~

强制重新构建、不使用 Docker Build Cache：

~~~bash
docker compose build --no-cache
docker compose up -d
~~~

---

## Docker 实现说明

仓库包含：

~~~text
Dockerfile
compose.yml
.dockerignore
~~~

Dockerfile 使用多阶段构建：

~~~text
docker.cnb.cool/bookbridge/public/node:24.21.0-trixie-slim
        |
        +-- build stage
        |     npm ci
        |     generate:schema
        |     TypeScript build
        |
        +-- runtime stage
              production dependencies
              git
              dist/
~~~

为了提升中国大陆网络环境下的构建稳定性和下载速度，镜像内默认使用：

- npm registry：`https://registry.npmmirror.com`
- Debian 主仓库：`http://mirrors.tuna.tsinghua.edu.cn/debian`
- Debian Security：`http://mirrors.tuna.tsinghua.edu.cn/debian-security`

Debian 12+ 容器镜像使用 `/etc/apt/sources.list.d/debian.sources` 的 DEB822 格式，本项目只替换其中的仓库 URI，保留基础镜像原有的 suite / component 配置。这里使用 TUNA 的 HTTP 地址，避免精简基础镜像在安装 `ca-certificates` 之前访问 HTTPS 软件源时出现证书校验问题；APT 仍会使用 Debian 仓库签名校验索引和软件包。

运行镜像额外安装了 `git`，因为 `cnb_apply_patch` 需要在临时工作目录中执行 Git clone / commit / push。

容器默认：

- MCP：`POST /mcp`
- Health：`GET /healthz`
- Port：`3000`
- Restart policy：`unless-stopped`
- Runtime user：基础镜像内置的非 root `node` 用户

`Dockerfile` 自带健康检查，因此可以通过：

~~~bash
docker inspect --format='{{json .State.Health}}' cnb-chatgpt-mcp
~~~

查看容器健康状态。

---

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `API_BASE_URL` | `https://api.cnb.cool` | CNB OpenAPI 地址 |
| `API_TOKEN` | 空 | 服务端 CNB Token |
| `CNB_TOKEN` | 空 | `API_TOKEN` 未设置时的备用 Token |
| `APP_PORT` | `3000` | HTTP MCP Server 监听端口 |
| `MODE_STATELESS` | 空 | 设置为 `1` / `true` 时使用无状态模式 |

CNB Token 的读取优先级为：

1. MCP HTTP 请求中的 `Authorization: Bearer <token>`
2. 环境变量 `API_TOKEN`
3. 环境变量 `CNB_TOKEN`

### 公网部署注意事项

不要把一个配置了高权限 `API_TOKEN` 的 MCP Server 无保护地暴露到公网。

生产部署至少应满足以下一种方式：

- MCP 客户端按请求提供 Bearer Token；
- 在 MCP Server 前增加可靠的认证层；
- 将服务限制在受信任网络或安全 Tunnel 内。

如果希望客户端按请求提供 Bearer Token，可以让 `.env` 中的 `API_TOKEN` 保持为空。

代码写入场景中的 `cnb_apply_patch` 使用临时 `GIT_ASKPASS` 传递 Token，不会把凭据写进 Git remote URL 或仓库配置。

---

## 不使用 Docker：直接运行 Node.js

环境要求：Node.js 18 或更高版本。

安装依赖并构建：

~~~bash
npm ci
npm run generate:schema
npm run build
~~~

启动 Streamable HTTP MCP Server：

~~~bash
npm start
~~~

默认地址：

~~~text
MCP:     http://127.0.0.1:3000/mcp
Health:  http://127.0.0.1:3000/healthz
~~~

### STDIO 模式

本地 MCP 客户端还可以使用 STDIO：

~~~bash
npm run build
API_TOKEN=<CNB_TOKEN> npm run start:stdio
~~~

示例：

~~~json
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
~~~

---

## 开发与验证

完整检查：

~~~bash
npm ci
npm run check
~~~

`npm run check` 依次执行：

~~~text
generate:schema
-> ESLint
-> Prettier check
-> TypeScript build
~~~

CI 除了执行上述检查，还会实际运行：

~~~bash
docker compose up -d --build
~~~

并检查 `/healthz` 和容器内的 Git 命令，以避免 Dockerfile / Compose 配置失效。

仓库只保留一份 `swagger.json` OpenAPI 快照，用于生成 `src/schema.d.ts`。生成文件不提交到 Git：

~~~bash
npm run generate:schema
~~~

面向 AI Coding 的维护约定见 `AGENTS.md`。


### 分支删除安全约束

`cnb_delete_branch` 使用 CNB OpenAPI 的分支删除接口。MCP 会在删除前读取目标分支和仓库默认分支，并遵循 fail-closed 策略：仅当 CNB 明确返回 `protected=false` 且目标不是默认分支时才允许删除；保护状态缺失、保护分支和默认分支都会被拒绝。
