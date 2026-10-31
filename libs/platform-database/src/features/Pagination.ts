export interface IPaginatedResult<T> {
    data: Array<T>;
    meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
    };
}

export interface IPaginateOptions {
    page?: number | string;
    perPage?: number | string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginateFunction = <T, K>(model: any, args?: K, options?: IPaginateOptions) => Promise<IPaginatedResult<T>>;

export const paginator =
    (defaultOptions: IPaginateOptions): PaginateFunction =>
    async (model, args: any = { where: undefined }, options) => {
        const page = Number(options?.page ?? defaultOptions.page) || 1;
        const perPage = Number(options?.perPage ?? defaultOptions.perPage) || 10;

        const skip = page > 0 ? perPage * (page - 1) : 0;
        const [total, data] = await Promise.all([
            model.count({ where: args.where }),
            model.findMany({
                ...args,
                take: perPage,
                skip,
            }),
        ]);
        const lastPage = Math.ceil(total / perPage);

        return {
            data,
            meta: {
                total,
                lastPage,
                currentPage: page,
                perPage,
                prev: page > 1 ? page - 1 : null,
                next: page < lastPage ? page + 1 : null,
            },
        };
    };
