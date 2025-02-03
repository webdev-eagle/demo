export type HttpMethod =
    | 'GET'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'PURGE'
    | 'LINK'
    | 'UNLINK'
    | 'get'
    | 'delete'
    | 'head'
    | 'options'
    | 'post'
    | 'put'
    | 'patch'
    | 'purge'
    | 'link'
    | 'unlink';

export type HttpResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export interface HttpRequestConfig {
    url?: string;
    method?: HttpMethod;
    baseURL?: string;
    headers?: any;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: any;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    responseType?: HttpResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: ((status: number) => boolean) | null;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    decompress?: boolean;
}

export interface HttpResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: HttpRequestConfig;
    request?: any;
}

export interface HttpClient {
    request<T = any, R = HttpResponse<T>>(config: HttpRequestConfig): Promise<R>;
    get<T = any, R = HttpResponse<T>>(url: string, config?: HttpRequestConfig): Promise<R>;
    delete<T = any, R = HttpResponse<T>>(url: string, config?: HttpRequestConfig): Promise<R>;
    head<T = any, R = HttpResponse<T>>(url: string, config?: HttpRequestConfig): Promise<R>;
    options<T = any, R = HttpResponse<T>>(url: string, config?: HttpRequestConfig): Promise<R>;
    post<T = any, R = HttpResponse<T>>(url: string, data?: any, config?: HttpRequestConfig): Promise<R>;
    put<T = any, R = HttpResponse<T>>(url: string, data?: any, config?: HttpRequestConfig): Promise<R>;
    patch<T = any, R = HttpResponse<T>>(url: string, data?: any, config?: HttpRequestConfig): Promise<R>;
}

export interface HttpServerResponse {
    status(code: number): this;
    sendStatus(code: number): this;
    send(body?: Record<string, any>): this;
    json(body?: Record<string, any>): this;
    contentType(type: string): this;
    header(field: any): this;
    header(field: string, value?: string | string[]): this;
    cookie(name: string, val: any): this;
    location(url: string): this;
    redirect(url: string): void;
    redirect(status: number, url: string): void;
    redirect(url: string, status: number): void;
}
