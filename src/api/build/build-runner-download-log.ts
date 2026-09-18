// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/*
 * -------------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA CNB-API-GENERATE                        ##
 * -------------------------------------------------------------------------
 * @Version 1.5.0
 * @Source /{repo}/-/build/runner/download/log/{pipelineId}
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request/cnb';
import { AxiosRequestConfig } from 'axios';
import { DieWebError } from '../interfaces/die.weberror';

/**
 * @description buildRunnerDownloadLog request params
 */
export interface BuildRunnerDownloadLogParams {
  /**
   * @description Repo path
   */
  repo: string;

  /**
   * @description PipelineId
   */
  pipelineId: string;
}

/**
 * @description Other reuqest params
 */
type RequestConfig<DataType = any> = AxiosRequestConfig<DataType> & {
  options?: CnbRequestOptions;
  req?: IncomingMessage;
};

/**
 * @description BuildRunnerDownloadLogRes Success Response Type
 */
export type BuildRunnerDownloadLogRes = unknown;

/**
 * @description BuildRunnerDownloadLogError Error Response Type
 */
export type BuildRunnerDownloadLogError = DieWebError;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token. 
* repo-cnb-trigger:r
* @tags Build
* @name buildRunnerDownloadLog
* @summary 流水线runner日志下载。Pipeline runner log download.
* @request get:/{repo}/-/build/runner/download/log/{pipelineId}

----------------------------------
* @param {BuildRunnerDownloadLogParams} arg0 - buildRunnerDownloadLog request params
* @param {RequestConfig} arg1 - Other reuqest params
*/
export async function buildRunnerDownloadLog(
  { repo, pipelineId }: BuildRunnerDownloadLogParams,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<BuildRunnerDownloadLogRes, BuildRunnerDownloadLogError>> {
  return await fetch.request<BuildRunnerDownloadLogRes, BuildRunnerDownloadLogError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/build/runner/download/log/${pipelineId}`,
    _apiTag: '/{repo}/-/build/runner/download/log/{pipelineId}',
    method: 'get'
  });
}
