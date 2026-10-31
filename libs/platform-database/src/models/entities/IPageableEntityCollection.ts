/**
 * Represents a paginated collection returned from a repository query.
 *
 * @internal
 */
export interface IPageableCollection<TEntity> {
    readonly items: Array<TEntity>;
    readonly total: number;
    readonly skip: number;
    readonly take?: number;
}

export function pageable<TEntity>(items: Array<TEntity>, total: number, skip: number, take?: number): IPageableCollection<TEntity> {
    return {
        items: items,
        total: total,
        skip: skip,
        take: take,
    };
}
