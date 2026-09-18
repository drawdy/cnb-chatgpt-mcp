// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/*
 * -------------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA CNB-API-GENERATE                        ##
 * -------------------------------------------------------------------------
 * @Version 1.5.0
 * @Source /{repo}/-/build/start
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request/cnb';
import { AxiosRequestConfig } from 'axios';
import { DtoStartBuildReq } from '../interfaces/dto.startbuildreq';
import { DtoBuildResult } from '../interfaces/dto.buildresult';

/**
 * @description Other reuqest params
 */
type RequestConfig<DataType = any> = AxiosRequestConfig<DataType> & {
  options?: CnbRequestOptions;
  req?: IncomingMessage;
};

/**
 * @description StartBuildRes Success Response Type
 */
export type StartBuildRes = DtoBuildResult;

/**
 * @description StartBuildError Error Response Type
 */
export type StartBuildError = unknown;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token. 
* repo-cnb-trigger:rw
* @tags Build
* @name startBuild
* @summary 开始一个构建。Start a build.
* @request post:/{repo}/-/build/start

----------------------------------
* @param {string} arg0
* @param {DtoStartBuildReq} arg1
* @param {RequestConfig} arg2 - Other reuqest params
*/
export async function startBuild(
  repo: string,
  request: DtoStartBuildReq,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<StartBuildRes, StartBuildError>> {
  return await fetch.request<StartBuildRes, StartBuildError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/build/start`,
    _apiTag: '/{repo}/-/build/start',
    method: 'post',
    data: request
  });
}
