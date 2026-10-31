---
title: '@pixel-brewery/archipel-platform-caching'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-caching

## Classes

| Class                                                      | Description                                                                                                                                                           |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [CachingHealthIndicator](Class.CachingHealthIndicator)     | Health indicator for the caching layer.                                                                                                                               |
| [MemoryLayeredCache](Class.MemoryLayeredCache)             | In-memory layered cache with LRU eviction, TTL expiration and optional stale-while-revalidate support. Falls back to an asynchronous loader function on cache misses. |
| [MemoryWindowedCounter](Class.MemoryWindowedCounter)       | Windowed counter held in the memory of one process.                                                                                                                   |
| [NoopCacheMetricsRecorder](Class.NoopCacheMetricsRecorder) | No-op implementation of [ICacheMetricsRecorder](Interface.ICacheMetricsRecorder) used as the default when no external metrics backend is configured.                  |
| [PostgresWindowedCounter](Class.PostgresWindowedCounter)   | Windowed counter kept in the application's own PostgreSQL database.                                                                                                   |
| [RedisLayeredCache](Class.RedisLayeredCache)               | Redis-backed layered cache implementation. Falls back to an asynchronous loader function when the requested key is not present in Redis.                              |
| [RedisWindowedCounter](Class.RedisWindowedCounter)         | Windowed counter shared by every instance through Redis.                                                                                                              |

## Interfaces

| Interface                                                                    | Description                                                                                                                         |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [ICacheMetricsRecorder](Interface.ICacheMetricsRecorder)                     | Metrics recorder for cache operations. Implementations can forward measurements to Prometheus, OpenTelemetry, or any other backend. |
| [ICacheStats](Interface.ICacheStats)                                         | Cache statistics snapshot returned by cache implementations.                                                                        |
| [ICreateWindowedCounterOptions](Interface.ICreateWindowedCounterOptions)     | Options for [createWindowedCounter](Function.createWindowedCounter).                                                                |
| [ILayeredCache](Interface.ILayeredCache)                                     | Generic layered cache contract supporting synchronous and asynchronous access patterns with optional warm-up and statistics.        |
| [ILayeredCacheOptions](Interface.ILayeredCacheOptions)                       | Configuration options for [MemoryLayeredCache](Class.MemoryLayeredCache).                                                           |
| [IPostgresWindowedCounterOptions](Interface.IPostgresWindowedCounterOptions) | Configuration options for [PostgresWindowedCounter](Class.PostgresWindowedCounter).                                                 |
| [IRedisLayeredCacheOptions](Interface.IRedisLayeredCacheOptions)             | Configuration options for [RedisLayeredCache](Class.RedisLayeredCache).                                                             |
| [IRedisWindowedCounterOptions](Interface.IRedisWindowedCounterOptions)       | Configuration options for [RedisWindowedCounter](Class.RedisWindowedCounter).                                                       |
| [ISqlClient](Interface.ISqlClient)                                           | Minimal contract of a SQL client able to run a parameterized statement.                                                             |
| [IWindowedCounter](Interface.IWindowedCounter)                               | Counts occurrences inside a fixed time window.                                                                                      |
| [IWindowedCounterResult](Interface.IWindowedCounterResult)                   | Result of a windowed counter operation.                                                                                             |

## Variables

| Variable                                                                       | Description                                                                            |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| [CACHE\_DEFAULT\_TTL\_MS](Variable.CACHE_DEFAULT_TTL_MS)                       | Default cache TTL in milliseconds applied when no provider-specific TTL is configured. |
| [CACHE\_MAX\_ENTRIES](Variable.CACHE_MAX_ENTRIES)                              | Maximum number of entries retained in an in-memory cache (LRU limit).                  |
| [CACHE\_STALE\_WHILE\_REVALIDATE](Variable.CACHE_STALE_WHILE_REVALIDATE)       | Whether expired entries are served while a background refresh is in progress.          |
| [PLATFORM\_CACHING\_CONFIG\_ENTRIES](Variable.PLATFORM_CACHING_CONFIG_ENTRIES) | All configuration entries required by `platform-caching`.                              |
| [REDIS\_CONFIG\_ENTRIES](Variable.REDIS_CONFIG_ENTRIES)                        | Configuration entries required by the Redis caching provider.                          |
| [REDIS\_KEY\_PREFIX](Variable.REDIS_KEY_PREFIX)                                | Key prefix applied to all Redis keys managed by the cache instance.                    |
| [REDIS\_TTL\_SECONDS](Variable.REDIS_TTL_SECONDS)                              | TTL in seconds applied to every stored Redis entry.                                    |
| [REDIS\_URL](Variable.REDIS_URL)                                               | Redis connection URL (e.g. `redis://localhost:6379`).                                  |

## Functions

| Function                                                | Description                                                           |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| [createWindowedCounter](Function.createWindowedCounter) | Creates the windowed counter that fits the configured infrastructure. |
