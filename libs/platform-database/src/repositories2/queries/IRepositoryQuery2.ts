/**
 * Represents a reusable query definition for repositories.
 *
 * @public
 * @template TDelegate - The Prisma delegate type.
 * @template TResult - The query result type.
 */
export interface IRepositoryQuery2<TDelegate, TRun extends (delegate: TDelegate) => any = (delegate: TDelegate) => any> {
    // #region Properties

    /**
     * The identifier used for logging.
     */
    readonly name: string;

    // #endregion

    // #region Methods

    /**
     * Executes the query against the provided model.
     */
    run: TRun;

    // #endregion
}
