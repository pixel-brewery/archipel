// #region Imports

import { ITransactionalRepositoryQuery } from './ITransactionalRepositoryQuery.js';
import { Prisma } from '@prisma/client';

// #endregion

/**
 * Factory to create a transactional repository query.
 */
export function transactionalQuery<TResult>(name: string, run: (tx: Prisma.TransactionClient) => Promise<TResult>): ITransactionalRepositoryQuery<TResult> {
    return {
        name: name,
        run: run,
    };
}
