import { API_PRIVATE_RESPONSE_HEADER_PREFIX } from '../../../constants/header';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import type {
  CnbCreateRequestConfig,
  CnbRequestConfig,
  CnbRequestResult,
  CnbResponseError,
  ResponseError
} from './types';

export const CNB_AXIOS_ERROR_CODE = -1;
export const CNB_AXIOS_CANCEL_ERROR_CODE = -2;

export class CnbRequest<ExtendsOptionsType extends {} = {}> {
  axiosInstance: AxiosInstance;
  config: CnbCreateRequestConfig;
  reduxStore: any;
  constructor(config: CnbCreateRequestConfig) {
    this.axiosInstance = axios.create(config);
    this.config = config;
  }

  public formatResponse(res: AxiosResponse | null, error: AxiosError | null): CnbRequestResult {
    let status: undefined | number = res?.status;
    let resultData: CnbRequestResult<any>['result'] = null;
    let resultError: CnbResponseError | null = null;
    const headers: { [key in string]: string } = {};
    const responseHeader = res?.headers || error?.response?.headers || {};
    // 根据约定响应头返回响应头数据
    if (responseHeader) {
      const regexp = new RegExp(`${API_PRIVATE_RESPONSE_HEADER_PREFIX}(-.+)+`);
      const headerKeys = Object.keys(responseHeader);

      for (const key of headerKeys) {
        if (regexp.test(key) === true) {
          headers[key] = responseHeader[key] as string;
        }
      }
    }

    const formatError = (status: number, errData: ResponseError) => {
      resultData = null;
      resultError = {
        code: errData.errcode,
        message: errData.errmsg || 'unknown error',
        param: errData.errparam || null,
        status
      };
    };

    if (error) {
      const axiosError = error;
      const isAxiosError = 'response' in axiosError;
      if (!isAxiosError) {
        const errorObj = {
          code: error?.code === 'ERR_CANCELED' ? CNB_AXIOS_CANCEL_ERROR_CODE : CNB_AXIOS_ERROR_CODE,
          message: (error as Error).message || 'unknown error',
          status: error?.status
        };
        const { config: _, request, ...restErrorInfo } = error;
        const errorPrototype = {};
        // 在原型对象上定义_error属性，用于存储原始错误的详细信息
        Object.defineProperty(errorPrototype, '_error', {
          value: restErrorInfo,
          enumerable: true,
          configurable: true
        });
        const newError = Object.assign(Object.create(errorPrototype), errorObj);
        const errorResponse = {
          status,
          result: null,
          error: newError,
          headers
        };
        return errorResponse;
      }

      status = error.response!.status;
      formatError(status, axiosError.response!.data as ResponseError);
    }

    // 基于webapi统一返回进行处理
    if (res?.data?.errcode !== undefined) {
      formatError(res.status, res.data);
    } else {
      resultData = res ? res.data : null;
    }

    return { status, result: resultData, error: resultError, headers };
  }

  public async request<T = any, _E = any>(
    config: CnbRequestConfig<any, ExtendsOptionsType>
  ): Promise<CnbRequestResult<T, _E>> {
    const format = config.options?.formatResponse;
    let result: CnbRequestResult<T, _E>;
    try {
      const res = await this.axiosInstance.request(config);
      result = this.formatResponse(res, null);
      if (typeof format === 'function') {
        result = format(result, res);
      }
    } catch (err) {
      result = this.formatResponse(null, err as AxiosError);
      if (typeof format === 'function') {
        result = format(result, (err as AxiosError).response);
      }
    }
    if (result.error) {
      const { onError = this.config.onError } = config.options || {};
      if (onError !== null && typeof onError === 'function') {
        onError?.(result.error);
      }
    }
    return result;
  }
}

export * from './types';
