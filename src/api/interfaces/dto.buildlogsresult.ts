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
 * @Source dto.BuildLogsResult
 */

import { DtoLogInfo } from './dto.loginfo';
export interface DtoBuildLogsResult {
  /**
   * 构建数据列表
   */
  data?: DtoLogInfo[];
  /**
   * 当前仓库是否已经有构建记录，1 表示有构建记录，0 表示没有构建记录
   */
  init?: boolean;
  /**
   * 当前时间戳
   */
  timestamp?: number;
  /**
   * 总数
   */
  total?: number;
}
