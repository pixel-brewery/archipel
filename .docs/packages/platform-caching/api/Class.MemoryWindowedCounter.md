---
title: 'Class: MemoryWindowedCounter'
generated: true
editUrl: false
---

# Class: MemoryWindowedCounter

Defined in: [libs/platform-caching/src/memory/MemoryWindowedCounter.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryWindowedCounter.ts#L18)

Windowed counter held in the memory of one process.

Correct while an application runs as a single instance, and the honest fallback when no shared
store is configured. With several instances each keeps its own count, so the effective limit is
multiplied by the number of instances — use [RedisWindowedCounter](Class.RedisWindowedCounter) there.

## Implements

- [`IWindowedCounter`](Interface.IWindowedCounter)

## Constructors

### Constructor

```ts
new MemoryWindowedCounter(): MemoryWindowedCounter;
```

#### Returns

`MemoryWindowedCounter`

## Methods

### increment()

```ts
increment(
   key,
   windowMs,
   amount?
): Promise<IWindowedCounterResult>;
```

Defined in: [libs/platform-caching/src/memory/MemoryWindowedCounter.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryWindowedCounter.ts#L28)

Adds to the count of the window the current moment falls into.

The increment and the expiry are applied as one operation, so two instances incrementing at the
same moment produce two distinct values and neither can lose the other's write.

#### Parameters

| Parameter  | Type     | Default value | Description                                                               |
| ---------- | -------- | ------------- | ------------------------------------------------------------------------- |
| `key`      | `string` | `undefined`   | Identifier of the counted subject, for example a tenant and a limit name. |
| `windowMs` | `number` | `undefined`   | Length of the window in milliseconds.                                     |
| `amount?`  | `number` | `1`           | Amount to add. Defaults to 1.                                             |

#### Returns

`Promise`\<[`IWindowedCounterResult`](Interface.IWindowedCounterResult)\>

#### Implementation of

[`IWindowedCounter`](Interface.IWindowedCounter).[`increment`](Interface.IWindowedCounter#increment)

---

### peek()

```ts
peek(key, windowMs): Promise<IWindowedCounterResult>;
```

Defined in: [libs/platform-caching/src/memory/MemoryWindowedCounter.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryWindowedCounter.ts#L37)

Reads the current window without changing it.

#### Parameters

| Parameter  | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `key`      | `string` | Identifier of the counted subject.    |
| `windowMs` | `number` | Length of the window in milliseconds. |

#### Returns

`Promise`\<[`IWindowedCounterResult`](Interface.IWindowedCounterResult)\>

#### Implementation of

[`IWindowedCounter`](Interface.IWindowedCounter).[`peek`](Interface.IWindowedCounter#peek)

---

### reset()

```ts
reset(key, windowMs): Promise<void>;
```

Defined in: [libs/platform-caching/src/memory/MemoryWindowedCounter.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/memory/MemoryWindowedCounter.ts#L44)

Discards the current window of a subject.

#### Parameters

| Parameter  | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `key`      | `string` | Identifier of the counted subject.    |
| `windowMs` | `number` | Length of the window in milliseconds. |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWindowedCounter`](Interface.IWindowedCounter).[`reset`](Interface.IWindowedCounter#reset)
