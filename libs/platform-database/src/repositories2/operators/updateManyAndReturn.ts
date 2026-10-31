import { QueryOperator } from './QueryOperator.js';

interface IUpdateManyAndReturnDelegate {
    updateManyAndReturn: (args: unknown) => Promise<unknown>;
}

/**
 * Updates multiple records and returns them via the delegate `updateManyAndReturn` method.
 *
 * **Provider support:** PostgreSQL, CockroachDB, SQLite only.
 *
 * @beta
 * @param args Prisma updateManyAndReturn arguments
 */
export function updateManyAndReturn<D extends IUpdateManyAndReturnDelegate, A extends Parameters<D['updateManyAndReturn']>[0]>(
    args: A,
): QueryOperator<D, ReturnType<D['updateManyAndReturn']>> {
    return (delegate: D) => delegate.updateManyAndReturn(args) as ReturnType<D['updateManyAndReturn']>;
}
