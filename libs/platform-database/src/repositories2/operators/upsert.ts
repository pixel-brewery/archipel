import { QueryOperator } from './QueryOperator.js';

interface IUpsertDelegate {
    upsert: (args: unknown) => Promise<unknown>;
}

/**
 * Creates or updates a record via the delegate `upsert` method.
 *
 * @beta
 * @param args Prisma upsert arguments
 */
export function upsert<D extends IUpsertDelegate, A extends Parameters<D['upsert']>[0]>(args: A): QueryOperator<D, ReturnType<D['upsert']>> {
    return (delegate: D) => delegate.upsert(args) as ReturnType<D['upsert']>;
}
