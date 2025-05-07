interface Sort {
    unsorted: boolean,
    sorted: boolean,
    empty: boolean
}

type Paginated<T> = {
    content: T[],
    pageable: {
        pageNumber: number,
        pageSize: number,
        sort: Sort
        offset: number,
        unpaged: boolean,
        paged: boolean
    },
    totalPages: number,
    totalElements: number,
    last: boolean,
    size: number,
    number: number,
    sort: Sort
    first: boolean,
    numberOfElements: number,
    empty: boolean
}

export { type Sort, type Paginated };