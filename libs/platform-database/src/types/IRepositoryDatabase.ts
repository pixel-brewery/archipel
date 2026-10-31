// #region Imports

import type { Prisma } from '@prisma/client';

// #endregion

/**
 * Minimal database contract required by {@link RepositoryBase}.
 *
 * @remarks
 * Applications can provide their own Prisma client wrapper without extending
 * {@link DatabaseService}. The implementation only needs to expose callback
 * transactions with Prisma's transaction client.
 *
 * @public
 */
export interface IRepositoryDatabase {
    /**
     * Executes a callback in a Prisma transaction.
     *
     * @param callback - Work to execute with the active transaction client.
     * @returns The callback result.
     */
    transactionCallback<TResult>(callback: (transaction: Prisma.TransactionClient) => Promise<TResult>): Promise<TResult>;
}
