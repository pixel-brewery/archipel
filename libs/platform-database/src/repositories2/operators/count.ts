import { QueryOperator } from './QueryOperator.js';

interface ICountDelegate {
    count: (args: unknown) => Promise<unknown>;
}

/**
 * Counts records via the delegate `count` method.
 *
 * @beta
 * @param args Prisma count arguments
 */
export function count<D extends ICountDelegate, A extends Parameters<D['count']>[0]>(args: A): QueryOperator<D, ReturnType<D['count']>> {
    return (delegate: D) => delegate.count(args) as ReturnType<D['count']>;
}
