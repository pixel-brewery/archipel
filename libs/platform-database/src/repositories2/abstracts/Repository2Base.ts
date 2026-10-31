import { Logger } from '@nestjs/common';
import { DatabaseService } from '../../services/DatabaseService.js';
import { UnwrapPromise } from '../../types/UnwrapPromise.js';
import { pipe } from '../operators/pipe.js';
import { QueryOperator } from '../operators/QueryOperator.js';
import { IRepositoryQuery2 } from '../queries/IRepositoryQuery2.js';

/**
 * Minimal repository base that exposes the underlying Prisma delegate and
 * provides a typed pipe helper for functional operators.
 *
 * @beta
 * @template TDelegate - The concrete Prisma delegate type (e.g. Prisma.UserDelegate)
 */
export abstract class Repository2Base<TDelegate> {
    // #region Fields

    private readonly _db: DatabaseService;

    private readonly _delegate: TDelegate;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the repository.
     *
     * @remarks
     * The `delegate` parameter is typed as `unknown` and cast internally to
     * `TDelegate`. This avoids `GlobalOmitOptions` mismatches introduced in
     * Prisma 7 where `PrismaClient` instantiates delegates with
     * `PrismaClientOptions` while consumer code references them with the
     * default `{}`.
     */
    public constructor(db: DatabaseService, delegate: unknown) {
        this._db = db;
        this._delegate = delegate as TDelegate;
    }

    // #endregion

    // #region Properties

    /**
     * Provides access to the underlying DatabaseService for derived repositories.
     * Only to be used for transactional orchestration that spans multiple models.
     *
     * @protected
     * @readonly
     */
    protected get database(): DatabaseService {
        return this._db;
    }

    /**
     * Provides direct access to the underlying Prisma model delegate.
     * Use with caution, as this bypasses any repository-level logic.
     *
     * @protected
     * @readonly
     */
    protected get delegate(): TDelegate {
        return this._delegate;
    }

    // #endregion

    // #region Methods

    /**
     * Executes a single operator against this repository's delegate.
     *
     * @public
     * @param op Repository operator
     */
    public pipe<R>(op: QueryOperator<TDelegate, R>): R {
        return pipe(this._delegate, op);
    }

    /**
     * Executes an query and preserves full inferred return type.
     * Always returns a Promise of the unwrapped result, regardless of whether the underlying run is sync or async.
     *
     * @public
     */
    public execute<TRun extends (delegate: TDelegate) => unknown>(query: IRepositoryQuery2<TDelegate, TRun>): Promise<UnwrapPromise<ReturnType<TRun>>> {
        const result = query.run(this._delegate);
        return this.tryCatch(Promise.resolve(result)) as Promise<UnwrapPromise<ReturnType<TRun>>>;
    }

    /**
     * Uniform error wrapping utility for promise-returning functions.
     *
     * @protected
     */
    protected async tryCatch<T>(promise: Promise<T>): Promise<T> {
        try {
            return await promise;
        } catch (error: unknown) {
            const err: Error = error instanceof Error ? error : new Error('Unknown repository error');
            Logger.error(err.message, err.stack, this.constructor.name);
            throw err;
        }
    }

    // #endregion
}
