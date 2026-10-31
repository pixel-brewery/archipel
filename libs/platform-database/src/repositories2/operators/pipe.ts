import { QueryOperator } from './QueryOperator.js';

/**
 * Executes a single operator against the provided delegate.
 *
 * @beta
 * @template D - Concrete delegate type (e.g. Prisma.UserDelegate)
 * @template R - Result type produced by the operator
 */
export function pipe<D, R>(delegate: D, op: QueryOperator<D, R>): R {
    return op(delegate);
}

/**
 * Sequentially executes multiple operators. The last result is returned.
 * Useful for multi-step dependent operations.
 *
 * @beta
 * @template D - Concrete delegate type (e.g. Prisma.UserDelegate)
 * @template R - Result type produced by the operator
 */
export async function pipeAll<D, R>(delegate: D, ...ops: QueryOperator<D, unknown>[]): Promise<R> {
    let last: unknown;
    for (const op of ops) {
        // Support both sync and async operator returns
        last = await op(delegate as D);
    }
    return last as R;
}
