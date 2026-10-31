// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryWindowedCounter } from './MemoryWindowedCounter.js';

// #endregion

describe('MemoryWindowedCounter', () => {
    let counter: MemoryWindowedCounter;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-29T10:00:00.000Z'));
        counter = new MemoryWindowedCounter();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('accumulates inside the same window', async () => {
        await counter.increment('tenant-1:ai', 60_000);
        const result = await counter.increment('tenant-1:ai', 60_000);

        expect(result.value).toBe(2);
    });

    it('starts over once the window has passed', async () => {
        await counter.increment('tenant-1:ai', 60_000);

        vi.setSystemTime(new Date('2026-08-29T10:01:00.000Z'));
        const result = await counter.increment('tenant-1:ai', 60_000);

        expect(result.value).toBe(1);
    });

    it('keeps subjects and window lengths apart', async () => {
        await counter.increment('tenant-1:ai', 60_000);
        await counter.increment('tenant-1:ai', 60_000);

        expect((await counter.peek('tenant-2:ai', 60_000)).value).toBe(0);
        expect((await counter.peek('tenant-1:ai', 86_400_000)).value).toBe(0);
    });

    it('reports when the window ends, so a caller can say how long a limit lasts', async () => {
        const result = await counter.increment('tenant-1:ai', 60_000);

        expect(result.resetAt).toEqual(new Date('2026-08-29T10:01:00.000Z'));
    });

    it('reads a window without counting the read', async () => {
        await counter.increment('tenant-1:ai', 60_000);

        await counter.peek('tenant-1:ai', 60_000);

        expect((await counter.peek('tenant-1:ai', 60_000)).value).toBe(1);
    });

    it('discards a window on request', async () => {
        await counter.increment('tenant-1:ai', 60_000);

        await counter.reset('tenant-1:ai', 60_000);

        expect((await counter.peek('tenant-1:ai', 60_000)).value).toBe(0);
    });

    it('does not grow without bound as windows expire', async () => {
        for (let minute = 0; minute < 50; minute++) {
            vi.setSystemTime(new Date(Date.UTC(2026, 7, 29, 10, minute, 0)));
            await counter.increment(`tenant-${minute}:ai`, 60_000);
        }

        expect((counter as unknown as { _windows: Map<string, unknown> })._windows.size).toBe(1);
    });
});
