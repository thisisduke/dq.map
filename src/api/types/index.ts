export * from './basic';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export interface AxiosRequest {
    baseURL?: string;
    url: string;
    data?: Record<string, unknown>;
    params?: Record<string, unknown>;
    method?: Method;
    headers?: Record<string, unknown>;
    timeout?: number;
    responseType?: ResponseType;
}

export interface AxiosResponse {
    data: any;
    headers: Record<string, unknown>;
    request?: Record<string, unknown>;
    status: number;
    statusText: string;
    config: AxiosRequest;
}

export interface CustomResponse {
    readonly status: boolean;
    readonly message: string;
    data: any;
    origin?: any;
}
