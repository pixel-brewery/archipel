// #region Imports

import { Prisma } from '@prisma/client';

// #endregion

/**
 * Represents a repository query that requires a Prisma TransactionClient to access multiple delegates.
 *
 * @public
 */
export interface ITransactionalRepositoryQuery<TResult> {
    // #region Properties

    /** Identifier used for logging. */
    readonly name: string;

    // #endregion

    // #region Methods

    /**
     * Executes the query with an active transaction client.
     *
     * @param tx - Prisma transaction client.
     */
    run(tx: Prisma.TransactionClient): Promise<TResult>;

    // #endregion
}

/**
 * Extracts the result type from a transactional repository query.
 *
 * @example
 * ```typescript
 * type ConversationResult = TransactionalQueryResultType<ReturnType<typeof createConversationQuery>>;
 * ```
 *
 * @public
 * @template T - The transactional repository query type.
 */
export type TransactionalQueryResultType<T> = T extends ITransactionalRepositoryQuery<infer R> ? R : never;
