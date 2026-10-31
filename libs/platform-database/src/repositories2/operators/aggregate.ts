import { QueryOperator } from './QueryOperator.js';

interface IAggregateDelegate {
    aggregate: (args: unknown) => Promise<unknown>;
}

/**
 * Executes an aggregate query via the delegate `aggregate` method.
 *
 * @beta
 * @param args Prisma aggregate arguments
 */
export function aggregate<D extends IAggregateDelegate, A extends Parameters<D['aggregate']>[0]>(args: A): QueryOperator<D, ReturnType<D['aggregate']>> {
    return (delegate: D) => delegate.aggregate(args) as ReturnType<D['aggregate']>;
}
