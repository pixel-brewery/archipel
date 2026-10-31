import { describe, expect, it, vi } from 'vitest';
import { createWindowedCounter } from './createWindowedCounter.js';
import { MemoryWindowedCounter } from './memory/MemoryWindowedCounter.js';
import { RedisWindowedCounter } from './redis/RedisWindowedCounter.js';

vi.mock('ioredis', () => {
    class MockRedis {
        public multi = vi.fn();
        public get = vi.fn();
        public del = vi.fn();
        public quit = vi.fn();
    }

    return { default: MockRedis, Redis: MockRedis };
});

describe('createWindowedCounter', () => {
    it('shares the count through the configured store', () => {
        expect(createWindowedCounter({ url: 'redis://localhost:6379' })).toBeInstanceOf(RedisWindowedCounter);
    });

    it('stays in process memory when no shared store is configured', () => {
        expect(createWindowedCounter()).toBeInstanceOf(MemoryWindowedCounter);
        expect(createWindowedCounter({ url: '' })).toBeInstanceOf(MemoryWindowedCounter);
    });
});
