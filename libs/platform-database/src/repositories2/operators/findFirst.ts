import { QueryOperator } from './QueryOperator.js';

interface IFindFirstDelegate {
    findFirst: (args: unknown) => Promise<unknown>;
}

/**
 * Creates an operator that executes a `findFirst` query with the provided arguments.
 *
 * @beta
 * @param args Prisma findFirst arguments
 * @returns Operator yielding the record or null
 */
export function findFirst<D extends IFindFirstDelegate, A extends Parameters<D['findFirst']>[0]>(args: A): QueryOperator<D, ReturnType<D['findFirst']>> {
    return (delegate: D) => delegate.findFirst(args) as ReturnType<D['findFirst']>;
}
