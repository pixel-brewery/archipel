import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IPaginateOptions, paginator } from '../../features/Pagination.js';
import { RepositoryError } from '../../models/errors/RepositoryError.js';
import { IRepositoryDatabase } from '../../types/IRepositoryDatabase.js';
import { maskSensitive } from '../../utils/maskSensitive.js';
import { getRepositoryErrorKind } from '../failures/getRepositoryErrorKind.js';
import { isKnownPrismaFailure, isUnknownPrismaFailure } from '../failures/prismaFailure.js';
import { IRepositoryQuery } from '../queries/IRepositoryQuery.js';
import { ITransactionalRepositoryQuery } from '../queries/ITransactionalRepositoryQuery.js';

/**
 * Superset of all known Prisma model delegate operations across every supported database provider.
 *
 * @public
 */
export type RepositoryOperationsAll = RepositoryOperationsBase | 'createManyAndReturn' | 'updateManyAndReturn' | 'findRaw' | 'aggregateRaw';

/**
 * The baseline set of operations available on **every** Prisma provider
 * (PostgreSQL, CockroachDB, SQLite, MySQL, MariaDB, SQL Server, MongoDB).
 *
 * Provider-specific extras (e.g. `createManyAndReturn` on PostgreSQL) are
 * deliberately excluded so that consumers targeting any provider satisfy
 * the constraint automatically.
 *
 * @public
 */
export type RepositoryOperationsBase =
    | 'aggregate'
    | 'count'
    | 'create'
    | 'createMany'
    | 'delete'
    | 'deleteMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'findMany'
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'groupBy'
    | 'update'
    | 'updateMany'
    | 'upsert';

/**
 * Extracts the subset of known Prisma operations that a concrete delegate actually implements.
 * Useful for type-level checks without requiring the consumer to state the provider explicitly.
 *
 * @public
 * @example
 * ```typescript
 * // On PostgreSQL: 'findUnique' | ... | 'createManyAndReturn' | 'updateManyAndReturn'
 * // On SQL Server: 'findUnique' | ... (15 base ops only)
 * type Ops = DelegateOperations<Prisma.TaskDelegate>;
 * ```
 */
export type DelegateOperations<TDelegate> = Extract<RepositoryOperationsAll, keyof TDelegate>;

/**
 * The base class for all repositories.
 *
 * @public
 * @abstract
 */
export abstract class RepositoryBase<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TDelegate extends Record<RepositoryOperationsBase, (args: any) => Promise<any>>,
    TArgs extends Record<RepositoryOperationsBase, unknown>,
    TReturn extends Record<RepositoryOperationsBase, unknown>,
    TEntity = unknown,
