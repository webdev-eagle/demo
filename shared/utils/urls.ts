import type { UrlParams } from '../types';
import { isEmpty } from './asserts';

export const queryString = (params: UrlParams): string => {
    const searchParam = new URLSearchParams();

    Object.entries(params).forEach(([key, param]) => {
        if (param == null) {
            return;
        }
        if (Array.isArray(param)) {
            return param.forEach((p) => searchParam.append(key, p.toString()));
        }
        searchParam.set(key, param.toString());
    });

    return searchParam.toString();
};

export const urlString = (origin: string, params?: UrlParams, tags?: string) => {
    const anchor = tags ? `#${tags}` : '';

    return !isEmpty(params) ? `${origin}?${queryString(params)}${anchor}` : `${origin}${anchor}`;
};

export const sortString = (fields: Record<string, 'ASC' | 'DESC'>): string =>
    Object.entries(fields)
        .map(([field, direction]) => `${field}:${direction}`)
        .join(',');

const getUrlWithTimeStamp = (extention: string) => {
    return (name: string): string => {
        return `${name}.${extention}?${new Date().getTime()}`;
    };
};

export const getUrlToSVGWithTimeStamp = getUrlWithTimeStamp('svg');

export const getUrlToPNGithTimeStamp = getUrlWithTimeStamp('png');
