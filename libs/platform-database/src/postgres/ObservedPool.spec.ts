import { createServer, type Socket } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { IPoolObserver } from './PoolObserver.js';
import { ObservedPool } from './ObservedPool.js';

describe('ObservedPool', () => {
    afterEach(() => vi.restoreAllMocks());

    it('reports a real pg max-one acquisition timeout and still releases and reuses the held connection', async () => {
        // This disposable wire peer acknowledges PostgreSQL startup only. No SQL or shared database is used.
        const sockets = new Set<Socket>();
        const server = createServer((socket) => {
            sockets.add(socket);
            socket.on('close', () => sockets.delete(socket));
            socket.once('data', () => socket.write(Buffer.from('5200000008000000005a0000000549', 'hex')));
        });
        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        const address = server.address();
        if (!address || typeof address === 'string') {
            throw new Error('Missing disposable test port');
        }
        const telemetry = { complete: vi.fn(), failure: vi.fn(), gauge: vi.fn() };
        const pool = new ObservedPool({
            host: '127.0.0.1',
            port: address.port,
            user: 'test',
            database: 'test',
            max: 1,
            connectionTimeoutMillis: 50,
            idleTimeoutMillis: 0,
        });
        pool.observe(telemetry as unknown as IPoolObserver);

        try {
            const held = await pool.connect();
            try {
                await expect(pool.connect()).rejects.toThrow('timeout exceeded when trying to connect');
                expect(telemetry.failure).toHaveBeenCalledWith('database', 'pool', expect.any(Error));
                expect(telemetry.complete).toHaveBeenCalledWith('database_pool_acquire', expect.any(Number), 'failure');
            } finally {
                held.release();
            }
            const recovered = await pool.connect();
            recovered.release();
            expect(telemetry.complete).toHaveBeenCalledWith('database_pool_acquire', expect.any(Number), 'success');
        } finally {
            await pool.end();
            for (const socket of sockets) socket.destroy();
            await new Promise<void>((resolve) => server.close(() => resolve()));
        }
    });

    it('preserves the callback acquisition contract and the original network error', async () => {
        const failure = new Error('connection failed');
        const { Pool } = await import('pg');
        vi.spyOn(Pool.prototype, 'connect').mockRejectedValue(failure);
        const pool = new ObservedPool();
        const telemetry = { complete: vi.fn(), failure: vi.fn(), gauge: vi.fn() };
        pool.observe(telemetry as unknown as IPoolObserver);
        const reported = await new Promise<unknown>((resolve) => pool.connect((error) => resolve(error)));
        expect(reported).toBe(failure);
        await pool.end();
    });

    it('preserves database errors even when every observer callback throws', async () => {
        const original = new Error('database unavailable');
        const { Pool } = await import('pg');
        vi.spyOn(Pool.prototype, 'connect').mockRejectedValue(original);
        const pool = new ObservedPool();
        const fail = () => {
            throw new Error('observer failed');
        };
        pool.observe({ complete: fail, failure: fail, gauge: fail });
        try {
            await expect(pool.connect()).rejects.toBe(original);
        } finally {
            await pool.end();
        }
    });
});
