import { CnbRequestConfig } from './cnb/types';

/** 前端web项目request的options类型 */
export type CnbRequestOptions = NonNullable<CnbRequestConfig['options']>;

/** CnbRequestParams 类型 */
export type CnbRequestParams<D extends {} = {}> = { data: D } & Pick<CnbRequestConfig, 'options' | 'timeout'> & {
    options?: CnbRequestOptions;
  };
