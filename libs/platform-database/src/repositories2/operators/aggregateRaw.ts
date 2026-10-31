import { QueryOperator } from './QueryOperator.js';

interface IAggregateRawDelegate {
    aggregateRaw: (args?: unknown) => Promise<unknown>;
}

/**
 * Executes a raw aggregate query via the delegate `aggregateRaw` method.
 *
 * **Provider support:** MongoDB only.
 *
 * @beta
 * @param args Prisma aggregateRaw arguments (optional)
 */
export function aggregateRaw<D extends IAggregateRawDelegate>(...args: Parameters<D['aggregateRaw']>): QueryOperator<D, ReturnType<D['aggregateRaw']>> {
    return (delegate: D) => delegate.aggregateRaw(...args) as ReturnType<D['aggregateRaw']>;
}
