import { QueryOperator } from './QueryOperator.js';

interface ICreateManyDelegate {
    createMany: (args: unknown) => Promise<unknown>;
}

/**
 * Creates multiple records via the delegate `createMany` method.
 *
 * @beta
 * @param args Prisma createMany arguments
 */
export function createMany<D extends ICreateManyDelegate, A extends Parameters<D['createMany']>[0]>(args: A): QueryOperator<D, ReturnType<D['createMany']>> {
    return (delegate: D) => delegate.createMany(args) as ReturnType<D['createMany']>;
}
