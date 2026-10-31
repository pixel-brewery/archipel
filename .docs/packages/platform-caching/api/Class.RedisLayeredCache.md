---
title: 'Class: RedisLayeredCache\<TKey, TValue\>'
generated: true
editUrl: false
---

# Class: RedisLayeredCache\<TKey, TValue\>

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L83)

Redis-backed layered cache implementation. Falls back to an asynchronous
loader function when the requested key is not present in Redis.

## Remarks

Synchronous methods (`get`, `set`, `invalidate`) throw because Redis
is inherently asynchronous. Use the `*Async` variants instead.

## Type Parameters

| Type Parameter                              | Description                   |
| ------------------------------------------- | ----------------------------- |
| <a id="type-parameter-tkey"></a> `TKey`     | The type of the cache keys.   |
| <a id="type-parameter-tvalue"></a> `TValue` | The type of the cache values. |

## Implements

- [`ILayeredCache`](Interface.ILayeredCache)\<`TKey`, `TValue`\>
- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new RedisLayeredCache<TKey, TValue>(loadFn, options): RedisLayeredCache<TKey, TValue>;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:108](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L108)

Initializes a new instance of the RedisLayeredCache class.

#### Parameters

| Parameter | Type                                                                           | Description                                         |
| --------- | ------------------------------------------------------------------------------ | --------------------------------------------------- |
| `loadFn`  | (`key`) => `Promise`\<`TValue` \| `undefined`\>                                | Async loader invoked on cache misses.               |
| `options` | [`IRedisLayeredCacheOptions`](Interface.IRedisLayeredCacheOptions)\<`TValue`\> | Redis connection and cache behaviour configuration. |

#### Returns

`RedisLayeredCache`\<`TKey`, `TValue`\>

## Methods

### get()

```ts
get(key): TValue | undefined;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:125](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L125)

Not supported - Redis is inherently asynchronous.

#### Parameters

| Parameter | Type   |
| --------- | ------ |
| `key`     | `TKey` |

#### Returns

`TValue` \| `undefined`

#### Throws

Always throws. Use [getAsync](#getasync) instead.

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`get`](Interface.ILayeredCache#get)

---

### getAsync()

```ts
getAsync(key): Promise<TValue | undefined>;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:130](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L130)

Retrieves a value from the cache asynchronously.

#### Parameters

| Parameter | Type   | Description          |
| --------- | ------ | -------------------- |
| `key`     | `TKey` | The key to retrieve. |

#### Returns

`Promise`\<`TValue` \| `undefined`\>

A promise resolving to the cached value or `undefined` on a miss.

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`getAsync`](Interface.ILayeredCache#getasync)

---

### invalidate()

```ts
invalidate(key): void;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:209](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L209)

Not supported - Redis is inherently asynchronous.

#### Parameters

| Parameter | Type   |
| --------- | ------ |
| `key`     | `TKey` |

#### Returns

`void`

#### Throws

Always throws. Use [invalidateAsync](#invalidateasync) instead.

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`invalidate`](Interface.ILayeredCache#invalidate)

---

### invalidateAsync()

```ts
invalidateAsync(key): Promise<void>;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:214](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L214)

Invalidates a key in the cache asynchronously.

#### Parameters

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `key`     | `TKey` | The key to invalidate. |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`invalidateAsync`](Interface.ILayeredCache#invalidateasync)

---

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:235](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L235)

Gracefully disconnects the Redis client when the NestJS module is destroyed.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### set()

```ts
set(key, value): void;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:183](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L183)

Not supported - Redis is inherently asynchronous.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `TKey`   |
| `value`   | `TValue` |

#### Returns

`void`

#### Throws

Always throws. Use [setAsync](#setasync) instead.

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`set`](Interface.ILayeredCache#set)

---

### setAsync()

```ts
setAsync(key, value): Promise<void>;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:188](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L188)

Stores a value in the cache asynchronously.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `key`     | `TKey`   | The key to store.   |
| `value`   | `TValue` | The value to store. |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`setAsync`](Interface.ILayeredCache#setasync)

---

### stats()

```ts
stats(): ICacheStats;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:223](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L223)

Returns current cache statistics.

#### Returns

[`ICacheStats`](Interface.ICacheStats)

The cache statistics snapshot.

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`stats`](Interface.ILayeredCache#stats)

---

### warm()

```ts
warm(key): Promise<TValue | undefined>;
```

Defined in: [libs/platform-caching/src/redis/RedisLayeredCache.ts:200](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisLayeredCache.ts#L200)

Proactively warms the cache for a given key.

#### Parameters

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| `key`     | `TKey` | The key to warm. |

#### Returns

`Promise`\<`TValue` \| `undefined`\>

The value that was loaded and cached, or `undefined` if not found.

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`warm`](Interface.ILayeredCache#warm)
