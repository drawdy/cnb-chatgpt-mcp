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
 * @Source /{repo}/-/knowledge/base
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request';
import { AxiosRequestConfig } from 'axios';
import { DtoKnowledgeBaseInfoRes } from '../interfaces/dto.knowledgebaseinfores';

/**
 * @description Other reuqest params
 */
type RequestConfig<DataType = any> = AxiosRequestConfig<DataType> & {
  options?: CnbRequestOptions;
  req?: IncomingMessage;
};

/**
 * @description GetKnowledgeBaseInfoRes Success Response Type
 */
export type GetKnowledgeBaseInfoRes = DtoKnowledgeBaseInfoRes;

/**
 * @description GetKnowledgeBaseInfoError Error Response Type
 */
export type GetKnowledgeBaseInfoError = unknown;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token.
* repo-code:r
* @tags KnowledgeBase
* @name getKnowledgeBaseInfo
* @summary 获取知识库信息
* @request get:/{repo}/-/knowledge/base

----------------------------------
* @param {string} arg0
* @param {RequestConfig} arg1 - Other reuqest params
*/
export async function getKnowledgeBaseInfo(
  repo: string,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<GetKnowledgeBaseInfoRes, GetKnowledgeBaseInfoError>> {
  return await fetch.request<GetKnowledgeBaseInfoRes, GetKnowledgeBaseInfoError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/knowledge/base`,
    _apiTag: '/{repo}/-/knowledge/base',
    method: 'get'
  });
}
