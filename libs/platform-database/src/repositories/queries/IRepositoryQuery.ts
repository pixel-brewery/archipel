/**
 * Represents a reusable query definition for repositories.
 *
 * @public
 * @template TDelegate - The Prisma delegate type.
 * @template TResult - The query result type.
 */
export interface IRepositoryQuery<TDelegate, TResult> {
    // #region Properties

    /**
     * The identifier used for logging.
     */
    readonly name: string;

    // #endregion

    // #region Methods

    /**
     * Executes the query against the provided model.
     *
     * @param model - The Prisma delegate.
     */
    run(model: TDelegate): Promise<TResult>;

    // #endregion
}

/**
 * Extracts the result type from a repository query.
 * Useful for type-safe mapping without duplicating query result types.
 *
 * @example
 * ```typescript
 * type UserProfileResult = QueryResultType<ReturnType<typeof createUserProfileQuery>>;
 * ```
 *
 * @public
 * @template T - The repository query type.
 */
export type QueryResultType<T> = T extends IRepositoryQuery<unknown, infer R> ? R : never;
