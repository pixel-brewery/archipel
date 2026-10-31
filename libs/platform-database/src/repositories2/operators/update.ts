import { QueryOperator } from './QueryOperator.js';

interface IUpdateDelegate {
    update: (args: unknown) => Promise<unknown>;
}

/**
 * Updates a single record via the delegate `update` method.
 *
 * @beta
 * @param args Prisma update arguments
 */
export function update<D extends IUpdateDelegate, A extends Parameters<D['update']>[0]>(args: A): QueryOperator<D, ReturnType<D['update']>> {
    return (delegate: D) => delegate.update(args) as ReturnType<D['update']>;
}
