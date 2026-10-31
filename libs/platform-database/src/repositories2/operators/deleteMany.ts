import { QueryOperator } from './QueryOperator.js';

interface IDeleteManyDelegate {
    deleteMany: (args: unknown) => Promise<unknown>;
}

/**
 * Deletes multiple records via the delegate `deleteMany` method.
 *
 * @beta
 * @param args Prisma deleteMany arguments
 */
export function removeMany<D extends IDeleteManyDelegate, A extends Parameters<D['deleteMany']>[0]>(args: A): QueryOperator<D, ReturnType<D['deleteMany']>> {
    return (delegate: D) => delegate.deleteMany(args) as ReturnType<D['deleteMany']>;
}
