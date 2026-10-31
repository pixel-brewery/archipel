import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RedisWindowedCounter } from './RedisWindowedCounter.js';

interface IPipelineMock {
    incrby: ReturnType<typeof vi.fn>;
    pexpire: ReturnType<typeof vi.fn>;
    exec: ReturnType<typeof vi.fn>;
}

interface IRedisMockInstance {
    multi: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    del: ReturnType<typeof vi.fn>;
    quit: ReturnType<typeof vi.fn>;
    pipeline: IPipelineMock;
}

interface IIoRedisModuleMock {
    __instances: IRedisMockInstance[];
}

vi.mock('ioredis', () => {
    const instances: IRedisMockInstance[] = [];

    class MockRedis {
        public pipeline: IPipelineMock;
        public multi: ReturnType<typeof vi.fn>;
        public get = vi.fn();
        public del = vi.fn();
        public quit = vi.fn();

        public constructor(
            public url: string,
            public options: { keyPrefix?: string },
        ) {
            const pipeline: IPipelineMock = {
                incrby: vi.fn(() => pipeline),
                pexpire: vi.fn(() => pipeline),
                exec: vi.fn(async () => [
                    [null, 1],
                    [null, 1],
                ]),
            };
            this.pipeline = pipeline;
            this.multi = vi.fn(() => pipeline);
            instances.push(this as unknown as IRedisMockInstance);
        }
    }

    return { default: MockRedis, Redis: MockRedis, __instances: instances };
});

async function latestRedis(): Promise<IRedisMockInstance> {
    const module = (await import('ioredis')) as unknown as IIoRedisModuleMock;

    return module.__instances[module.__instances.length - 1];
}

describe('RedisWindowedCounter', () => {
    let counter: RedisWindowedCounter;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-29T10:00:30.000Z'));
        counter = new RedisWindowedCounter({ url: 'redis://localhost:6379', keyPrefix: 'app:' });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('increments and expires in one atomic operation, so concurrent instances cannot lose a write', async () => {
        const redis = await latestRedis();

        await counter.increment('tenant-1:ai', 60_000, 2);

        expect(redis.multi).toHaveBeenCalledOnce();
        expect(redis.pipeline.incrby).toHaveBeenCalledWith(expect.stringContaining('tenant-1:ai'), 2);
        expect(redis.pipeline.exec).toHaveBeenCalledOnce();
    });

    it('sets the expiry only when the window is new, so the window cannot slide forever', async () => {
        const redis = await latestRedis();

        await counter.increment('tenant-1:ai', 60_000);

        expect(redis.pipeline.pexpire).toHaveBeenCalledWith(expect.any(String), 60_000, 'NX');
    });

    it('keys the window by wall clock, so every instance agrees without coordinating', async () => {
        const redis = await latestRedis();

        await counter.increment('tenant-1:ai', 60_000);
        const firstKey = redis.pipeline.incrby.mock.calls[0][0];

        vi.setSystemTime(new Date('2026-08-29T10:01:30.000Z'));
        await counter.increment('tenant-1:ai', 60_000);
        const secondKey = redis.pipeline.incrby.mock.calls[1][0];

        expect(firstKey).not.toBe(secondKey);
    });

    it('fails loudly when the shared store answers with no count', async () => {
        const redis = await latestRedis();
        redis.pipeline.exec.mockResolvedValueOnce([[new Error('connection lost'), null]]);

        await expect(counter.increment('tenant-1:ai', 60_000)).rejects.toThrow(/could not be incremented/);
    });

    it('reports an empty window as zero rather than as an error', async () => {
        const redis = await latestRedis();
        redis.get.mockResolvedValueOnce(null);

        await expect(counter.peek('tenant-1:ai', 60_000)).resolves.toMatchObject({ value: 0 });
    });

    it('reports when the window ends', async () => {
        const result = await counter.increment('tenant-1:ai', 60_000);

        expect(result.resetAt).toEqual(new Date('2026-08-29T10:01:00.000Z'));
    });

    it('discards a window on request', async () => {
        const redis = await latestRedis();

        await counter.reset('tenant-1:ai', 60_000);

        expect(redis.del).toHaveBeenCalledWith(expect.stringContaining('tenant-1:ai'));
    });
});
