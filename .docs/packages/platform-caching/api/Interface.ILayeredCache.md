---
title: 'Interface: ILayeredCache\<TKey, TValue\>'
generated: true
editUrl: false
---

# Interface: ILayeredCache\<TKey, TValue\>

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L15)

Generic layered cache contract supporting synchronous and asynchronous
access patterns with optional warm-up and statistics.

## Type Parameters

| Type Parameter                              | Description                   |
| ------------------------------------------- | ----------------------------- |
| <a id="type-parameter-tkey"></a> `TKey`     | The type of the cache keys.   |
| <a id="type-parameter-tvalue"></a> `TValue` | The type of the cache values. |

## Methods

### get()

```ts
get(key): TValue | undefined;
```

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L25)

Retrieves a value from the cache synchronously.

#### Parameters

| Parameter | Type   | Description          |
| --------- | ------ | -------------------- |
| `key`     | `TKey` | The key to retrieve. |

#### Returns

`TValue` \| `undefined`

The cached value or `undefined` on a miss.

---

### getAsync()

```ts
getAsync(key): Promise<TValue | undefined>;
```

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L34)

Retrieves a value from the cache asynchronously.

#### Parameters

| Parameter | Type   | Description          |
| --------- | ------ | -------------------- |
| `key`     | `TKey` | The key to retrieve. |

#### Returns

`Promise`\<`TValue` \| `undefined`\>

A promise resolving to the cached value or `undefined` on a miss.

---

### invalidate()

```ts
invalidate(key): void;
```

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L69)

Invalidates a key in the cache synchronously.

#### Parameters

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `key`     | `TKey` | The key to invalidate. |

#### Returns

`void`

---

### invalidateAsync()

```ts
invalidateAsync(key): Promise<void>;
```

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L77)

Invalidates a key in the cache asynchronously.

#### Parameters

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `key`     | `TKey` | The key to invalidate. |

#### Returns

`Promise`\<`void`\>

---

### set()

```ts
set(key, value): void;
```

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L43)

Stores a value in the cache synchronously.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `key`     | `TKey`   | The key to store.   |
| `value`   | `TValue` | The value to store. |

#### Returns

`void`

---

### setAsync()

```ts
setAsync(key, value): Promise<void>;
```

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L52)

Stores a value in the cache asynchronously.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `key`     | `TKey`   | The key to store.   |
| `value`   | `TValue` | The value to store. |

#### Returns

`Promise`\<`void`\>

---

### stats()?

```ts
stats?(): ICacheStats;
```

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:85](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L85)

Returns current cache statistics.

#### Returns

[`ICacheStats`](Interface.ICacheStats)

The cache statistics snapshot.

---

### warm()?

```ts
warm ? key : Promise<TValue | undefined>;
```

Defined in: [libs/platform-caching/src/interfaces/ILayeredCache.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/ILayeredCache.ts#L61)

Proactively warms the cache for a given key.

#### Parameters

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| `key`     | `TKey` | The key to warm. |

#### Returns

`Promise`\<`TValue` \| `undefined`\>

The value that was loaded and cached, or `undefined` if not found.
