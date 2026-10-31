import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ISqlClient, PostgresWindowedCounter } from './PostgresWindowedCounter.js';

describe('PostgresWindowedCounter', () => {
    let client: { $queryRawUnsafe: ReturnType<typeof vi.fn> };
    let counter: PostgresWindowedCounter;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-29T10:00:30.000Z'));
        client = { $queryRawUnsafe: vi.fn().mockResolvedValue([{ value: 3n }]) };
        counter = new PostgresWindowedCounter({ client: client as unknown as ISqlClient, keyPrefix: 'ai:' });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('adds and expires in one atomic statement, so concurrent instances cannot lose a write', async () => {
        const result = await counter.increment('tenant-1:requests', 60_000, 2);

        const [sql, key, amount] = client.$queryRawUnsafe.mock.calls[0];
        expect(sql).toContain('ON CONFLICT ("key")');
        expect(sql).toContain('DO UPDATE SET "value" = "rate_limit_windows"."value" + EXCLUDED."value"');
        expect(key).toBe('ai:tenant-1:requests:60000:29799960');
        expect(amount).toBe(2);
        expect(result.value).toBe(3);
    });

    it('keys the window by wall clock, so every instance agrees without coordinating', async () => {
        await counter.increment('tenant-1:requests', 60_000);
        vi.setSystemTime(new Date('2026-08-29T10:01:30.000Z'));
        await counter.increment('tenant-1:requests', 60_000);

        expect(client.$queryRawUnsafe.mock.calls[0][1]).not.toBe(client.$queryRawUnsafe.mock.calls[1][1]);
    });

    it('reports when the window ends', async () => {
        const result = await counter.increment('tenant-1:requests', 60_000);

        expect(result.resetAt).toEqual(new Date('2026-08-29T10:01:00.000Z'));
    });

    it('reads an empty window as zero rather than as an error', async () => {
        client.$queryRawUnsafe.mockResolvedValueOnce([]);

        await expect(counter.peek('tenant-1:requests', 60_000)).resolves.toMatchObject({ value: 0 });
    });

    it('reads a window without counting the read', async () => {
        await counter.peek('tenant-1:requests', 60_000);

        expect(client.$queryRawUnsafe.mock.calls[0][0]).toContain('SELECT "value"');
    });

    it('discards a window on request', async () => {
        await counter.reset('tenant-1:requests', 60_000);

        expect(client.$queryRawUnsafe.mock.calls[0][0]).toContain('DELETE FROM');
    });

    it('removes only windows whose time has passed', async () => {
        await counter.removeExpiredWindows(new Date('2026-08-29T10:00:00.000Z'));

        const [sql, now] = client.$queryRawUnsafe.mock.calls[0];
        expect(sql).toContain('"expiresAt" <= $1');
        expect(now).toEqual(new Date('2026-08-29T10:00:00.000Z'));
    });

    it('counts in the table the application named', async () => {
        const named = new PostgresWindowedCounter({ client: client as unknown as ISqlClient, tableName: 'limits' });

        await named.increment('tenant-1:requests', 60_000);

        expect(client.$queryRawUnsafe.mock.calls[0][0]).toContain('INSERT INTO "limits"');
    });
});
