import { IPaginateOptions, paginator } from '../../features/Pagination.js';
import { QueryOperator } from './QueryOperator.js';

interface IFindManyDelegate {
    findMany: (args?: unknown) => Promise<unknown>;
}

/**
 * Finds many records with pagination using the delegate `findMany` method.
 *
 * @beta
 * @param page Pagination configuration
 * @param args Prisma findMany arguments (optional)
 */
export function findManyPaged<D extends IFindManyDelegate, A extends Parameters<D['findMany']>[0]>(
    page: Required<IPaginateOptions>,
    args?: A,
): QueryOperator<D, unknown> {
    return (delegate: D) =>
        paginator({
            page: page.page,
            perPage: page.perPage,
        })(delegate as unknown as IFindManyDelegate, args as unknown);
}
