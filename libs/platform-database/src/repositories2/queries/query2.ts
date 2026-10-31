// #region Imports

import { IRepositoryQuery2 } from './IRepositoryQuery2.js';

// #endregion

/**
 * Creates a new repository query.
 *
 * @public
 * @param name - The name of the query.
 * @param run - The function that runs the query.
 * @returns The repository query.
 */
export function query2<TDelegate, TRun extends (delegate: TDelegate) => TResult, TResult>(name: string, run: TRun): IRepositoryQuery2<TDelegate, TRun> {
    return {
        name: name,
        run: run,
    };
}
