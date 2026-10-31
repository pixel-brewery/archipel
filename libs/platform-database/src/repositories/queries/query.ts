// #region Imports

import { IRepositoryQuery } from './IRepositoryQuery.js';

// #endregion

/**
 * Creates a new repository query.
 *
 * @public
 * @param name - The name of the query.
 * @param run - The function that runs the query.
 * @returns The repository query.
 */
export function query<TDelegate, TResult>(name: string, run: (model: TDelegate) => Promise<TResult>): IRepositoryQuery<TDelegate, TResult> {
    return {
        name: name,
        run: run,
    };
}
