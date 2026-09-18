import { ToolNames } from './toolNames';

export const toolDescriptions = {
  // 组织工具
  [ToolNames.LIST_GROUPS]: '获取当前用户在CNB平台里拥有权限的顶层组织列表',
  [ToolNames.LIST_SUB_GROUPS]: '获取当前用户在CNB平台里指定组织下拥有权限的子组织列表',
  [ToolNames.GET_GROUP]: '获取CNB平台指定组织的信息',
  [ToolNames.CREATE_GROUP]: '在CNB平台创建一个新组织',
  // 仓库工具
  [ToolNames.LIST_REPOSITORIES]: '获取当前用户在CNB平台里拥有权限的仓库列表',
  [ToolNames.LIST_GROUP_REPOSITORIES]: '获取当前用户在CNB平台里指定组织下拥有权限的仓库列表',
  [ToolNames.GET_CURRENT_REPOSITORY]: '获取当前工作区对应的CNB平台仓库信息',
  [ToolNames.GET_REPOSITORY]: '获取CNB平台指定仓库的信息',
  [ToolNames.CREATE_REPOSITORY]: '在CNB平台创建一个新仓库',
  // ISSUE 工具
  [ToolNames.LIST_ISSUES]: '获取CNB平台指定仓库的ISSUE列表',
  [ToolNames.GET_ISSUE]: '获取CNB平台指定ISSUE的信息',
  [ToolNames.CREATE_ISSUE]: `在CNB平台指定的仓库创建一条新ISSUE。如需添加标签，另外调用${ToolNames.ADD_ISSUE_LABELS}工具`,
  [ToolNames.UPDATE_ISSUE]: `更新CNB平台指定ISSUE的信息。如需更新标签，另外调用${ToolNames.SET_ISSUE_LABELS}工具`,
  [ToolNames.LIST_ISSUE_COMMENTS]: '获取CNB平台指定ISSUE的评论列表',
  [ToolNames.CREATE_ISSUE_COMMENT]: '在CNB平台指定的ISSUE创建一条新评论',
  [ToolNames.UPDATE_ISSUE_COMMENT]: '更新CNB平台指定ISSUE评论的内容',
  [ToolNames.LIST_ISSUE_LABELS]: '获取CNB平台指定ISSUE的标签列表',
  [ToolNames.ADD_ISSUE_LABELS]: '为CNB平台指定的ISSUE添加一个或多个标签',
  [ToolNames.SET_ISSUE_LABELS]: '变更CNB平台指定ISSUE的标签',
  [ToolNames.CLEAR_ISSUE_LABELS]: '清除CNB平台指定ISSUE的标签',
  [ToolNames.REMOVE_ISSUE_LABEL]: '移除CNB平台指定ISSUE的指定标签',
  // 合并请求工具
  [ToolNames.LIST_PULLS]: '获取CNB平台指定仓库的合并请求列表',
  [ToolNames.GET_PULL]: '获取CNB平台指定合并请求的信息',
  [ToolNames.CREATE_PULL]: '在CNB平台指定的仓库创建一个新合并请求',
  [ToolNames.UPDATE_PULL]: '更新CNB平台指定合并请求的信息',
  [ToolNames.MERGE_PULL]: '合并CNB平台指定的合并请求',
  [ToolNames.LIST_PULL_COMMENTS]: '获取CNB平台指定合并请求的评论列表',
  [ToolNames.CREATE_PULL_COMMENT]: '在CNB平台指定的合并请求创建一条新评论',
  // 云原生构建工具
  [ToolNames.BUILD_LOGS_DELETE]: '删除流水线或云原生构建日志内容',
  [ToolNames.BUILD_RUNNER_DOWNLOAD_LOG]: '流水线或云原生构建runner日志下载',
  [ToolNames.GET_BUILD_LOGS]: '查询流水线或云原生构建构建列表',
  [ToolNames.GET_BUILD_STAGE]: '查询流水线或云原生构建Stage详情',
  [ToolNames.GET_BUILD_STATUS]: '查询流水线或云原生构建构建状态',
  [ToolNames.START_BUILD]: '开始一个构建',
  [ToolNames.STOP_BUILD]: '停止一个构建',
  // 云原生开发工具
  [ToolNames.LIST_WORKSPACES]: '获取当前用户在CNB平台的云原生开发环境列表',
  [ToolNames.DELETE_WORKSPACE]: '在CNB平台删除指定的云原生开发环境',
  [ToolNames.START_WORKSPACE]: '在CNB平台启动指定仓库的云原生开发环境',
  // 知识库工具
  [ToolNames.GET_KNOWLEDGE_BASE_INFO]: '获取知识库信息',
  [ToolNames.QUERY_KNOWLEDGE_BASE]: '查询知识库'
};
