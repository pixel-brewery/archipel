import { QueryOperator } from './QueryOperator.js';

interface IUpdateManyDelegate {
    updateMany: (args: unknown) => Promise<unknown>;
}

/**
 * Updates multiple records via the delegate `updateMany` method.
 *
 * @beta
 * @param args Prisma updateMany arguments
 */
export function updateMany<D extends IUpdateManyDelegate, A extends Parameters<D['updateMany']>[0]>(args: A): QueryOperator<D, ReturnType<D['updateMany']>> {
    return (delegate: D) => delegate.updateMany(args) as ReturnType<D['updateMany']>;
}
