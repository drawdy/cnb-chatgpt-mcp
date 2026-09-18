// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/*
 * -------------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA CNB-API-GENERATE                        ##
 * -------------------------------------------------------------------------
 * @Version 1.5.0
 * @Source /{repo}/-/build/stop/{sn}
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request/cnb';
import { AxiosRequestConfig } from 'axios';
import { DtoBuildResult } from '../interfaces/dto.buildresult';

/**
 * @description stopBuild request params
 */
export interface StopBuildParams {
  /**
   * @description repo
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
 * @description StopBuildRes Success Response Type
 */
export type StopBuildRes = DtoBuildResult;

/**
 * @description StopBuildError Error Response Type
 */
export type StopBuildError = unknown;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token. 
* repo-cnb-trigger:rw
* @tags Build
* @name stopBuild
* @summary 停止一个构建。 Stop a build.
* @request post:/{repo}/-/build/stop/{sn}

----------------------------------
* @param {StopBuildParams} arg0 - stopBuild request params
* @param {RequestConfig} arg1 - Other reuqest params
*/
export async function stopBuild(
  { repo, sn }: StopBuildParams,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<StopBuildRes, StopBuildError>> {
  return await fetch.request<StopBuildRes, StopBuildError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/build/stop/${sn}`,
    _apiTag: '/{repo}/-/build/stop/{sn}',
    method: 'post'
  });
}
