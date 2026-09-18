// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/*
 * -------------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA CNB-API-GENERATE                        ##
 * ##                                                                     ##
 * ## AUTHOR: bapelin                                                     ##
 * ## SOURCE: https://cnb.woa.com/cnb/frontend-science/cnb-api-generate   ##
 * -------------------------------------------------------------------------
 * @Version 1.5.0
 * @Source dto.StartBuildReq
 */

export interface DtoStartBuildReq {
  /**
   * 触发分支，默认为主分支
   */
  branch?: string;
  /**
   * 指定配置文件内容，yaml 格式
   */
  config?: string;
  /**
   * 环境变量，对象格式
   */
  env?: Record<string, string>;
  /**
   * 事件名，必须是 api_trigger 或以 api_trigger_ 开头，默认为 `api_trigger`
   */
  event?: string;
  /**
   * commit id ，优先级比 tag 高，默认为分支最新提交记录
   */
  sha?: string;
  /**
   * 是否等待构建正式触发，为false时会立刻返回 sn 和 buildLogUrl
   */
  sync?: string;
  /**
   * 触发 tag，优先级比 branch 高
   */
  tag?: string;
}
