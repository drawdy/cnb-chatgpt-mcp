import type { AxiosResponse, AxiosRequestConfig, CreateAxiosDefaults } from 'axios';

/**
 *  @description 创建CnbRequest对象时的配置类型，
 *  在axios默认类型的基础上补充了onError
 */
export interface CnbCreateRequestConfig extends CreateAxiosDefaults {
  onError?: (error: CnbResponseError) => void;
}

/**
 *  @description CnbRequest在调用request方法的配置类型，
 *  在AxiosRequestConfig的基础上，增加了ExtralAxiosRequestConfig进行补充
 */
export type CnbRequestConfig<
  DataType = any,
  ExtendsOptionsType extends { [key: string]: any } = {}
> = AxiosRequestConfig<DataType> & ExtralAxiosRequestConfig<ExtendsOptionsType>;

/**
 * @description CnbRequest在调用request方法的补充配置类型
 * @param _next_req 请求头
 * @param options.onError 用于处理请求报错
 *        null表示不使用
 *        undefiedn表示使用默认的CnbCreatRequstConfig.onErro
 *        非空值表示使用当前传入值
 */
export interface ExtralAxiosRequestConfig<ExtendsOptionsType extends {} = {}> {
  _apiTag: string; // 用于标记主调模块
  options?: {
    formatResponse?: <T>(result: CnbRequestResult<T>, res?: AxiosResponse | null) => CnbRequestResult<T>;
    onError?: null | ((error: CnbResponseError) => void);
  } & ExtendsOptionsType;
}

/**
 * @description CnbRuest返回对象类型
 */
export type CnbRequestResult<T = any, E = any> =
  | {
      status?: number;
      result: T | null;
      headers?: { [key: string]: string };
      error: null;
    }
  | {
      status?: number; // status 不是 200 或者没定义的情况
      result: E | null;
      headers?: { [key: string]: string };
      error: CnbResponseError;
    };
/**
 * @description CnbRuest返回的错误对象类型
 */
export interface CnbResponseError {
  code: ResponseError['errcode'];
  message: ResponseError['errmsg'];
  param?: ResponseError['errparam'];
  status?: number;
}

/**
 * @description 后端API返回的错误对象类型
 */
export interface ResponseError {
  errcode: number;
  errmsg: string;
  errparam?: any;
}

export type CnbRequestOptions = NonNullable<CnbRequestConfig['options']>;
