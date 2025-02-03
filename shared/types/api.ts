import type { Nullable, Primitive } from './common';

export type UrlParams = Record<string, Nullable<Primitive> | Primitive[]>;

export type SortDirection = 'ASC' | 'DESC';

export type Sort = `${string}:${SortDirection}` | Array<`${string}:${SortDirection}`>;

export type Pagination = {
    page?: number;
    size?: number;
};

export type EntityResponse<T> = {
    entity: T | null;
};

export type EntityListResponse<T> = {
    data: T[];
    pagination: { page: number; pageSize: number; totalSize: number };
};
