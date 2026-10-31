// #region Imports

import { Logger } from '@nestjs/common';
import type { SqlDriverAdapter, SqlDriverAdapterFactory, SqlQuery, SqlQueryable, Transaction } from '@prisma/driver-adapter-utils';
import type { ISqlObservation } from './interfaces/ISqlObservation.js';

// #endregion

/** Observes Prisma's public driver boundary, preserving results, errors and transaction ownership. */
export class ObservedSqlAdapter implements SqlDriverAdapterFactory {
    // #region Fields

    public readonly provider: SqlDriverAdapterFactory['provider'];
    public readonly adapterName: string;
    private readonly _factory: SqlDriverAdapterFactory;
    private readonly _observer: (observation: ISqlObservation) => void;
    private readonly _logger = new Logger(ObservedSqlAdapter.name);

    // #endregion

    // #region Ctor

    public constructor(factory: SqlDriverAdapterFactory, observer: (observation: ISqlObservation) => void) {
        this.provider = factory.provider;
        this.adapterName = factory.adapterName;
        this._factory = factory;
        this._observer = observer;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /** Creates an observed runtime adapter; connection and pool failures retain the delegate's behavior. */
    public async connect(): Promise<SqlDriverAdapter> {
        const adapter = await this._factory.connect();
        return {
            ...this.queryable(adapter, false),
            executeScript: (script) => this.measure('SCRIPT', 'script', false, () => adapter.executeScript(script)),
            startTransaction: async (isolation) =>
                this.transaction(await this.measure('BEGIN', 'transaction', true, () => adapter.startTransaction(isolation))),
            ...(adapter.getConnectionInfo ? { getConnectionInfo: () => adapter.getConnectionInfo!() } : {}),
            dispose: () => adapter.dispose(),
        };
    }

    private queryable(delegate: SqlQueryable, transaction: boolean): SqlQueryable {
        return {
            provider: delegate.provider,
            adapterName: delegate.adapterName,
            queryRaw: (query) => this.measure(this.operation(query), 'query', transaction, () => delegate.queryRaw(query)),
            executeRaw: (query) => this.measure(this.operation(query), 'query', transaction, () => delegate.executeRaw(query)),
        };
    }

    private transaction(delegate: Transaction): Transaction {
        return {
            ...this.queryable(delegate, true),
            options: delegate.options,
            commit: () => this.measure('COMMIT', 'transaction', true, () => delegate.commit()),
            rollback: () => this.measure('ROLLBACK', 'transaction', true, () => delegate.rollback()),
            ...(delegate.createSavepoint
                ? { createSavepoint: (name: string) => this.measure('SAVEPOINT', 'transaction', true, () => delegate.createSavepoint!(name)) }
                : {}),
            ...(delegate.rollbackToSavepoint
                ? { rollbackToSavepoint: (name: string) => this.measure('ROLLBACK', 'transaction', true, () => delegate.rollbackToSavepoint!(name)) }
                : {}),
            ...(delegate.releaseSavepoint
                ? { releaseSavepoint: (name: string) => this.measure('RELEASE', 'transaction', true, () => delegate.releaseSavepoint!(name)) }
                : {}),
        };
    }

    private operation(query: SqlQuery): string {
        const command = query.sql
            .replace(/^(?:\s|\/\*[\s\S]*?\*\/|--[^\n]*(?:\n|$))*/, '')
            .match(/^[A-Za-z]+/)?.[0]
            ?.toUpperCase();
        return command && /^(SELECT|INSERT|UPDATE|DELETE|WITH|BEGIN|COMMIT|ROLLBACK|SAVEPOINT|RELEASE|SET)$/.test(command) ? command : 'OTHER';
    }

    private async measure<T>(operation: string, kind: ISqlObservation['kind'], transaction: boolean, run: () => Promise<T>): Promise<T> {
        const started = performance.now();
        let outcome: ISqlObservation['outcome'] = 'failure';
        try {
            const result = await run();
            outcome = 'success';
            return result;
        } finally {
            try {
                this._observer({ durationMs: Math.max(0, performance.now() - started), operation, outcome, kind, transaction });
            } catch {
                this._logger.warn('SQL observation failed.');
            }
        }
    }

    // #endregion
}
