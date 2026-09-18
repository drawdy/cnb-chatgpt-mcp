// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/*
 * -------------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA CNB-API-GENERATE                        ##
 * -------------------------------------------------------------------------
 * @Version 1.5.0
 * @Source /{repo}/-/build/logs/{sn}
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request/cnb';
import { AxiosRequestConfig } from 'axios';
import { DtoBuildLogsDeleteResult } from '../interfaces/dto.buildlogsdeleteresult';

/**
 * @description buildLogsDelete request params
 */
export interface BuildLogsDeleteParams {
  /**
   * @description Repo path
   */
  repo: string;

  /**
   * @description Sn
   */
  sn: string;
}

/**
 * @description Other reuqest params
 */
type RequestConfig<DataType = any> = AxiosRequestConfig<DataType> & {
  options?: CnbRequestOptions;
  req?: IncomingMessage;
};

/**
 * @description BuildLogsDeleteRes Success Response Type
 */
export type BuildLogsDeleteRes = DtoBuildLogsDeleteResult;

/**
 * @description BuildLogsDeleteError Error Response Type
 */
export type BuildLogsDeleteError = unknown;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token. 
* repo-cnb-trigger:rw
* @tags Build
* @name buildLogsDelete
* @summary 删除流水线日志内容。Delete pipeline logs content.
* @request delete:/{repo}/-/build/logs/{sn}

----------------------------------
* @param {BuildLogsDeleteParams} arg0 - buildLogsDelete request params
* @param {RequestConfig} arg1 - Other reuqest params
*/
export async function buildLogsDelete(
  { repo, sn }: BuildLogsDeleteParams,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<BuildLogsDeleteRes, BuildLogsDeleteError>> {
  return await fetch.request<BuildLogsDeleteRes, BuildLogsDeleteError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/build/logs/${sn}`,
    _apiTag: '/{repo}/-/build/logs/{sn}',
    method: 'delete'
  });
}
