// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/*
 * -------------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA CNB-API-GENERATE                        ##
 * -------------------------------------------------------------------------
 * @Version 1.5.0
 * @Source /{repo}/-/build/logs
 */

import type { IncomingMessage } from 'http';
import fetch from '../../helpers/request';
import { CnbRequestOptions, CnbRequestResult } from '../../helpers/request/cnb';
import { AxiosRequestConfig } from 'axios';
import { DtoBuildLogsResult } from '../interfaces/dto.buildlogsresult';

/**
 * @description getBuildLogs request params
 */
export interface GetBuildLogsParams {
  /**
   * @description Repo path
   */
  repo: string;

  /**
   * @description Start date in "YYYY-MM-DD" format, e.g. "2024-12-01"
   */
  createTime?: string;

  /**
   * @description End date in "YYYY-MM-DD" format, e.g. "2024-12-01"
   */
  endTime?: string;

  /**
   * @description Event name, e.g. "push"
   */
  event?: string;

  /**
   * @description Pagination page number, default(1)
   */
  page?: number;

  /**
   * @description Pagination page size, default(30), max(100)
   */
  pagesize?: number;

  /**
   * @description Commit ID, e.g. "2221d4535ec0c921bcd0858627c5025a871dd2b5"
   */
  sha?: string;

  /**
   * @description Build SN, e.g. "cnb-1qa-1i3f5ecau
   */
  sn?: string;

  /**
   * @description Source branch name, e.g. "dev"
   */
  sourceRef?: string;

  /**
   * @description Build status: "pending", "success", "error", "cancel"
   */
  status?: string;

  /**
   * @description Target branch name, e.g. "main"
   */
  targetRef?: string;

  /**
   * @description User ID
   */
  userId?: string;

  /**
   * @description Username
   */
  userName?: string;
}

/**
 * @description Other reuqest params
 */
type RequestConfig<DataType = any> = AxiosRequestConfig<DataType> & {
  options?: CnbRequestOptions;
  req?: IncomingMessage;
};

/**
 * @description GetBuildLogsRes Success Response Type
 */
export type GetBuildLogsRes = DtoBuildLogsResult;

/**
 * @description GetBuildLogsError Error Response Type
 */
export type GetBuildLogsError = unknown;

/**
* @description 访问令牌调用此接口需包含以下权限。Required permissions for access token. 
* repo-cnb-trigger:r
* @tags Build
* @name getBuildLogs
* @summary 查询流水线构建列表。List pipeline builds.
* @request get:/{repo}/-/build/logs

----------------------------------
* @param {GetBuildLogsParams} arg0 - getBuildLogs request params
* @param {RequestConfig} arg1 - Other reuqest params
*/
export async function getBuildLogs(
  { repo, ...query }: GetBuildLogsParams,
  { req, options, ...axiosConfig }: RequestConfig = {}
): Promise<CnbRequestResult<GetBuildLogsRes, GetBuildLogsError>> {
  return await fetch.request<GetBuildLogsRes, GetBuildLogsError>({
    ...axiosConfig,
    _next_req: req,
    options: options,
    url: `/${repo}/-/build/logs`,
    _apiTag: '/{repo}/-/build/logs',
    method: 'get',
    params: query
  });
}
