# CNB MCP Server

CNB(https://cnb.cool) toolkits for LLMs supporting the MCP protocol

## Tool List

| Tool Name | Tool Description |
| :----- | :------- |
| cnb_list_groups | Gets a list of top-level organizations for which the current user has permissions on the CNB platform. |
| cnb_list_sub_groups | Gets a list of sub-organizations for which the current user has permissions on the CNB platform under a specified organization. |
| cnb_get_group | Gets information about a specified organization on the CNB platform. |
| cnb_create_group | Creates a new organization on the CNB platform. |
| cnb_list_repositories | Gets a list of repositories for which the current user has permissions on the CNB platform. |
| cnb_list_group_repositories | Gets a list of repositories for which the current user has permissions on the CNB platform under a specified organization. |
| cnb_get_current_repository | Gets information about the CNB platform repository corresponding to the current workspace. |
| cnb_get_repository | Gets information about a specified repository on the CNB platform. |
| cnb_create_repository | Create a new repository on the CNB platform. |
| cnb_list_issues | Get a list of issues in a specified repository on the CNB platform. |
| cnb_get_issue | Get information about a specified issue on the CNB platform. |
| cnb_create_issue | Create a new issue in a specified repository on the CNB platform. To add labels, use the cnb_add_issue_labels tool. |
| cnb_update_issue | Update information about a specified issue on the CNB platform. To update labels, call the cnb_set_issue_labels tool separately. |
| cnb_list_issue_comments | Get a list of comments for a specified issue on the CNB platform. |
| cnb_create_issue_comment | Create a new comment on a specified issue on the CNB platform. |
| cnb_update_issue_comment | Update the content of a comment on a specified issue on the CNB platform. |
| cnb_list_issue_labels | Get a list of labels for a specified issue on the CNB platform. |
| cnb_add_issue_labels | Add one or more labels to a specified issue on the CNB platform. |
| cnb_set_issue_labels | Change the labels for a specified issue on the CNB platform. |
| cnb_clear_issue_labels | Clear the labels for a specified issue on the CNB platform. |
| cnb_remove_issue_label | Remove a specified label from a specified issue on the CNB platform. |
| cnb_list_pulls | Get a list of merge requests for a specified repository on the CNB platform. |
| cnb_get_pull | Get information about a merge request specified on the CNB platform |
| cnb_create_pull | Create a new merge request in a repository specified on the CNB platform |
| cnb_update_pull | Update information about a merge request specified on the CNB platform |
| cnb_merge_pull | Merge a merge request specified on the CNB platform |
| cnb_list_pull_comments | Get a list of comments for a merge request specified on the CNB platform |
| cnb_create_pull_comment | Create a new comment on a merge request specified on the CNB platform |
| cnb_buildLogsDelete | Delete pipeline or cloud-native build log content |
| cnb_buildRunnerDownloadLog | Download pipeline or cloud-native build runner logs |
| cnb_getBuildLogs | Query pipeline or cloud-native build list |
| cnb_getBuildStage | Query pipeline or cloud-native build stage details |
| cnb_getBuildStatus | Query pipeline or cloud-native build status |
| cnb_startBuild | Start a build |
| cnb_stopBuild | Stop a build |
| cnb_list_workspaces | Get a list of the current user's cloud-native development environments on the CNB platform |
| cnb_delete_workspace | Delete a specified cloud-native development environment on the CNB platform |
| cnb_getKnowledgeBaseInfo | Get knowledge base information |
| cnb_queryKnowledgeBase | Query knowledge base |

## How to use

### STDIO

```json
{
  "mcpServers": {
    "cnb": {
      "command": "npx",
      "args": ["-y", "-p", "@cnbcool/mcp-server", "cnb-mcp-stdio"],
      "env": {
        "API_BASE_URL": "<BASE_URL>", // optional, defualt vaule: https://api.cnb.cool
        "API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```


## Prerequisite

1. node >= 18

## How to develop

1. `npm install`
2. `npx openapi-typescript@5.4.2 https://api.cnb.cool/swagger.json -o src/schema.d.ts`
3. Copy `.env.example` and rename to `.env` and fill in the values
4. `npm run build`
5. `npx @modelcontextprotocol/inspector node dist/stdio.js`

> @modelcontextprotocol/inspector requires Node.js: ^22.7.5

> https://github.com/modelcontextprotocol/inspector?tab=readme-ov-file#requirements

## How to preview

1. npm run build
2. set mcpServers config:

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
