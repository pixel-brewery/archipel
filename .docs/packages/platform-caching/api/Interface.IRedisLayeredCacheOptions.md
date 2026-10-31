---
title: 'Interface: IRedisLayeredCacheOptions\<TValue\>'
generated: true
editUrl: false
---

# Interface: IRedisLayeredCacheOptions\<TValue\>

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L18)

Configuration options for [RedisLayeredCache](Class.RedisLayeredCache).

## Type Parameters

| Type Parameter                              | Description                              |
| ------------------------------------------- | ---------------------------------------- |
| <a id="type-parameter-tvalue"></a> `TValue` | The type of values stored in this cache. |

## Properties

### cacheName?

```ts
cacheName?: string;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L67)

An optional name / label for the cache instance, used in metrics.
Defaults to `'redis'`.

---

### deserialize?

```ts
deserialize?: (raw) => TValue;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L52)

Custom deserialization function. Defaults to `JSON.parse`.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `raw`     | `string` |

#### Returns

`TValue`

---

### keyPrefix

```ts
keyPrefix: string;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L31)

Key prefix applied to all Redis keys managed by this cache instance.

---

### metricsRecorder?

```ts
metricsRecorder?: ICacheMetricsRecorder;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L59)

Optional metrics recorder forwarded cache operation statistics.

---

### serialize?

```ts
serialize?: (value) => string;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L45)

Custom serialization function. Defaults to `JSON.stringify`.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `value`   | `TValue` |

#### Returns

`string`

---

### ttlSeconds?

```ts
ttlSeconds?: number;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L38)

Optional TTL in seconds applied to every stored entry.

---

### url

```ts
url: string;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L24)

Redis connection URL (e.g. `redis://localhost:6379`).
