import { QueryOperator } from './QueryOperator.js';

interface IGroupByDelegate {
    groupBy: (args: unknown) => Promise<unknown>;
}

/**
 * Performs a group-by query via the delegate `groupBy` method.
 *
 * @beta
 * @param args Prisma groupBy arguments
 */
export function groupBy<D extends IGroupByDelegate, A extends Parameters<D['groupBy']>[0]>(args: A): QueryOperator<D, ReturnType<D['groupBy']>> {
    return (delegate: D) => delegate.groupBy(args) as ReturnType<D['groupBy']>;
}
