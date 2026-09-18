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
 * @Source /{repo}/-/knowledge/base/query
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request';
import { AxiosRequestConfig } from 'axios';
import { DtoQueryKnowledgeBaseReq } from '../interfaces/dto.queryknowledgebasereq';
import { DtoQueryKnowledgeBaseRes } from '../interfaces/dto.queryknowledgebaseres';

/**
 * @description Other reuqest params
 */
type RequestConfig<DataType = any> = AxiosRequestConfig<DataType> & {
  options?: CnbRequestOptions;
  req?: IncomingMessage;
};

/**
 * @description QueryKnowledgeBaseRes Success Response Type
 */
export type QueryKnowledgeBaseRes = DtoQueryKnowledgeBaseRes[];

/**
 * @description QueryKnowledgeBaseError Error Response Type
 */
export type QueryKnowledgeBaseError = unknown;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token.
* repo-code:r
* @tags KnowledgeBase
* @name queryKnowledgeBase
* @summary 查询知识库，使用文档：https://docs.cnb.cool/zh/ai/knowledge-base.html
* @request post:/{repo}/-/knowledge/base/query

----------------------------------
* @param {string} arg0
* @param {DtoQueryKnowledgeBaseReq} arg1
* @param {RequestConfig} arg2 - Other reuqest params
*/
export async function queryKnowledgeBase(
  repo: string,
  query: DtoQueryKnowledgeBaseReq,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<QueryKnowledgeBaseRes, QueryKnowledgeBaseError>> {
  return await fetch.request<QueryKnowledgeBaseRes, QueryKnowledgeBaseError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/knowledge/base/query`,
    _apiTag: '/{repo}/-/knowledge/base/query',
    method: 'post',
    data: query
  });
}
