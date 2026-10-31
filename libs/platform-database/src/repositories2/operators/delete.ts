import { QueryOperator } from './QueryOperator.js';

interface IDeleteDelegate {
    delete: (args: unknown) => Promise<unknown>;
}

/**
 * Deletes a single record via the delegate `delete` method.
 *
 * @beta
 * @param args Prisma delete arguments
 */
export function remove<D extends IDeleteDelegate, A extends Parameters<D['delete']>[0]>(args: A): QueryOperator<D, ReturnType<D['delete']>> {
    return (delegate: D) => delegate.delete(args) as ReturnType<D['delete']>;
}