> {
    // #region Fields

    private readonly _db: IRepositoryDatabase;

    private readonly _model: TDelegate;

    private readonly _logger = new Logger(RepositoryBase.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the repository.
     *
     * @remarks
     * The `model` parameter accepts any Prisma delegate that structurally satisfies
     * the required operations. This wider signature avoids `GlobalOmitOptions`
     * mismatches introduced in Prisma 7 where `PrismaClient` instantiates delegates
     * with `PrismaClientOptions` while consumer code references them with the
     * default `{}`.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(db: IRepositoryDatabase, model: Record<RepositoryOperationsBase, (args: any) => Promise<any>>) {
        this._db = db;
        this._model = model as TDelegate;
    }

    // #endregion

    // #region Properties

    /**
     * @protected
     * @readonly
     */
    protected get model(): TDelegate {
        return this._model;
    }

    /**
     * Provides access to the database transaction abstract base for derived repositories.
     * Only to be used for transactional orchestration that spans multiple models.
     *
     * @protected
     */
    protected get database(): IRepositoryDatabase {
        return this._db;
    }

    // #endregion

    // #region Methods

    /**
     * Executes a predefined query against the underlying model.
     *
     * @public
     * @param query - The query definition to execute.
     * @returns The query result.
     */
    public execute<TResult>(query: IRepositoryQuery<TDelegate, TResult>): Promise<TResult> {
        this._logger.debug(`Executing query: ${query.name}`);
        return this.tryCatch(query.run(this._model));
    }

    /**
     * Executes a transactional query providing a Prisma TransactionClient for multi-model work.
     *
     * @public
     * @param query - The transactional query definition to execute.
     * @returns The query result.
     */
    public executeTransactional<TResult>(query: ITransactionalRepositoryQuery<TResult>): Promise<TResult> {
        this._logger.debug(`Executing transactional query: ${query.name}`);
        return this.tryCatch(this._db.transactionCallback(async (tx: Prisma.TransactionClient) => query.run(tx)));
    }

    /**
     * Finds a unique record by its identifier.
     *
     * @protected
     * @param args - The arguments to find the unique record.
     * @returns The found record or null if not found.
     */
    protected findUnique<TResult = TReturn['findUnique']>(args: TArgs['findUnique']): Promise<TResult> {
        this._logger.debug(`Finding unique record: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.findUnique(args));
    }

    /**
     * Finds a unique record by its identifier or throws if not found.
     *
     * @protected
     * @param args - The arguments to find the unique record.
     * @returns The found record.
     * @throws PrismaClientKnownRequestError with code P2025 if the record does not exist.
     */
    protected findUniqueOrThrow<TResult = TReturn['findUniqueOrThrow']>(args: TArgs['findUniqueOrThrow']): Promise<TResult> {
        this._logger.debug(`Finding unique record or throw: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.findUniqueOrThrow(args));
    }

    /**
     * Finds multiple records with optional pagination.
     *
     * @public
     * @param args - The arguments to find the records.
     * @param page - The pagination options.
     * @returns The found records.
     */
    protected findMany<TResult = TReturn['findMany']>(args?: TArgs['findMany'], page?: Required<IPaginateOptions>): Promise<TResult> {
        this._logger.debug(`Finding many records: ${maskSensitive(args)}`);
        return this.tryCatch(
            page
                ? paginator({
                      page: page.page,
                      perPage: page.perPage,
                  })(this._model, args)
                : this._model.findMany(args),
        );
    }

    /**
     * Finds the first record that matches the criteria.
     *
     * @protected
     * @param args - The arguments to find the first record.
     * @returns The found record or null if not found.
     */
    protected findFirst<TResult = TReturn['findFirst']>(args: TArgs['findFirst']): Promise<TResult> {
        this._logger.debug(`Finding first record: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.findFirst(args));
    }

    /**
     * Finds the first record that matches the criteria or throws if not found.
     *
     * @protected
     * @param args - The arguments to find the first record.
     * @returns The found record.
     * @throws PrismaClientKnownRequestError with code P2025 if no record matches.
     */
    protected findFirstOrThrow<TResult = TReturn['findFirstOrThrow']>(args: TArgs['findFirstOrThrow']): Promise<TResult> {
        this._logger.debug(`Finding first record or throw: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.findFirstOrThrow(args));
    }

    /**
     * Creates a new record.
     *
     * @protected
     * @param args - The arguments to create the record.
     * @returns The created record.
     */
    protected create<TResult = TReturn['create']>(args: TArgs['create']): Promise<TResult> {
        this._logger.debug(`Creating record: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.create(args));
    }

    /**
     * Creates multiple records.
     *
     * @protected
     * @param args - The arguments to create the records.
     * @returns The created records.
     */
    protected createMany<TResult = TReturn['createMany']>(args: TArgs['createMany']): Promise<TResult> {
        this._logger.debug(`Creating many records: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.createMany(args));
    }

    /**
     * Updates an existing record.
     *
     * @protected
     * @param args - The arguments to update the record.
     * @returns The updated record.
     */
    protected update<TResult = TReturn['update']>(args: TArgs['update']): Promise<TResult> {
        this._logger.debug(`Updating record: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.update(args));
    }

    /**
     * Updates multiple existing records.
     *
     * @protected
     * @param args - The arguments to update the records.
     * @returns The updated records.
     */
    protected updateMany<TResult = TReturn['updateMany']>(args: TArgs['updateMany']): Promise<TResult> {
        this._logger.debug(`Updating many records: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.updateMany(args));
    }

    /**
     * Creates or updates a record based on its existence.
     *
     * @protected
     * @param args - The arguments to upsert the record.
     * @returns The created or updated record.
     */
    protected upsert<TResult = TReturn['upsert']>(args: TArgs['upsert']): Promise<TResult> {
        this._logger.debug(`Upserting record: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.upsert(args));
    }

    /**
     * Deletes a record by its identifier.
     *
     * @protected
     * @param args - The arguments to delete the record.
     * @returns The deleted record.
     */
    protected delete<TResult = TReturn['delete']>(args: TArgs['delete']): Promise<TResult> {
        this._logger.debug(`Deleting record: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.delete(args));
    }

    /**
     * Deletes multiple records by their identifiers.
     *
     * @protected
     * @param args - The arguments to delete the records.
     * @returns The deleted records.
     */
    protected deleteMany<TResult = TReturn['deleteMany']>(args: TArgs['deleteMany']): Promise<TResult> {
        this._logger.debug(`Deleting many records: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.deleteMany(args));
    }

    /**
     * Performs aggregation operations on the records.
     *
     * @protected
     * @param args - The arguments to perform the aggregation.
     * @returns The aggregation result.
     */
    protected aggregate<TResult = TReturn['aggregate']>(args: TArgs['aggregate']): Promise<TResult> {
        this._logger.debug(`Aggregating records: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.aggregate(args));
    }

    /**
     * Counts the number of records that match the criteria.
     *
     * @protected
     * @param args - The arguments to count the records.
     * @returns The count of matching records.
     */
    protected count<TResult = TReturn['count']>(args: TArgs['count']): Promise<TResult> {
        this._logger.debug(`Counting records: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.count(args));
    }

    /**
     * Groups records by specified fields and performs aggregations.
     *
     * @protected
     * @param args - The arguments to group the records.
     * @returns The grouped records with aggregations.
     */
    protected groupBy<TResult = TReturn['groupBy']>(args: TArgs['groupBy']): Promise<TResult> {
        this._logger.debug(`Grouping records: ${maskSensitive(args)}`);
        return this.tryCatch(this._model.groupBy(args));
    }

    /**
     * Merges the given `data` with the user identified by the `id`.
     *
     * @protected
     * @param data - The data to merge.
     * @returns The merged data.
     */
    protected async merge<TResult = TReturn['update']>(entity: Partial<TEntity> & { id: string }): Promise<TResult> {
        this._logger.debug(`Merging entity: ${maskSensitive(entity)}`);

        if (!entity.id) {
            throw new Error('Entity must have an ID to be merged.');
        }

        return this.update({
            where: {
                id: entity.id,
            },
            ...entity,
        });
    }

    // /**
    //  * Executes a series of operations within a transaction.
    //  *
    //  * @protected
    //  * @param arg - The operations to execute.
    //  * @param options - Optional transaction settings.
    //  * @returns The result of the transaction.
    //  */
    // protected transaction(arg: Parameters<DatabaseService['transaction']>[0], options?: Parameters<DatabaseService['transaction']>[1]): ReturnType<DatabaseService['transaction']> {
    //     return this._db.transaction(arg, options);
    // }

    /**
     * Wraps a promise in a try-catch block to handle errors uniformly.
     *
     * @remarks
     * Prisma request errors become a {@link RepositoryError} whose `kind`
     * classifies the failure, for example a unique constraint violation.
     * Every other error is rethrown unchanged.
     *
     * @protected
     * @param promise - The promise to wrap.
     * @returns The result of the promise or throws an error.
     */
    protected async tryCatch<T>(promise: Promise<T>): Promise<T> {
        try {
            return await promise;
        } catch (error: unknown) {
            this._logger.error(error);

            if (isKnownPrismaFailure(error)) {
                throw new RepositoryError(
                    `Prisma Client Known Request Error: ${error.message}`,
                    'R_KNOWN',
                    {
                        meta: error.meta,
                        code: error.code,
                        clientVersion: error.clientVersion,
                        batchRequestIdx: error.batchRequestIdx,
                    },
                    getRepositoryErrorKind(error),
                );
            } else if (isUnknownPrismaFailure(error)) {
                throw new RepositoryError(`Prisma Client Unknown Request Error: ${error.message}`, 'R_UNKNOWN', {
                    clientVersion: error.clientVersion,
                    batchRequestIdx: error.batchRequestIdx,
                });
            } else {
                throw error;
            }
        }
    }

    // #endregion
}

/**
 * @public
 */
export type DelegateArgs<T> = {
    [K in keyof T]: T[K] extends (args: infer A) => Promise<unknown> ? A : never;
};

/**
 * @public
 */
export type DelegateReturnTypes<T> = {
    [K in keyof T]: T[K] extends (args: infer A) => Promise<infer R> ? R : never;
};
