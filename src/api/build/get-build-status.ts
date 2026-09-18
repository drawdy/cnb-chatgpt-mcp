// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/*
 * -------------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA CNB-API-GENERATE                        ##
 * -------------------------------------------------------------------------
 * @Version 1.5.0
 * @Source /{repo}/-/build/status/{sn}
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request/cnb';
import { AxiosRequestConfig } from 'axios';
import { DtoBuildStatusResult } from '../interfaces/dto.buildstatusresult';

/**
 * @description getBuildStatus request params
 */
export interface GetBuildStatusParams {
  /**
   * @description Repo path
   */
  repo: string;

  /**
   * @description SN
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
 * @description GetBuildStatusRes Success Response Type
 */
export type GetBuildStatusRes = DtoBuildStatusResult;

/**
 * @description GetBuildStatusError Error Response Type
 */
export type GetBuildStatusError = unknown;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token. 
* repo-cnb-trigger:r
* @tags Build
* @name getBuildStatus
* @summary 查询流水线构建状态。Get pipeline build status.
* @request get:/{repo}/-/build/status/{sn}

----------------------------------
* @param {GetBuildStatusParams} arg0 - getBuildStatus request params
* @param {RequestConfig} arg1 - Other reuqest params
*/
export async function getBuildStatus(
  { repo, sn }: GetBuildStatusParams,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<GetBuildStatusRes, GetBuildStatusError>> {
  return await fetch.request<GetBuildStatusRes, GetBuildStatusError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/build/status/${sn}`,
    _apiTag: '/{repo}/-/build/status/{sn}',
    method: 'get'
  });
}
