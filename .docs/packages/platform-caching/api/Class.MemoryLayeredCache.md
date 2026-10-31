---
title: 'Class: MemoryLayeredCache\<TKey, TValue\>'
generated: true
editUrl: false
---

# Class: MemoryLayeredCache\<TKey, TValue\>

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:72](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L72)

In-memory layered cache with LRU eviction, TTL expiration and
optional stale-while-revalidate support. Falls back to an
asynchronous loader function on cache misses.

## Type Parameters

| Type Parameter                              | Description                   |
| ------------------------------------------- | ----------------------------- |
| <a id="type-parameter-tkey"></a> `TKey`     | The type of the cache keys.   |
| <a id="type-parameter-tvalue"></a> `TValue` | The type of the cache values. |

## Implements

- [`ILayeredCache`](Interface.ILayeredCache)\<`TKey`, `TValue`\>

## Constructors

### Constructor

```ts
new MemoryLayeredCache<TKey, TValue>(loadFn, options?): MemoryLayeredCache<TKey, TValue>;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L97)

Initializes a new instance of the MemoryLayeredCache class.

#### Parameters

| Parameter  | Type                                                     | Description                                      |
| ---------- | -------------------------------------------------------- | ------------------------------------------------ |
| `loadFn`   | (`key`) => `Promise`\<`TValue` \| `undefined`\>          | Async loader invoked on cache misses.            |
| `options?` | [`ILayeredCacheOptions`](Interface.ILayeredCacheOptions) | Optional configuration for TTL, LRU and metrics. |

#### Returns

`MemoryLayeredCache`\<`TKey`, `TValue`\>

## Methods

### get()

```ts
get(key): TValue | undefined;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:109](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L109)

Retrieves a value from the cache synchronously.

#### Parameters

| Parameter | Type   | Description          |
| --------- | ------ | -------------------- |
| `key`     | `TKey` | The key to retrieve. |

#### Returns

`TValue` \| `undefined`

The cached value or `undefined` on a miss.

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`get`](Interface.ILayeredCache#get)

---

### getAsync()

```ts
getAsync(key): Promise<TValue | undefined>;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:130](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L130)

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

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:176](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L176)

Invalidates a key in the cache synchronously.

#### Parameters

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `key`     | `TKey` | The key to invalidate. |

#### Returns

`void`

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`invalidate`](Interface.ILayeredCache#invalidate)

---

### invalidateAsync()

```ts
invalidateAsync(key): Promise<void>;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:181](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L181)

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

### set()

```ts
set(key, value): void;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:152](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L152)

Stores a value in the cache synchronously.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `key`     | `TKey`   | The key to store.   |
| `value`   | `TValue` | The value to store. |

#### Returns

`void`

#### Implementation of

[`ILayeredCache`](Interface.ILayeredCache).[`set`](Interface.ILayeredCache#set)

---

### setAsync()

```ts
setAsync(key, value): Promise<void>;
```

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:161](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L161)

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

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:186](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L186)

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

Defined in: [libs/platform-caching/src/memory/MemoryLayeredCache.ts:170](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryLayeredCache.ts#L170)

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
