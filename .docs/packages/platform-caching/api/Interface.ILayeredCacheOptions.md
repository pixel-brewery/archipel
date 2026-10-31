---
title: 'Interface: ILayeredCacheOptions'
generated: true
editUrl: false
---

# Interface: ILayeredCacheOptions

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L16)

Configuration options for [MemoryLayeredCache](Class.MemoryLayeredCache).

## Properties

### cacheName?

```ts
cacheName?: string;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L57)

An optional name / label for the cache instance, used in metrics.
Defaults to `'memory'`.

---

### maxEntries?

```ts
maxEntries?: number;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L41)

Maximum number of entries retained in the cache. Oldest entries are
evicted first (LRU). Defaults to infinite.

---

### metricsRecorder?

```ts
metricsRecorder?: ICacheMetricsRecorder;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L49)

Optional metrics recorder forwarded cache operation statistics.
Falls back to [NoopCacheMetricsRecorder](Class.NoopCacheMetricsRecorder) when omitted.

---

### staleWhileRevalidate?

```ts
staleWhileRevalidate?: boolean;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L33)

When `true`, expired entries are served immediately while a background
refresh is triggered. Defaults to `false`.

---

### ttlMs?

```ts
ttlMs?: number;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L25)

Time to live in milliseconds. Entries older than this are considered expired.
Defaults to infinite (no expiration).
