# CNB MCP 已于 2026 年 5 月下架，可以使用 CNB Skill[https://cnb.cool/cnb/skills/cnb-skill] 进行替代

# CNB MCP Server

CNB(https://cnb.cool) 支持 MCP 协议的 MCP Server

## 工具列表

| 工具名  | 工具描述 |
| :----- | :------- |
| cnb_list_groups | 获取当前用户在CNB平台里拥有权限的顶层组织列表 |
| cnb_list_sub_groups | 获取当前用户在CNB平台里指定组织下拥有权限的子组织列表 |
| cnb_get_group | 获取CNB平台指定组织的信息 |
| cnb_create_group | 在CNB平台创建一个新组织 |
| cnb_list_repositories | 获取当前用户在CNB平台里拥有权限的仓库列表 |
| cnb_list_group_repositories | 获取当前用户在CNB平台里指定组织下拥有权限的仓库列表 |
| cnb_get_current_repository | 获取当前工作区对应的CNB平台仓库信息 |
| cnb_get_repository | 获取CNB平台指定仓库的信息 |
| cnb_create_repository | 在CNB平台创建一个新仓库 |
| cnb_list_issues | 获取CNB平台指定仓库的ISSUE列表 |
| cnb_get_issue | 获取CNB平台指定ISSUE的信息 |
| cnb_create_issue | 在CNB平台指定的仓库创建一条新ISSUE。如需添加标签，另外调用cnb_add_issue_labels工具 |
| cnb_update_issue | 更新CNB平台指定ISSUE的信息。如需更新标签，另外调用cnb_set_issue_labels工具 |
| cnb_list_issue_comments | 获取CNB平台指定ISSUE的评论列表 |
| cnb_create_issue_comment | 在CNB平台指定的ISSUE创建一条新评论 |
| cnb_update_issue_comment | 更新CNB平台指定ISSUE评论的内容 |
| cnb_list_issue_labels | 获取CNB平台指定ISSUE的标签列表 |
| cnb_add_issue_labels | 为CNB平台指定的ISSUE添加一个或多个标签 |
| cnb_set_issue_labels | 变更CNB平台指定ISSUE的标签 |
| cnb_clear_issue_labels | 清除CNB平台指定ISSUE的标签 |
| cnb_remove_issue_label | 移除CNB平台指定ISSUE的指定标签 |
| cnb_list_pulls | 获取CNB平台指定仓库的合并请求列表 |
| cnb_get_pull | 获取CNB平台指定合并请求的信息 |
| cnb_create_pull | 在CNB平台指定的仓库创建一个新合并请求 |
| cnb_update_pull | 更新CNB平台指定合并请求的信息 |
| cnb_merge_pull | 合并CNB平台指定的合并请求 |
| cnb_list_pull_comments | 获取CNB平台指定合并请求的评论列表 |
| cnb_create_pull_comment | 在CNB平台指定的合并请求创建一条新评论 |
| cnb_buildLogsDelete | 删除流水线或云原生构建日志内容 |
| cnb_buildRunnerDownloadLog | 流水线或云原生构建runner日志下载 |
| cnb_getBuildLogs | 查询流水线或云原生构建构建列表 |
| cnb_getBuildStage | 查询流水线或云原生构建Stage详情 |
| cnb_getBuildStatus | 查询流水线或云原生构建构建状态 |
| cnb_startBuild | 开始一个构建 |
| cnb_stopBuild | 停止一个构建 |
| cnb_list_workspaces | 获取当前用户在CNB平台的云原生开发环境列表 |
| cnb_start_workspace | 在CNB平台启动指定仓库的云原生开发环境 |
| cnb_delete_workspace | 在CNB平台删除指定的云原生开发环境 |
| cnb_getKnowledgeBaseInfo | 获取知识库信息 |
| cnb_queryKnowledgeBase | 查询知识库 |

## 使用方法

### STDIO

```json
{
  "mcpServers": {
    "cnb": {
      "command": "npx",
      "args": ["-y", "-p", "@cnbcool/mcp-server", "cnb-mcp-stdio"],
      "env": {
        "API_BASE_URL": "<BASE_URL>", // 可选，默认值: https://api.cnb.cool
        "API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## 环境要求

1. node >= 18

## 开发指南

1. `npm install`
2. `npx openapi-typescript@5.4.2 https://api.cnb.cool/swagger.json -o src/schema.d.ts`
3. 复制 `.env.example` 并重命名为 `.env` 并填写相应值
4. `npm run build`
5. `npx @modelcontextprotocol/inspector node dist/stdio.js`

> @modelcontextprotocol/inspector 需要 Node.js: ^22.7.5

> https://github.com/modelcontextprotocol/inspector?tab=readme-ov-file#requirements

## 预览方法

1. npm run build
2. 设置 mcpServers 配置:

```json
{
  "mcpServers": {
    "cnb": {
      "command": "node",
      "args": ["/path/to/cnbcool/mcp-server/dist/stdio.js"],
      "env": {
        "API_BASE_URL": "<BASE_URL>", // optional, defualt vaule: https://api.cnb.cool
        "API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### 使用CodeBuddy自动根据swagger.json补充接口MCP Tools

1. `wget https://api.cnb.cool/swagger.json -O ./swagger.json`
2. `npx split-swagger s ./swagger.json ./swagger` 
3. 参考prompt.txt中提示词,调整为有变动的json文件，然后让ai代码助手执行
