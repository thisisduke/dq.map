/**
 * 封装请求
 * @param：{method}     String      请求类型，必填
 * @param：{url}        String      请求地址，必填
 * @param：{params}     Object      参数参数，非必填
 * @returns：Promise {<pending>}
 **/

import { Method } from "axios";
import { walkUpBindingElementsAndPatterns } from "typescript";
import axios from './axios'
// 定义接口
interface PendingType {
  url: string | undefined;
  method: Method | undefined;
  params?: Record<string, unknown> | string;
}


const baseURL: string = '/api/data_service_map'; //默认路径

export const send = (value:PendingType) => {

    return axios({
        method: value.method,
        url: baseURL + value.url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: value.params,
    }).then(res => res.data);
};
