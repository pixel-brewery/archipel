---
title: Caching
description: Add layered caching to your NestJS application with in-memory LRU and Redis-backed implementations, TTL expiration, stale-while-revalidate, and metrics.
order: 16
---

# Caching

This guide covers layered caching with `platform-caching`: choosing between in-memory and Redis backends, configuring TTL and LRU eviction, using stale-while-revalidate for low-latency reads, and integrating cache metrics with your observability stack.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-caching
```

For Redis-backed caching, also install `ioredis`:

```bash
yarn add ioredis
```

---

## Configuration

### Core Variables

```dotenv
CACHE_DEFAULT_TTL_MS=60000
CACHE_MAX_ENTRIES=1000
CACHE_STALE_WHILE_REVALIDATE=false
```

All core variables are optional. When omitted, each cache instance uses the values passed directly to its constructor options.

### Redis Variables

```dotenv
REDIS_URL=redis://localhost:6379
REDIS_KEY_PREFIX=app:
REDIS_TTL_SECONDS=300
```

`REDIS_URL` is required when using `RedisLayeredCache`. The other variables are optional.

### Using Config Keys

Import the typed config keys and pass them to your module registration:

```typescript
import { PLATFORM_CACHING_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-caching';
import { REDIS_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-caching/redis';
```

---

## Concepts

`platform-caching` provides a generic `ILayeredCache<TKey, TValue>` interface with two implementations:

| Implementation       | Backend   | Sync support | Best for                                 |
| -------------------- | --------- | ------------ | ---------------------------------------- |
| `MemoryLayeredCache` | In-memory | Yes          | Single-instance apps, fast local lookups |
| `RedisLayeredCache`  | Redis     | No (async)   | Multi-instance deployments, shared state |

Both implementations use a **loader function** pattern: when a cache miss occurs, the cache automatically calls a user-provided async function to load the value, stores it, and returns it. This eliminates repetitive "check cache → miss → load → store" boilerplate.

---

## In-Memory Cache

### Basic Setup

Create a `MemoryLayeredCache` with a loader function that fetches the value on cache misses:

```typescript
import { Injectable } from '@nestjs/common';
import { MemoryLayeredCache } from '@pixel-brewery/archipel-platform-caching';

@Injectable()
export class ProductCacheService {
    private readonly _cache: MemoryLayeredCache<string, IProduct>;

    constructor(productRepository: ProductRepository) {
        this._cache = new MemoryLayeredCache<string, IProduct>(async (productId: string) => productRepository.findById(productId));
    }

    public async getProduct(productId: string): Promise<IProduct | undefined> {
        return this._cache.getAsync(productId);
    }

    public invalidateProduct(productId: string): void {
        this._cache.invalidate(productId);
    }
}
```

### TTL Expiration

Set a time-to-live so entries automatically expire:

```typescript
this._cache = new MemoryLayeredCache<string, IProduct>(
    async (id) => productRepository.findById(id),
    { ttlMs: 60_000 }, // entries expire after 60 seconds
);
```

### LRU Eviction

Limit the number of entries to prevent unbounded memory growth. The oldest entry (least recently used) is evicted first:

```typescript
this._cache = new MemoryLayeredCache<string, IProduct>(async (id) => productRepository.findById(id), {
    ttlMs: 300_000, // 5-minute TTL
    maxEntries: 1000, // keep at most 1000 entries
});
```

### Stale-While-Revalidate

Serve expired entries immediately while refreshing in the background. This keeps latency low for frequently accessed data:

```typescript
this._cache = new MemoryLayeredCache<string, IProduct>(async (id) => productRepository.findById(id), {
    ttlMs: 30_000,
    staleWhileRevalidate: true, // return stale value, refresh async
});
```

> **When to use:** Quasi-static reference data (categories, feature flags, configuration). Avoid for personalized or rapidly changing data where freshness is critical.

### Synchronous Access

`MemoryLayeredCache` supports synchronous `get()` and `set()` for cases where you've pre-warmed the cache or need zero-await lookups:

```typescript
// Pre-warm on startup
await this._cache.warm('featured-product');

// Later: synchronous read (no await needed)
const product = this._cache.get('featured-product');
```

---

## Redis Cache

### Basic Setup

`RedisLayeredCache` provides the same `ILayeredCache` interface but stores entries in Redis. Synchronous methods (`get`, `set`, `invalidate`) throw — use the async variants.

```typescript
import { Injectable } from '@nestjs/common';
import { RedisLayeredCache } from '@pixel-brewery/archipel-platform-caching/redis';

@Injectable()
export class SessionCacheService {
    private readonly _cache: RedisLayeredCache<string, ISessionData>;

    constructor(sessionRepository: SessionRepository) {
        this._cache = new RedisLayeredCache<string, ISessionData>(async (sessionId) => sessionRepository.findById(sessionId), {
            url: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
            keyPrefix: 'session:',
            ttlSeconds: 3600, // 1-hour TTL
        });
    }

    public async getSession(sessionId: string): Promise<ISessionData | undefined> {
        return this._cache.getAsync(sessionId);
    }

    public async invalidateSession(sessionId: string): Promise<void> {
        await this._cache.invalidateAsync(sessionId);
    }
}
```

### Custom Serialization

By default, values are serialized with `JSON.stringify` and deserialized with `JSON.parse`. Override this for custom formats:

```typescript
this._cache = new RedisLayeredCache<string, ISessionData>(async (id) => sessionRepository.findById(id), {
    url: 'redis://localhost:6379',
    keyPrefix: 'session:',
    serialize: (value) => msgpack.encode(value).toString('base64'),
    deserialize: (raw) => msgpack.decode(Buffer.from(raw, 'base64')) as ISessionData,
});
```

### Graceful Shutdown

`RedisLayeredCache` implements `OnModuleDestroy` and automatically disconnects the Redis client when the NestJS module is destroyed. No manual cleanup is needed.

---

## Cache Metrics

Both implementations accept an optional `ICacheMetricsRecorder` to forward cache statistics to your observability backend.

### Implementing a Metrics Recorder

```typescript
import type { ICacheMetricsRecorder } from '@pixel-brewery/archipel-platform-caching';
import { TelemetryFacade } from '@pixel-brewery/archipel-platform-telemetry';

export class TelemetryCacheMetricsRecorder implements ICacheMetricsRecorder {
    private readonly _telemetry: TelemetryFacade;

    constructor(telemetry: TelemetryFacade) {
        this._telemetry = telemetry;
    }

    public recordHit(cache: string): void {
        this._telemetry.recordCounter('cache_hits_total', 1, { cache });
    }

    public recordMiss(cache: string): void {
        this._telemetry.recordCounter('cache_misses_total', 1, { cache });
    }

    public recordLoadSuccess(cache: string): void {
        this._telemetry.recordCounter('cache_load_success_total', 1, { cache });
    }

    public recordLoadError(cache: string): void {
        this._telemetry.recordCounter('cache_load_error_total', 1, { cache });
    }

    public recordEviction(cache: string): void {
        this._telemetry.recordCounter('cache_evictions_total', 1, { cache });
    }
}
```

### Wiring It Up

Pass the recorder when creating the cache:

```typescript
this._cache = new MemoryLayeredCache<string, IProduct>(async (id) => productRepository.findById(id), {
    ttlMs: 60_000,
    maxEntries: 500,
    metricsRecorder: new TelemetryCacheMetricsRecorder(telemetry),
    cacheName: 'products',
});
```

When no metrics recorder is provided, a `NoopCacheMetricsRecorder` is used automatically — no setup needed.

---

## Cache Statistics

Both implementations expose a `stats()` method returning a snapshot of cache performance:

```typescript
const stats = this._cache.stats();
console.log(stats.hits); // total cache hits
console.log(stats.misses); // total cache misses
console.log(stats.loads); // successful loader invocations
console.log(stats.loadErrors); // failed loader invocations
console.log(stats.evictions); // LRU evictions (MemoryLayeredCache only)
```

Use this for health checks or debug endpoints.

---

## Best Practices

| Practice                                  | Why                                                                |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Set `maxEntries` for in-memory caches     | Prevents unbounded memory growth in long-running processes         |
| Use `staleWhileRevalidate` for read-heavy | Keeps p99 latency low for popular keys                             |
| Invalidate on writes                      | Call `invalidate(key)` after mutations to avoid serving stale data |
| Use `cacheName` labels                    | Makes metrics dashboards filterable by cache instance              |
| Keep TTLs short for user-specific data    | Personalized data should not be stale for extended periods         |
| Use Redis for multi-instance deployments  | In-memory caches are not shared across application instances       |
