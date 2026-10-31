---
title: 'Interface: IRedisWindowedCounterOptions'
generated: true
editUrl: false
---

# Interface: IRedisWindowedCounterOptions

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L14)

Configuration options for [RedisWindowedCounter](Class.RedisWindowedCounter).

## Properties

### keyPrefix?

```ts
keyPrefix?: string;
```

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L27)

Key prefix applied to all Redis keys managed by this counter.

---

### url

```ts
url: string;
```

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L20)

Redis connection URL (e.g. `redis://localhost:6379`).
