/**
 * Represents the result of a cursor-paginated query.
 *
 * @public
 */
export interface ICursorPaginatedResult<T> {
    data: Array<T>;
    meta: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string | null;
        endCursor: string | null;
    };
}

/**
 * Options for cursor-based pagination.
 *
 * @public
 */
export interface ICursorPaginateOptions {
    cursor?: string;
    take?: number;
    direction?: 'forward' | 'backward';
}

/**
 * The type of a cursor paginate function.
 *
 * @public
 */
export type CursorPaginateFunction = <T extends { id: string }, K>(
    model: unknown,
    args?: K,
    options?: ICursorPaginateOptions,
) => Promise<ICursorPaginatedResult<T>>;

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/**
 * Creates a cursor-based pagination function with the given default options.
 *
 * @public
 * @param defaultOptions - Default cursor pagination options.
 * @returns A function that paginates using cursor-based strategy.
 */

export const cursorPaginator =
    (defaultOptions: ICursorPaginateOptions): CursorPaginateFunction =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (model: any, args: any = { where: undefined }, options?: ICursorPaginateOptions) => {
        const take = Math.min(Number(options?.take ?? defaultOptions.take ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
        const cursor = options?.cursor ?? defaultOptions.cursor;
        const direction = options?.direction ?? defaultOptions.direction ?? 'forward';
        const isForward = direction === 'forward';

        const queryArgs: Record<string, unknown> = {
            ...args,
            take: isForward ? take + 1 : -(take + 1),
            orderBy: args['orderBy'] ?? { id: 'asc' },
        };

        if (cursor) {
            queryArgs['cursor'] = { id: cursor };
            queryArgs['skip'] = 1;
        }

        const results = await model.findMany(queryArgs);
        const hasExtra = results.length > take;
        const data = hasExtra ? (isForward ? results.slice(0, take) : results.slice(1)) : results;

        const startCursor = data.length > 0 ? data[0].id : null;
        const endCursor = data.length > 0 ? data[data.length - 1].id : null;

        return {
            data,
            meta: {
                hasNextPage: isForward ? hasExtra : !!cursor,
                hasPreviousPage: isForward ? !!cursor : hasExtra,
                startCursor,
                endCursor,
            },
        };
    };
