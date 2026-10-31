import { QueryOperator } from './QueryOperator.js';

/**
 * Finds a unique record via the delegate `findUnique` method.
 *
 * @beta
 * @param args Prisma findUnique arguments
 */
export function findUnique<D extends { findUnique: (...inner: unknown[]) => unknown }>(
    ...args: Parameters<D['findUnique']>
): QueryOperator<D, ReturnType<D['findUnique']>> {
    return (delegate: D) => delegate.findUnique(...args) as ReturnType<D['findUnique']>;
}
