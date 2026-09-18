// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/*
 * -------------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA CNB-API-GENERATE                        ##
 * -------------------------------------------------------------------------
 * @Version 1.5.0
 * @Source /{repo}/-/build/logs/stage/{sn}/{pipelineId}/{stageId}
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request/cnb';
import { AxiosRequestConfig } from 'axios';
import { DtoBuildStageResult } from '../interfaces/dto.buildstageresult';

/**
 * @description getBuildStage request params
 */
export interface GetBuildStageParams {
  /**
   * @description Repo path
   */
  repo: string;

  /**
   * @description SN
   */
  sn: string;

  /**
   * @description PipelineId
   */
  pipelineId: string;

  /**
   * @description stageId
   */
  stageId: string;
}

/**
 * @description Other reuqest params
 */
type RequestConfig<DataType = any> = AxiosRequestConfig<DataType> & {
  options?: CnbRequestOptions;
  req?: IncomingMessage;
};

/**
 * @description GetBuildStageRes Success Response Type
 */
export type GetBuildStageRes = DtoBuildStageResult;

/**
 * @description GetBuildStageError Error Response Type
 */
export type GetBuildStageError = unknown;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token. 
* repo-cnb-trigger:r
* @tags Build
* @name getBuildStage
* @summary 查询流水线Stage详情。Get pipeline build stage detail.
* @request get:/{repo}/-/build/logs/stage/{sn}/{pipelineId}/{stageId}

----------------------------------
* @param {GetBuildStageParams} arg0 - getBuildStage request params
* @param {RequestConfig} arg1 - Other reuqest params
*/
export async function getBuildStage(
  { repo, sn, pipelineId, stageId }: GetBuildStageParams,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<GetBuildStageRes, GetBuildStageError>> {
  return await fetch.request<GetBuildStageRes, GetBuildStageError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/build/logs/stage/${sn}/${pipelineId}/${stageId}`,
    _apiTag: '/{repo}/-/build/logs/stage/{sn}/{pipelineId}/{stageId}',
    method: 'get'
  });
}
