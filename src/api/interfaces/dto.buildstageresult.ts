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
 * @Source dto.BuildStageResult
 */

export interface DtoBuildStageResult {
  /**
   * stage 日志内容，数组格式，一个元素表示一行日志
   */
  content?: string[];
  /**
   * stage 耗时，单位：ms
   */
  duration?: number;
  /**
   * stage 结束时间
   */
  endTime?: number;
  /**
   * stage 错误信息
   */
  error?: string;
  /**
   * stage id
   */
  id?: string;
  /**
   * stage 名称
   */
  name?: string;
  /**
   * stage 开始时间
   */
  startTime?: number;
  /**
   * stage 状态:  "pending", "start", "success", "error", "cancel", "skipped"
   */
  status?: string;
}
