import { QueryOperator } from './QueryOperator.js';

interface ICreateDelegate {
    create: (args: unknown) => Promise<unknown>;
}

/**
 * Creates a record using the underlying delegate `create` method.
 *
 * @beta
 * @param args Prisma create arguments
 */
export function create<D extends ICreateDelegate, A extends Parameters<D['create']>[0]>(args: A): QueryOperator<D, ReturnType<D['create']>> {
    return (delegate: D) => delegate.create(args) as ReturnType<D['create']>;
}
