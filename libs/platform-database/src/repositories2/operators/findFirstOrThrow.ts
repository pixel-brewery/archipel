import { QueryOperator } from './QueryOperator.js';

interface IFindFirstOrThrowDelegate {
    findFirstOrThrow: (args: unknown) => Promise<unknown>;
}

/**
 * Finds the first record matching the criteria via the delegate `findFirstOrThrow` method.
 * Throws a `PrismaClientKnownRequestError` with code `P2025` if no record is found.
 *
 * @beta
 * @param args Prisma findFirstOrThrow arguments
 */
export function findFirstOrThrow<D extends IFindFirstOrThrowDelegate, A extends Parameters<D['findFirstOrThrow']>[0]>(
    args: A,
): QueryOperator<D, ReturnType<D['findFirstOrThrow']>> {
    return (delegate: D) => delegate.findFirstOrThrow(args) as ReturnType<D['findFirstOrThrow']>;
}
