# @pixel-brewery/archipel-platform-caching

Layered caching infrastructure for NestJS with in-memory LRU+TTL+SWR and optional Redis-backed implementations, plus a windowed counter for rate limiting across instances.

## Features

- **In-memory LRU cache** — `MemoryLayeredCache` with TTL, max entries, and stale-while-revalidate
- **Redis cache** — `RedisLayeredCache` for distributed caching via `ioredis`
- **Layered architecture** — Consistent API across memory and Redis implementations
- **Tree-shakable** — Redis support in separate sub-export to avoid bundling `ioredis` when not needed
- **Windowed counter** — `IWindowedCounter` counts occurrences in a fixed time window; `MemoryWindowedCounter` for a single process, `PostgresWindowedCounter` for a count shared through the application database, `RedisWindowedCounter` for one shared through Redis
- **Health checks** — `CachingHealthIndicator` for readiness probes (separate `/health` subpath)

## ⚠️ Environment Variables

### Core (optional)

| Variable                       | Required | Default | Description                                                  |
| ------------------------------ | -------- | ------- | ------------------------------------------------------------ |
| `CACHE_DEFAULT_TTL_MS`         | no       | -       | Default cache TTL in milliseconds                            |
| `CACHE_MAX_ENTRIES`            | no       | -       | Maximum number of entries retained in an in-memory cache     |
| `CACHE_STALE_WHILE_REVALIDATE` | no       | `false` | Whether expired entries are served during background refresh |

### Redis provider

| Variable            | Required | Default | Description                         |
| ------------------- | -------- | ------- | ----------------------------------- |
| `REDIS_URL`         | yes      | -       | Redis connection URL                |
| `REDIS_KEY_PREFIX`  | no       | `''`    | Key prefix for all Redis cache keys |
| `REDIS_TTL_SECONDS` | no       | -       | TTL in seconds for Redis entries    |

## Quick Start

```typescript
import { MemoryLayeredCache } from '@pixel-brewery/archipel-platform-caching';

const cache = new MemoryLayeredCache<string, number>(async (key) => fetchFromDatabase(key), {
    ttlMs: 60_000,
    maxEntries: 1000,
});
```

### Windowed counter

A rate limit needs a counter every instance agrees on. Counting in process memory multiplies the
limit by the number of instances, so the limit that was configured is not the limit that applies.
`createWindowedCounter` picks the implementation from the configuration, which keeps that decision
out of the feature that counts:

```typescript
import { createWindowedCounter } from '@pixel-brewery/archipel-platform-caching';

// Shared across instances when a store is configured, process-local otherwise.
// A SQL client wins over a Redis URL: an application that has a database always has one.
const counter = createWindowedCounter({ client: prisma, keyPrefix: 'rate:' });

const { value, resetAt } = await counter.increment(`tenant-${tenantId}:ai-requests`, 60_000);

if (value > requestsPerMinute) {
    throw new TooManyRequestsException(resetAt);
}
```

Windows are fixed and derived from the wall clock — the window an operation falls into is
`floor(now / windowMs)`. No instance has to coordinate with another to agree on the current window,
which is what allows the shared implementation to be a single atomic operation (`INCRBY` plus
`PEXPIRE … NX` in one pipeline, so an existing window is never extended by a later call).

A failing shared store makes `increment` throw rather than answer with a count of zero: an outage
must not become a way past the limit. `peek` reads without counting the read, and `reset` discards
the current window.

The PostgreSQL implementation counts in a table the consuming application owns, because the schema
does. It defaults to `rate_limit_windows` and needs three columns:

```sql
CREATE TABLE "rate_limit_windows" (
    "key"       TEXT NOT NULL PRIMARY KEY,
    "value"     BIGINT NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "rate_limit_windows_expiresAt_idx" ON "rate_limit_windows" ("expiresAt");
```

The increment is one `INSERT … ON CONFLICT DO UPDATE`, so it costs a single round trip and stays
atomic under concurrency. Expired rows are never written to again — a later increment lands on a new
key — so `removeExpiredWindows()` is pure housekeeping: safe to repeat, safe to skip, and it can
never change a limit that is in force.

| Method                              | Purpose                                              |
| ----------------------------------- | ---------------------------------------------------- |
| `increment(key, windowMs, amount?)` | Adds to the current window and returns the new count |
| `peek(key, windowMs)`               | Reads the current window without changing it         |
| `reset(key, windowMs)`              | Discards the current window                          |

## Import Options

```typescript
// Main import (in-memory)
import { MemoryLayeredCache } from '@pixel-brewery/archipel-platform-caching';

// In-memory counter and the factory that chooses the implementation
import { createWindowedCounter, MemoryWindowedCounter } from '@pixel-brewery/archipel-platform-caching';

// PostgreSQL counter (also exported from the main entry point)
import { PostgresWindowedCounter } from '@pixel-brewery/archipel-platform-caching/postgres';

// Redis (tree-shakable sub-export)
import { RedisLayeredCache, RedisWindowedCounter } from '@pixel-brewery/archipel-platform-caching/redis';

// Health indicator (optional)
import { CachingHealthIndicator } from '@pixel-brewery/archipel-platform-caching/health';
```

## Lifecycle

- **Shutdown (`OnModuleDestroy`):** `RedisLayeredCache` and `RedisWindowedCounter` disconnect from Redis gracefully.

## Peer Dependencies

| Package                                          | Required | Notes                                              |
| ------------------------------------------------ | -------- | -------------------------------------------------- |
| `@pixel-brewery/archipel-platform-configuration` | Yes      | Typed config key support                           |
| `@nestjs/common`                                 | Yes      | NestJS core                                        |
| `ioredis`                                        | No       | Required for the Redis cache and the Redis counter |
| `@pixel-brewery/archipel-platform-health`        | No       | Required for health indicator                      |
| `@nestjs/terminus`                               | No       | Required for health indicator                      |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-caching/index.md`](../../.docs/packages/platform-caching/index.md)

## Development

```bash
# Build
yarn nx build platform-caching

# Test
yarn nx test platform-caching

# Lint
yarn nx lint platform-caching
```
