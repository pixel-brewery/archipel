import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ICacheMetricsRecorder } from '../ICacheMetricsRecorder.js';
import { RedisLayeredCache } from './RedisLayeredCache.js';

interface ITestValue {
    id: string;
    count: number;
}

interface IRedisMockInstance {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    del: ReturnType<typeof vi.fn>;
    quit: ReturnType<typeof vi.fn>;
}

interface IIoRedisModuleMock {
    __instances: IRedisMockInstance[];
}

vi.mock('ioredis', () => {
    class MockRedis {
        public get = vi.fn();
        public set = vi.fn();
        public del = vi.fn();
        public quit = vi.fn();

        public constructor(
            public url: string,
            public options: { keyPrefix?: string },
        ) {
            instances.push(this as unknown as IRedisMockInstance);
        }
    }
    const instances: IRedisMockInstance[] = [];
    return {
        default: MockRedis,
        Redis: MockRedis,
        __instances: instances,
    };
});

async function latestRedis(): Promise<IRedisMockInstance> {
    const mod = (await import('ioredis')) as unknown as IIoRedisModuleMock;
    return mod.__instances[mod.__instances.length - 1];
}

describe('RedisLayeredCache', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ──────────────────────────────────────────────────
    // getAsync
    // ──────────────────────────────────────────────────

    describe('getAsync', () => {
        it('should return cached value from Redis on cache hit', async () => {
            // arrange
            const loader = vi.fn(async () => undefined as ITestValue | undefined);
            const cache = new RedisLayeredCache<string, ITestValue>(loader, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            const value: ITestValue = { id: 'k1', count: 7 };
            redis.get.mockResolvedValueOnce(JSON.stringify(value));

            // act
            const result = await cache.getAsync('k1');

            // assert
            expect(result).toEqual(value);
            expect(loader).not.toHaveBeenCalled();
            expect(redis.get).toHaveBeenCalledWith('k1');
        });

        it('should invoke loader and store result in Redis on cache miss', async () => {
            // arrange
            const loaded: ITestValue = { id: 'k2', count: 3 };
            const loader = vi.fn(async () => loaded);
            const cache = new RedisLayeredCache<string, ITestValue>(loader, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            const result = await cache.getAsync('k2');

            // assert
            expect(result).toEqual(loaded);
            expect(loader).toHaveBeenCalledTimes(1);
            expect(redis.set).toHaveBeenCalledWith('k2', JSON.stringify(loaded));
        });

        it('should fall back to loader when Redis get fails', async () => {
            // arrange
            const loaded: ITestValue = { id: 'k5', count: 9 };
            const loader = vi.fn(async () => loaded);
            const cache = new RedisLayeredCache<string, ITestValue>(loader, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockRejectedValueOnce(new Error('connection-refused'));

            // act
            const result = await cache.getAsync('k5');

            // assert
            expect(result).toEqual(loaded);
        });

        it('should fall back to loader when cached data is malformed JSON', async () => {
            // arrange
            const loaded: ITestValue = { id: 'k6', count: 42 };
            const loader = vi.fn(async () => loaded);
            const cache = new RedisLayeredCache<string, ITestValue>(loader, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce('{not-json');

            // act
            const result = await cache.getAsync('k6');

            // assert
            expect(result).toEqual(loaded);
            expect(loader).toHaveBeenCalledTimes(1);
        });

        it('should deduplicate concurrent loads for the same key', async () => {
            // arrange
            let resolveLoader!: (value: ITestValue) => void;
            const loaderPromise = new Promise<ITestValue>((resolve) => {
                resolveLoader = resolve;
            });
            const loader = vi.fn(() => loaderPromise);
            const cache = new RedisLayeredCache<string, ITestValue>(loader, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValue(null);

            // act
            const promise1 = cache.getAsync('sf');
            const promise2 = cache.getAsync('sf');
            resolveLoader({ id: 'sf', count: 1 });
            const [result1, result2] = await Promise.all([promise1, promise2]);

            // assert
            expect(result1).toEqual({ id: 'sf', count: 1 });
            expect(result2).toEqual({ id: 'sf', count: 1 });
            expect(loader).toHaveBeenCalledTimes(1);
        });
    });

    // ──────────────────────────────────────────────────
    // setAsync
    // ──────────────────────────────────────────────────

    describe('setAsync', () => {
        it('should store value in Redis without TTL when ttlSeconds is not configured', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            const value: ITestValue = { id: 'k', count: 5 };

            // act
            await cache.setAsync('k', value);

            // assert
            expect(redis.set).toHaveBeenCalledWith('k', JSON.stringify(value));
        });

        it('should store value in Redis with EX flag when ttlSeconds is configured', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
                ttlSeconds: 30,
            });
            const redis = await latestRedis();
            const value: ITestValue = { id: 'k3', count: 11 };

            // act
            await cache.setAsync('k3', value);

            // assert
            expect(redis.set).toHaveBeenCalledWith('k3', JSON.stringify(value), 'EX', 30);
        });

        it('should not throw when Redis set fails', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.set.mockRejectedValueOnce(new Error('write-error'));

            // act & assert
            await expect(cache.setAsync('k', { id: 'k', count: 1 })).resolves.not.toThrow();
        });
    });

    // ──────────────────────────────────────────────────
    // warm
    // ──────────────────────────────────────────────────

    describe('warm', () => {
        it('should delegate to getAsync and invoke loader on cache miss', async () => {
            // arrange
            const loaded: ITestValue = { id: 'k7', count: 1 };
            const loader = vi.fn(async () => loaded);
            const cache = new RedisLayeredCache<string, ITestValue>(loader, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            const result = await cache.warm('k7');

            // assert
            expect(result).toEqual(loaded);
            expect(loader).toHaveBeenCalledTimes(1);
        });
    });

    // ──────────────────────────────────────────────────
    // invalidateAsync
    // ──────────────────────────────────────────────────

    describe('invalidateAsync', () => {
        it('should delete the key from Redis', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();

            // act
            await cache.invalidateAsync('k4');

            // assert
            expect(redis.del).toHaveBeenCalledWith('k4');
        });

        it('should not throw when Redis del fails', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.del.mockRejectedValueOnce(new Error('delete-error'));

            // act & assert
            await expect(cache.invalidateAsync('k')).resolves.not.toThrow();
        });
    });

    // ──────────────────────────────────────────────────
    // synchronous methods (unsupported)
    // ──────────────────────────────────────────────────

    describe('synchronous methods', () => {
        it('should throw when synchronous get is called', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });

            // act & assert
            expect(() => cache.get('k')).toThrow('Use getAsync()');
        });

        it('should throw when synchronous set is called', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });

            // act & assert
            expect(() => cache.set('k', { id: 'k', count: 1 })).toThrow('Use setAsync()');
        });

        it('should throw when synchronous invalidate is called', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });

            // act & assert
            expect(() => cache.invalidate('k')).toThrow('Use invalidateAsync()');
        });
    });

    // ──────────────────────────────────────────────────
    // custom serialization
    // ──────────────────────────────────────────────────

    describe('custom serialization', () => {
        it('should use custom deserialize function when reading from Redis', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, string>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
                serialize: (v) => `S|${v}`,
                deserialize: (r) => (r.startsWith('S|') ? r.slice(2) : r),
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce('S|hello');

            // act
            const result = await cache.getAsync('foo');

            // assert
            expect(result).toBe('hello');
        });

        it('should use custom serialize function when writing to Redis', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, string>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
                serialize: (v) => `S|${v}`,
                deserialize: (r) => (r.startsWith('S|') ? r.slice(2) : r),
            });
            const redis = await latestRedis();

            // act
            await cache.setAsync('bar', 'world');

            // assert
            expect(redis.set).toHaveBeenCalledWith('bar', 'S|world');
        });
    });

    // ──────────────────────────────────────────────────
    // statistics
    // ──────────────────────────────────────────────────

    describe('statistics', () => {
        it('should track hits on cache hit', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(JSON.stringify({ id: 'k', count: 1 }));

            // act
            await cache.getAsync('k');

            // assert
            expect(cache.stats().hits).toBe(1);
            expect(cache.stats().misses).toBe(0);
        });

        it('should track misses and loads on cache miss with successful load', async () => {
            // arrange
            const loaded: ITestValue = { id: 'k', count: 1 };
            const cache = new RedisLayeredCache<string, ITestValue>(async () => loaded, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            await cache.getAsync('k');

            // assert
            expect(cache.stats().misses).toBe(1);
            expect(cache.stats().loads).toBe(1);
        });

        it('should track loadErrors when loader fails', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(
                async () => {
                    throw new Error('load-fail');
                },
                { url: 'redis://localhost:6379', keyPrefix: 't:' },
            );
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            await cache.getAsync('err');

            // assert
            expect(cache.stats().loadErrors).toBe(1);
        });

        it('should return undefined when loader fails', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(
                async () => {
                    throw new Error('load-fail');
                },
                { url: 'redis://localhost:6379', keyPrefix: 't:' },
            );
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            const result = await cache.getAsync('err');

            // assert
            expect(result).toBeUndefined();
        });
    });

    // ──────────────────────────────────────────────────
    // metrics recording
    // ──────────────────────────────────────────────────

    describe('metrics recording', () => {
        it('should invoke recordHit on cache hit', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
            };
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
                metricsRecorder: recorder,
                cacheName: 'redis-test',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(JSON.stringify({ id: 'k', count: 1 }));

            // act
            await cache.getAsync('k');

            // assert
            expect(recorder.recordHit).toHaveBeenCalledWith('redis-test');
        });

        it('should invoke recordMiss on cache miss', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
            };
            const loaded: ITestValue = { id: 'k', count: 1 };
            const cache = new RedisLayeredCache<string, ITestValue>(async () => loaded, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
                metricsRecorder: recorder,
                cacheName: 'redis-test',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            await cache.getAsync('k');

            // assert
            expect(recorder.recordMiss).toHaveBeenCalledWith('redis-test');
        });

        it('should invoke recordLoadSuccess on successful load', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
            };
            const loaded: ITestValue = { id: 'k', count: 1 };
            const cache = new RedisLayeredCache<string, ITestValue>(async () => loaded, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
                metricsRecorder: recorder,
                cacheName: 'redis-test',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            await cache.getAsync('k');

            // assert
            expect(recorder.recordLoadSuccess).toHaveBeenCalledWith('redis-test');
        });

        it('should invoke recordLoadError on failed load', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
            };
            const cache = new RedisLayeredCache<string, ITestValue>(
                async () => {
                    throw new Error('boom');
                },
                {
                    url: 'redis://localhost:6379',
                    keyPrefix: 't:',
                    metricsRecorder: recorder,
                    cacheName: 'redis-test',
                },
            );
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            await cache.getAsync('k');

            // assert
            expect(recorder.recordLoadError).toHaveBeenCalledWith('redis-test');
        });

        it('should default cache name to redis when not provided', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
            };
            const loaded: ITestValue = { id: 'k', count: 1 };
            const cache = new RedisLayeredCache<string, ITestValue>(async () => loaded, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
                metricsRecorder: recorder,
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(null);

            // act
            await cache.getAsync('k');

            // assert
            expect(recorder.recordMiss).toHaveBeenCalledWith('redis');
        });
    });

    // ──────────────────────────────────────────────────
    // key formatting
    // ──────────────────────────────────────────────────

    describe('key formatting', () => {
        it('should format numeric keys as strings', async () => {
            // arrange
            const cache = new RedisLayeredCache<number, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(JSON.stringify({ id: 'n', count: 1 }));

            // act
            await cache.getAsync(42);

            // assert
            expect(redis.get).toHaveBeenCalledWith('42');
        });

        it('should format boolean keys as strings', async () => {
            // arrange
            const cache = new RedisLayeredCache<boolean, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(JSON.stringify({ id: 'b', count: 1 }));

            // act
            await cache.getAsync(true);

            // assert
            expect(redis.get).toHaveBeenCalledWith('true');
        });

        it('should format null keys as string null', async () => {
            // arrange
            const cache = new RedisLayeredCache<null, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(JSON.stringify({ id: 'x', count: 1 }));

            // act
            await cache.getAsync(null);

            // assert
            expect(redis.get).toHaveBeenCalledWith('null');
        });

        it('should format object keys as JSON strings', async () => {
            // arrange
            const cache = new RedisLayeredCache<{ a: number }, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.get.mockResolvedValueOnce(JSON.stringify({ id: 'o', count: 1 }));

            // act
            await cache.getAsync({ a: 1 });

            // assert
            expect(redis.get).toHaveBeenCalledWith('{"a":1}');
        });
    });

    // ──────────────────────────────────────────────────
    // lifecycle
    // ──────────────────────────────────────────────────

    describe('lifecycle', () => {
        it('should disconnect Redis client on module destroy', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.quit.mockResolvedValueOnce('OK');

            // act
            await cache.onModuleDestroy();

            // assert
            expect(redis.quit).toHaveBeenCalledTimes(1);
        });

        it('should handle Redis disconnect error gracefully on module destroy', async () => {
            // arrange
            const cache = new RedisLayeredCache<string, ITestValue>(async () => undefined, {
                url: 'redis://localhost:6379',
                keyPrefix: 't:',
            });
            const redis = await latestRedis();
            redis.quit.mockRejectedValueOnce(new Error('disconnect-fail'));

            // act & assert
            await expect(cache.onModuleDestroy()).resolves.not.toThrow();
        });
    });
});
