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
 * @Version 1.5.2
 * @Source dto.QueryKnowledgeBaseReq
 */

import { DtoMetadataFilteringConditions } from './dto.metadatafilteringconditions';
export interface DtoQueryKnowledgeBaseReq {
  /**
   * 元数据过滤条件
   */
  metadata_filtering_conditions?: DtoMetadataFilteringConditions;
  /**
   * 查询语句
   */
  query?: string;
  /**
   * 分数阈值
   */
  score_threshold?: number;
  /**
   * 返回结果的数量
   */
  top_k?: number;
}
