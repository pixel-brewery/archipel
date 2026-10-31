import { QueryOperator } from './QueryOperator.js';

interface IFindRawDelegate {
    findRaw: (args?: unknown) => Promise<unknown>;
}

/**
 * Executes a raw find query via the delegate `findRaw` method.
 *
 * **Provider support:** MongoDB only.
 *
 * @beta
 * @param args Prisma findRaw arguments (optional)
 */
export function findRaw<D extends IFindRawDelegate>(...args: Parameters<D['findRaw']>): QueryOperator<D, ReturnType<D['findRaw']>> {
    return (delegate: D) => delegate.findRaw(...args) as ReturnType<D['findRaw']>;
}
