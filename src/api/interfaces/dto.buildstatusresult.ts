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
 * @Source dto.BuildStatusResult
 */

import { DtoPipelineStatus } from './dto.pipelinestatus';
export interface DtoBuildStatusResult {
  /**
   * 解析后的流水线JSON格式配置内容
   */
  jsonConfig?: string;
  /**
   * 流水线的状态
   */
  pipelinesStatus?: Record<string, DtoPipelineStatus>;
  /**
   * 流水线原始配置内容
   */
  rawConfig?: string;
  /**
   * 构建状态
   */
  status?: string;
}
