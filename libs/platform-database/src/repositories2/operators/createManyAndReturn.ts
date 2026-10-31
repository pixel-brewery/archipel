import { QueryOperator } from './QueryOperator.js';

interface ICreateManyAndReturnDelegate {
    createManyAndReturn: (args: unknown) => Promise<unknown>;
}

/**
 * Creates multiple records and returns them via the delegate `createManyAndReturn` method.
 *
 * **Provider support:** PostgreSQL, CockroachDB, SQLite only.
 *
 * @beta
 * @param args Prisma createManyAndReturn arguments
 */
export function createManyAndReturn<D extends ICreateManyAndReturnDelegate, A extends Parameters<D['createManyAndReturn']>[0]>(
    args: A,
): QueryOperator<D, ReturnType<D['createManyAndReturn']>> {
    return (delegate: D) => delegate.createManyAndReturn(args) as ReturnType<D['createManyAndReturn']>;
}
