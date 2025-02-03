export type PaginationInfo = {
    page: number;
    pageSize: number;
    totalSize: number;
};

export type Paged<E> = {
    data: E[];
    pagination: PaginationInfo;
};
