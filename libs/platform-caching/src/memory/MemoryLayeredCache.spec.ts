import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ICacheMetricsRecorder } from '../ICacheMetricsRecorder.js';
import { MemoryLayeredCache } from './MemoryLayeredCache.js';

describe('MemoryLayeredCache', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    // ──────────────────────────────────────────────────
    // get (synchronous)
    // ──────────────────────────────────────────────────

    describe('get', () => {
        it('should return cached value when entry exists and is within TTL', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000 });
            await cache.getAsync('abc');

            // act
            const result = cache.get('abc');

            // assert
            expect(result).toBe(3);
        });

        it('should return undefined on cache miss', () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000 });

            // act
            const result = cache.get('nonexistent');

            // assert
            expect(result).toBeUndefined();
        });

        it('should return undefined when entry has expired', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 1000 });
            await cache.getAsync('abc');
            vi.advanceTimersByTime(1001);

            // act
            const result = cache.get('abc');

            // assert
            expect(result).toBeUndefined();
        });

        it('should return stale value when stale-while-revalidate is enabled and entry has expired', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, {
                ttlMs: 1000,
                staleWhileRevalidate: true,
            });
            await cache.getAsync('abc');
            vi.advanceTimersByTime(1001);

            // act
            const result = cache.get('abc');

            // assert
            expect(result).toBe(3);
        });

        it('should never expire entries when no TTL is configured', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length);
            await cache.getAsync('abc');
            vi.advanceTimersByTime(999_999);

            // act
            const result = cache.get('abc');

            // assert
            expect(result).toBe(3);
        });
    });

    // ──────────────────────────────────────────────────
    // getAsync
    // ──────────────────────────────────────────────────

    describe('getAsync', () => {
        it('should return cached value without invoking loader when entry is within TTL', async () => {
            // arrange
            const loader = vi.fn(async (key: string) => key.length);
            const cache = new MemoryLayeredCache<string, number>(loader, { ttlMs: 5000 });
            await cache.getAsync('abc');

            // act
            const result = await cache.getAsync('abc');

            // assert
            expect(result).toBe(3);
            expect(loader).toHaveBeenCalledTimes(1);
        });

        it('should invoke loader and cache result on cache miss', async () => {
            // arrange
            const loader = vi.fn(async (key: string) => key.length);
            const cache = new MemoryLayeredCache<string, number>(loader, { ttlMs: 5000 });

            // act
            const result = await cache.getAsync('hello');

            // assert
            expect(result).toBe(5);
            expect(loader).toHaveBeenCalledTimes(1);
        });

        it('should trigger reload after TTL expires', async () => {
            // arrange
            let loadCount = 0;
            const cache = new MemoryLayeredCache<string, number>(
                async (key: string) => {
                    loadCount += 1;
                    return key.length + loadCount;
                },
                { ttlMs: 1000 },
            );
            await cache.getAsync('x');
            vi.advanceTimersByTime(1001);

            // act
            const result = await cache.getAsync('x');

            // assert
            expect(result).toBe(3);
            expect(loadCount).toBe(2);
        });

        it('should return stale value and trigger background refresh when stale-while-revalidate is enabled', async () => {
            // arrange
            let loadCount = 0;
            const cache = new MemoryLayeredCache<string, number>(
                async () => {
                    loadCount += 1;
                    return loadCount;
                },
                { ttlMs: 1000, staleWhileRevalidate: true },
            );
            await cache.getAsync('k');
            vi.advanceTimersByTime(1001);

            // act
            const staleValue = await cache.getAsync('k');

            // assert
            expect(staleValue).toBe(1);
        });

        it('should serve fresh value after background refresh completes', async () => {
            // arrange
            let loadCount = 0;
            const cache = new MemoryLayeredCache<string, number>(
                async () => {
                    loadCount += 1;
                    return loadCount;
                },
                { ttlMs: 1000, staleWhileRevalidate: true },
            );
            await cache.getAsync('k');
            vi.advanceTimersByTime(1001);
            await cache.getAsync('k');
            await vi.advanceTimersByTimeAsync(0);

            // act
            const freshValue = cache.get('k');

            // assert
            expect(freshValue).toBe(2);
        });

        it('should preserve original value when loader fails during background refresh', async () => {
            // arrange
            let callCount = 0;
            const cache = new MemoryLayeredCache<string, number>(
                async () => {
                    callCount += 1;
                    if (callCount > 1) throw new Error('load-fail');
                    return 42;
                },
                { ttlMs: 1000, staleWhileRevalidate: true },
            );
            await cache.getAsync('k');
            vi.advanceTimersByTime(1001);
            await cache.getAsync('k');
            await vi.advanceTimersByTimeAsync(0);

            // act
            const value = cache.get('k');

            // assert
            expect(value).toBe(42);
        });

        it('should deduplicate concurrent loads for the same key', async () => {
            // arrange
            let resolveLoader!: (value: number) => void;
            const loaderPromise = new Promise<number>((resolve) => {
                resolveLoader = resolve;
            });
            const loader = vi.fn((_key: string) => loaderPromise);
            const cache = new MemoryLayeredCache<string, number>(loader, { ttlMs: 5000 });

            // act
            const promise1 = cache.getAsync('k');
            const promise2 = cache.getAsync('k');
            resolveLoader(42);
            const [result1, result2] = await Promise.all([promise1, promise2]);

            // assert
            expect(result1).toBe(42);
            expect(result2).toBe(42);
            expect(loader).toHaveBeenCalledTimes(1);
        });

        it('should not start a new refresh when one is already in flight during stale read', async () => {
            // arrange
            let loadCount = 0;
            let resolveRefresh!: (value: number) => void;
            const refreshPromise = new Promise<number>((resolve) => {
                resolveRefresh = resolve;
            });
            const cache = new MemoryLayeredCache<string, number>(
                async () => {
                    loadCount += 1;
                    if (loadCount === 1) return 10;
                    return refreshPromise;
                },
                { ttlMs: 1000, staleWhileRevalidate: true },
            );
            await cache.getAsync('k');
            vi.advanceTimersByTime(1001);
            await cache.getAsync('k');

            // act
            const staleValue = await cache.getAsync('k');
            resolveRefresh(20);
            await vi.advanceTimersByTimeAsync(0);

            // assert
            expect(staleValue).toBe(10);
            expect(loadCount).toBe(2);
        });

        it('should return existing cached value when loader fails on expired entry', async () => {
            // arrange
            let callCount = 0;
            const cache = new MemoryLayeredCache<string, number>(
                async () => {
                    callCount += 1;
                    if (callCount > 1) throw new Error('load-fail');
                    return 42;
                },
                { ttlMs: 1000 },
            );
            await cache.getAsync('a');
            vi.advanceTimersByTime(1001);

            // act
            const result = await cache.getAsync('a');

            // assert
            expect(result).toBe(42);
        });

        it('should preserve stale value when refresh loader returns undefined', async () => {
            // arrange
            let callCount = 0;
            const cache = new MemoryLayeredCache<string, number>(
                async () => {
                    callCount += 1;
                    if (callCount === 1) return 42;
                    return undefined;
                },
                { ttlMs: 1000, staleWhileRevalidate: true },
            );
            await cache.getAsync('k');
            vi.advanceTimersByTime(1001);
            await cache.getAsync('k');
            await vi.advanceTimersByTimeAsync(0);

            // act
            const result = cache.get('k');

            // assert
            expect(result).toBe(42);
        });
    });

    // ──────────────────────────────────────────────────
    // set / setAsync
    // ──────────────────────────────────────────────────

    describe('set', () => {
        it('should store a value retrievable via synchronous get', () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async () => undefined, { ttlMs: 5000 });

            // act
            cache.set('key', 42);

            // assert
            expect(cache.get('key')).toBe(42);
        });
    });

    describe('setAsync', () => {
        it('should store a value retrievable via asynchronous get', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async () => undefined, { ttlMs: 5000 });

            // act
            await cache.setAsync('key', 42);

            // assert
            expect(await cache.getAsync('key')).toBe(42);
        });
    });

    // ──────────────────────────────────────────────────
    // warm
    // ──────────────────────────────────────────────────

    describe('warm', () => {
        it('should return existing cached value without invoking loader again', async () => {
            // arrange
            const loader = vi.fn(async () => 99);
            const cache = new MemoryLayeredCache<string, number>(loader, { ttlMs: 5000 });
            await cache.getAsync('k');

            // act
            const result = await cache.warm('k');

            // assert
            expect(result).toBe(99);
            expect(loader).toHaveBeenCalledTimes(1);
        });

        it('should invoke loader and cache value when key is not present', async () => {
            // arrange
            const loader = vi.fn(async () => 99);
            const cache = new MemoryLayeredCache<string, number>(loader, { ttlMs: 5000 });

            // act
            const result = await cache.warm('k');

            // assert
            expect(result).toBe(99);
            expect(loader).toHaveBeenCalledTimes(1);
        });
    });

    // ──────────────────────────────────────────────────
    // invalidate / invalidateAsync
    // ──────────────────────────────────────────────────

    describe('invalidate', () => {
        it('should remove entry from cache so subsequent get returns undefined', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000 });
            await cache.getAsync('abc');

            // act
            cache.invalidate('abc');

            // assert
            expect(cache.get('abc')).toBeUndefined();
        });
    });

    describe('invalidateAsync', () => {
        it('should remove entry from cache so subsequent get returns undefined', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000 });
            await cache.getAsync('abc');

            // act
            await cache.invalidateAsync('abc');

            // assert
            expect(cache.get('abc')).toBeUndefined();
        });
    });

    // ──────────────────────────────────────────────────
    // LRU eviction
    // ──────────────────────────────────────────────────

    describe('LRU eviction', () => {
        it('should evict oldest entry when maxEntries is exceeded', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000, maxEntries: 2 });
            await cache.getAsync('a');
            await cache.getAsync('bb');

            // act
            cache.set('ccc', 3);

            // assert
            expect(cache.get('a')).toBeUndefined();
            expect(cache.get('bb')).toBe(2);
            expect(cache.get('ccc')).toBe(3);
        });

        it('should promote recently accessed entry and evict least recently used', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000, maxEntries: 2 });
            await cache.getAsync('a');
            await cache.getAsync('bb');
            cache.get('a');

            // act
            cache.set('ccc', 3);

            // assert
            expect(cache.get('a')).toBe(1);
            expect(cache.get('bb')).toBeUndefined();
            expect(cache.get('ccc')).toBe(3);
        });
    });

    // ──────────────────────────────────────────────────
    // statistics
    // ──────────────────────────────────────────────────

    describe('statistics', () => {
        it('should increment hits on successful cache read', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000 });
            await cache.getAsync('a');

            // act
            await cache.getAsync('a');

            // assert
            expect(cache.stats().hits).toBe(1);
        });

        it('should increment misses on cache miss', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000 });

            // act
            await cache.getAsync('a');

            // assert
            expect(cache.stats().misses).toBe(1);
        });

        it('should increment loads on successful load', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000 });

            // act
            await cache.getAsync('a');

            // assert
            expect(cache.stats().loads).toBe(1);
        });

        it('should increment loadErrors on failed load', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(
                async () => {
                    throw new Error('load-fail');
                },
                { ttlMs: 5000 },
            );

            // act
            await cache.getAsync('a');

            // assert
            expect(cache.stats().loadErrors).toBe(1);
        });

        it('should increment evictions when entries are evicted', async () => {
            // arrange
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, { ttlMs: 5000, maxEntries: 1 });
            await cache.getAsync('a');

            // act
            cache.set('b', 2);

            // assert
            expect(cache.stats().evictions).toBe(1);
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
                recordEviction: vi.fn(),
            };
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, {
                ttlMs: 5000,
                metricsRecorder: recorder,
                cacheName: 'test',
            });
            await cache.getAsync('a');

            // act
            await cache.getAsync('a');

            // assert
            expect(recorder.recordHit).toHaveBeenCalledWith('test');
        });

        it('should invoke recordMiss on cache miss', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
                recordEviction: vi.fn(),
            };
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, {
                ttlMs: 5000,
                metricsRecorder: recorder,
                cacheName: 'test',
            });

            // act
            await cache.getAsync('a');

            // assert
            expect(recorder.recordMiss).toHaveBeenCalledWith('test');
        });

        it('should invoke recordLoadSuccess on successful load', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
                recordEviction: vi.fn(),
            };
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, {
                ttlMs: 5000,
                metricsRecorder: recorder,
                cacheName: 'test',
            });

            // act
            await cache.getAsync('a');

            // assert
            expect(recorder.recordLoadSuccess).toHaveBeenCalledWith('test');
        });

        it('should invoke recordLoadError on failed load', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
                recordEviction: vi.fn(),
            };
            const cache = new MemoryLayeredCache<string, number>(
                async () => {
                    throw new Error('load-fail');
                },
                { ttlMs: 5000, metricsRecorder: recorder, cacheName: 'test' },
            );

            // act
            await cache.getAsync('a');

            // assert
            expect(recorder.recordLoadError).toHaveBeenCalledWith('test');
        });

        it('should invoke recordEviction when an entry is evicted', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
                recordEviction: vi.fn(),
            };
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, {
                ttlMs: 5000,
                maxEntries: 1,
                metricsRecorder: recorder,
                cacheName: 'test',
            });
            await cache.getAsync('a');

            // act
            cache.set('b', 2);

            // assert
            expect(recorder.recordEviction).toHaveBeenCalledWith('test');
        });

        it('should use provided cache name in all metrics calls', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
            };
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, {
                ttlMs: 5000,
                metricsRecorder: recorder,
                cacheName: 'custom-name',
            });

            // act
            await cache.getAsync('a');

            // assert
            expect(recorder.recordMiss).toHaveBeenCalledWith('custom-name');
            expect(recorder.recordLoadSuccess).toHaveBeenCalledWith('custom-name');
        });

        it('should default cache name to memory when not provided', async () => {
            // arrange
            const recorder: ICacheMetricsRecorder = {
                recordHit: vi.fn(),
                recordMiss: vi.fn(),
                recordLoadSuccess: vi.fn(),
                recordLoadError: vi.fn(),
            };
            const cache = new MemoryLayeredCache<string, number>(async (key) => key.length, {
                ttlMs: 5000,
                metricsRecorder: recorder,
            });

            // act
            await cache.getAsync('a');

            // assert
            expect(recorder.recordMiss).toHaveBeenCalledWith('memory');
        });
    });
});
