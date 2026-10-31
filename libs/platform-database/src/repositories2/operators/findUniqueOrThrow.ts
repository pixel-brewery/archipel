import { QueryOperator } from './QueryOperator.js';

interface IFindUniqueOrThrowDelegate {
    findUniqueOrThrow: (args: unknown) => Promise<unknown>;
}

/**
 * Finds a unique record via the delegate `findUniqueOrThrow` method.
 * Throws a `PrismaClientKnownRequestError` with code `P2025` if no record is found.
 *
 * @beta
 * @param args Prisma findUniqueOrThrow arguments
 */
export function findUniqueOrThrow<D extends IFindUniqueOrThrowDelegate, A extends Parameters<D['findUniqueOrThrow']>[0]>(
    args: A,
): QueryOperator<D, ReturnType<D['findUniqueOrThrow']>> {
    return (delegate: D) => delegate.findUniqueOrThrow(args) as ReturnType<D['findUniqueOrThrow']>;
}
