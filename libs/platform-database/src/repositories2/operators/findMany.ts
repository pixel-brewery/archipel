import { QueryOperator } from './QueryOperator.js';

/**
 * Finds many records via the delegate `findMany` method.
 *
 * @beta
 * @param args Prisma findMany arguments (optional)
 */
export function findMany<D extends { findMany: (...inner: unknown[]) => unknown }>(
    ...args: Parameters<D['findMany']>
): QueryOperator<D, ReturnType<D['findMany']>> {
    return (delegate: D) => delegate.findMany(...args) as ReturnType<D['findMany']>;
}
