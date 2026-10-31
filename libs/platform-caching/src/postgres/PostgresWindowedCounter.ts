// #region Imports

import { Injectable } from '@nestjs/common';
import { IWindowedCounter, IWindowedCounterResult } from '../interfaces/IWindowedCounter.js';

// #endregion

/**
 * Minimal contract of a SQL client able to run a parameterized statement.
 *
 * Kept structural on purpose: the counter needs nothing but the ability to execute one statement, so
 * it works with a Prisma client, a transaction client, or any thin wrapper — and this package stays
 * free of a database dependency.
 *
 * @public
 */
export interface ISqlClient {
    /**
     * Runs a parameterized SQL statement and returns its rows.
     *
     * @public
     */
    $queryRawUnsafe<TResult>(sql: string, ...values: ReadonlyArray<unknown>): Promise<TResult>;
}

/**
 * Configuration options for {@link PostgresWindowedCounter}.
 *
 * @public
 */
export interface IPostgresWindowedCounterOptions {
    /**
     * Client used to run the counting statements.
     *
     * @public
     */
    client: ISqlClient;

    /**
     * Table holding the counting windows. Defaults to `rate_limit_windows`.
     *
     * The table belongs to the consuming application, because the schema does. It needs the columns
     * `key` (text, primary key), `value` (bigint, default 0) and `expiresAt` (timestamp), and benefits
     * from an index on `expiresAt` for the cleanup.
     *
     * @public
     */
    tableName?: string;

    /**
     * Prefix applied to every key, to keep these rows apart from other counters in the same table.
     *
     * @public
     */
    keyPrefix?: string;
}

/**
 * Windowed counter kept in the application's own PostgreSQL database.
 *
 * For a deployment without a shared cache the database is the only store every instance already
 * shares. Counting in process memory would multiply each limit by the number of running instances,
 * so the configured limit would not be the effective one and would grow silently with every instance
 * added.
 *
 * The increment is a single `INSERT … ON CONFLICT DO UPDATE`, which PostgreSQL applies atomically:
 * concurrent instances cannot lose each other's writes, and no read-modify-write round trip is
 * needed. The expiry is written only by the insert, so a busy window still ends when it was due.
 *
 * @public
 */
@Injectable()
export class PostgresWindowedCounter implements IWindowedCounter {
    // #region Fields

    private readonly _client: ISqlClient;
    private readonly _tableName: string;
    private readonly _keyPrefix: string;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link PostgresWindowedCounter} class.
     *
     * @param options - Client, table and key configuration.
     */
    public constructor(options: IPostgresWindowedCounterOptions) {
        this._client = options.client;
        this._tableName = options.tableName ?? 'rate_limit_windows';
        this._keyPrefix = options.keyPrefix ?? '';
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async increment(key: string, windowMs: number, amount = 1): Promise<IWindowedCounterResult> {
        const rows = await this._client.$queryRawUnsafe<ReadonlyArray<{ value: bigint | number }>>(
            `INSERT INTO "${this._tableName}" ("key", "value", "expiresAt")
       VALUES ($1, $2::bigint, $3)
       ON CONFLICT ("key")
       DO UPDATE SET "value" = "${this._tableName}"."value" + EXCLUDED."value"
       RETURNING "value"`,
            this._formatKey(key, windowMs),
            amount,
            this._resolveResetAt(windowMs),
        );

        return { value: Number(rows[0]?.value ?? amount), resetAt: this._resolveResetAt(windowMs) };
    }

    /** @inheritdoc */
    public async peek(key: string, windowMs: number): Promise<IWindowedCounterResult> {
        const rows = await this._client.$queryRawUnsafe<ReadonlyArray<{ value: bigint | number }>>(
            `SELECT "value" FROM "${this._tableName}" WHERE "key" = $1`,
            this._formatKey(key, windowMs),
        );

        return { value: Number(rows[0]?.value ?? 0), resetAt: this._resolveResetAt(windowMs) };
    }

    /** @inheritdoc */
    public async reset(key: string, windowMs: number): Promise<void> {
        await this._client.$queryRawUnsafe(`DELETE FROM "${this._tableName}" WHERE "key" = $1`, this._formatKey(key, windowMs));
    }

    /**
     * Removes windows whose time has passed.
     *
     * An expired window is never written to again — a later increment lands on a new key — so removing
     * it changes no limit and only frees space. Safe to repeat and safe to skip.
     *
     * @param now - Moment the expiry is compared against. Defaults to the current time.
     * @public
     */
    public async removeExpiredWindows(now: Date = new Date()): Promise<void> {
        await this._client.$queryRawUnsafe(`DELETE FROM "${this._tableName}" WHERE "expiresAt" <= $1`, now);
    }

    private _formatKey(key: string, windowMs: number): string {
        return `${this._keyPrefix}${key}:${windowMs}:${Math.floor(Date.now() / windowMs)}`;
    }

    private _resolveResetAt(windowMs: number): Date {
        return new Date((Math.floor(Date.now() / windowMs) + 1) * windowMs);
    }

    // #endregion
}
