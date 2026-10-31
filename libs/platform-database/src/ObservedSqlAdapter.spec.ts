// #region Imports

import { Logger } from '@nestjs/common';
import type { SqlDriverAdapter, SqlDriverAdapterFactory, SqlQuery, Transaction } from '@prisma/driver-adapter-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ObservedSqlAdapter } from './ObservedSqlAdapter.js';

// #endregion

const query: SqlQuery = { sql: '/* private comment */ SELECT $1', args: ['private argument'], argTypes: [] };
const rows = { columnNames: ['value'], columnTypes: [7], rows: [['private result']] };

function fixture() {
    const transaction: Transaction = {
        provider: 'postgres',
        adapterName: 'fixture',
        options: { usePhantomQuery: false },
        queryRaw: vi.fn().mockResolvedValue(rows),
        executeRaw: vi.fn().mockResolvedValue(1),
        commit: vi.fn().mockResolvedValue(undefined),
        rollback: vi.fn().mockResolvedValue(undefined),
        createSavepoint: vi.fn().mockResolvedValue(undefined),
        rollbackToSavepoint: vi.fn().mockResolvedValue(undefined),
        releaseSavepoint: vi.fn().mockResolvedValue(undefined),
    };
    const driver: SqlDriverAdapter = {
        provider: 'postgres',
        adapterName: 'fixture',
        queryRaw: vi.fn().mockResolvedValue(rows),
        executeRaw: vi.fn().mockResolvedValue(1),
        startTransaction: vi.fn().mockResolvedValue(transaction),
        executeScript: vi.fn().mockResolvedValue(undefined),
        dispose: vi.fn().mockResolvedValue(undefined),
    };
    const factory: SqlDriverAdapterFactory = { provider: 'postgres', adapterName: 'fixture', connect: vi.fn().mockResolvedValue(driver) };
    const observer = vi.fn();
    return { driver, transaction, factory, observer, observed: new ObservedSqlAdapter(factory, observer) };
}

describe('individual SQL observations', () => {
    afterEach(() => vi.restoreAllMocks());

    it('returns the original query result while exposing only a bounded command and duration', async () => {
        // arrange
        const { observed, observer, driver } = fixture();
        const adapter = await observed.connect();
        // act
        const result = await adapter.queryRaw(query);
        // assert
        expect(result).toBe(rows);
        expect(driver.queryRaw).toHaveBeenCalledWith(query);
        expect(observer).toHaveBeenCalledExactlyOnceWith({
            durationMs: expect.any(Number),
            operation: 'SELECT',
            kind: 'query',
            transaction: false,
            outcome: 'success',
        });
        expect(JSON.stringify(observer.mock.calls)).not.toContain('private');
    });

    it('preserves the exact thrown error and records its failed duration even when the observer throws', async () => {
        // arrange
        const { observed, observer, driver } = fixture();
        const original = new Error('private SQL error');
        vi.mocked(driver.queryRaw).mockRejectedValue(original);
        observer.mockImplementation(() => {
            throw new Error('private telemetry failure');
        });
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const adapter = await observed.connect();
        // act / assert
        await expect(adapter.queryRaw(query)).rejects.toBe(original);
        expect(observer).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'failure', kind: 'query' }));
        expect(warn).toHaveBeenCalledWith('SQL observation failed.');
        expect(JSON.stringify(warn.mock.calls)).not.toContain('private');
    });

    it('observes transaction statements and lifecycle operations separately without double counting', async () => {
        // arrange
        const { observed, observer, transaction, driver } = fixture();
        const adapter = await observed.connect();
        // act
        const tx = await adapter.startTransaction('Serializable');
        await tx.executeRaw({ ...query, sql: 'UPDATE records SET value=$1' });
        await tx.createSavepoint?.('private-savepoint');
        await tx.rollbackToSavepoint?.('private-savepoint');
        await tx.releaseSavepoint?.('private-savepoint');
        await tx.commit();
        await adapter.dispose();
        // assert
        expect(driver.startTransaction).toHaveBeenCalledWith('Serializable');
        expect(tx.options).toBe(transaction.options);
        expect(observer.mock.calls.map(([event]) => [event.operation, event.kind, event.transaction])).toEqual([
            ['BEGIN', 'transaction', true],
            ['UPDATE', 'query', true],
            ['SAVEPOINT', 'transaction', true],
            ['ROLLBACK', 'transaction', true],
            ['RELEASE', 'transaction', true],
            ['COMMIT', 'transaction', true],
        ]);
        expect(driver.dispose).toHaveBeenCalledOnce();
        expect(JSON.stringify(observer.mock.calls)).not.toContain('private');
    });

    it('keeps connection failure semantics unchanged', async () => {
        // arrange
        const { observed, factory, observer } = fixture();
        const error = new Error('private connection');
        vi.mocked(factory.connect).mockRejectedValue(error);
        // act / assert
        await expect(observed.connect()).rejects.toBe(error);
        expect(observer).not.toHaveBeenCalled();
    });
});
