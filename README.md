# CNB ChatGPT MCP

面向 ChatGPT 和其他支持 MCP 的 AI 客户端提供 CNB 操作能力。通过 MCP Tools，可以在对话中读取仓库、查看分支和 Commit、管理 Issue / Pull Request、执行代码修改、查询和触发 CNB Build 等操作。

> https://api.cnb.cool 是 CNB OpenAPI 地址，不是 MCP Server 地址。ChatGPT 应连接本服务暴露的 /mcp 端点。

## 能做什么

| 类别 | 主要能力 |
| --- | --- |
| 组织 / 仓库 | 查询组织、仓库，创建仓库 |
| Git | 读取文件和目录、查看/创建分支、查询 Commit、比较 Commit、查询 Commit Status |
| 代码修改 | 通过 cnb_apply_patch 应用多文件 unified diff，自动 Commit 并 Push 到 CNB |
| Issue | 查询、创建、更新、评论、标签管理 |
| Pull Request | 查询、创建、更新、查看变更、评论、合并 |
| CNB Build | 查询构建、查看状态、启动/停止构建、读取构建信息 |
| Workspace | 查询、删除云原生开发环境 |
| Knowledge Base | 查询知识库信息和内容 |

常用研发工具包括：

cnb_get_content、cnb_list_branches、cnb_create_branch、cnb_list_commits、cnb_get_commit、cnb_compare_commits、cnb_get_commit_statuses、cnb_apply_patch、cnb_get_pull_changes。

---

## 最简单的使用方法

下面按“第一次使用也能直接跑起来”的方式说明。

### 1. 准备环境

需要：

- Node.js 18 或更高版本
- 一个可访问 CNB 的网络环境
- 一个具有相应 CNB 权限的 Access Token

先确认 Node.js：

~~~bash
node -v
~~~

### 2. 下载代码并安装依赖

~~~bash
git clone https://github.com/drawdy/cnb-chatgpt-mcp.git
cd cnb-chatgpt-mcp
npm ci
~~~

### 3. 配置 CNB Token

复制环境变量模板。

Linux / macOS：

~~~bash
cp .env.example .env
~~~

Windows PowerShell：

~~~powershell
Copy-Item .env.example .env
~~~

然后编辑 .env：

~~~dotenv
API_BASE_URL=https://api.cnb.cool
API_TOKEN=你的_CNB_Token
APP_PORT=3000
~~~

不要把真实 Token 提交到 Git。

### 4. 编译并启动 MCP Server

~~~bash
npm run build
npm start
~~~

默认启动 Streamable HTTP MCP Server：

~~~text
MCP endpoint:   http://127.0.0.1:3000/mcp
Health check:   http://127.0.0.1:3000/healthz
~~~

验证服务是否启动成功：

~~~bash
curl http://127.0.0.1:3000/healthz
~~~

正常情况下返回：

~~~json
{"status":"ok","service":"cnb-chatgpt-mcp"}
~~~

### 5. 让 ChatGPT 连接这个 MCP

ChatGPT 需要访问一个它能够连接到的 MCP 地址。

如果服务部署在公网并配置了 HTTPS，例如：

~~~text
https://mcp.example.com/mcp
~~~

那么在 ChatGPT 的自定义 MCP / 插件连接配置中填写这个地址。

不要填写：

~~~text
https://api.cnb.cool
~~~

因为它是 CNB 的 REST/OpenAPI 服务，并不实现 MCP 协议。

如果 MCP Server 只运行在本机或内网，需要使用 MCP 客户端支持的 Tunnel / 反向代理方式，让 ChatGPT 能访问该服务。

### 6. 开始使用

连接成功后，可以直接在对话中提出类似请求：

~~~text
列出我在 CNB 中可以访问的仓库

读取 group/repo 的 README.md

列出 group/repo 的分支

查看最近 20 个 Commit

创建一个 feat/example 分支

读取某个 Pull Request 的代码变更

把这组代码修改提交到新分支并创建 Pull Request

查看这个 Commit 对应的构建状态
~~~

---

## 两种运行模式

### Streamable HTTP

适合 ChatGPT、远程 MCP 客户端和服务器部署。

~~~bash
npm run build
npm start
~~~

默认：

- MCP：POST /mcp
- Health：GET /healthz
- Port：3000

可通过环境变量修改：

~~~dotenv
APP_PORT=3000
MODE_STATELESS=
API_BASE_URL=https://api.cnb.cool
API_TOKEN=
~~~

如果设置 MODE_STATELESS=1，服务使用无状态 MCP Transport。

### STDIO

适合本地 MCP 客户端：

~~~bash
npm run build
API_TOKEN=<CNB_TOKEN> npm run start:stdio
~~~

示例配置：

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

## 身份认证

CNB Token 的读取优先级为：

1. MCP HTTP 请求中的 Authorization: Bearer <token>
2. 环境变量 API_TOKEN
3. 环境变量 CNB_TOKEN

API_BASE_URL 默认是：

~~~text
https://api.cnb.cool
~~~

### 公网部署注意事项

不要把一个配置了高权限 API_TOKEN 的 MCP Server 无保护地暴露到公网。

生产部署至少应满足以下一种方式：

- MCP 客户端按请求提供 Bearer Token；
- 在 MCP Server 前增加可靠的认证层；
- 将服务限制在受信任网络或安全 Tunnel 内。

代码写入场景中的 cnb_apply_patch 使用临时 GIT_ASKPASS 传递 Token，不会把凭据写进 Git remote URL 或仓库配置。

---

## 开发与验证

安装依赖：

~~~bash
npm ci
~~~

完整检查：

~~~bash
npm run check
~~~

该命令依次执行：

~~~text
generate:schema
-> ESLint
-> Prettier check
-> TypeScript build
~~~

仓库只保留一份 swagger.json OpenAPI 快照，用于生成 src/schema.d.ts。生成文件不提交到 Git：

~~~bash
npm run generate:schema
~~~

面向 AI Coding 的维护约定见 AGENTS.md。
