---
title: 'Interface: IWindowedCounter'
generated: true
editUrl: false
---

# Interface: IWindowedCounter

Defined in: [libs/platform-caching/src/interfaces/IWindowedCounter.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/IWindowedCounter.ts#L37)

Counts occurrences inside a fixed time window.

A rate limit needs a counter that every instance of an application agrees on. Counting in process
memory silently multiplies the limit by the number of instances, so the limit that was configured
is not the limit that applies. This abstract base hides where the count lives; a shared implementation
makes the configured limit the real one, and the in-memory implementation stays correct for a
single instance.

Windows are fixed and derived from the wall clock: the window an operation falls into is
`floor(now / windowMs)`. That needs no coordination between instances, which is what allows the
shared implementation to be a single atomic operation.

## Methods

### increment()

```ts
increment(
   key,
   windowMs,
   amount?
): Promise<IWindowedCounterResult>;
```

Defined in: [libs/platform-caching/src/interfaces/IWindowedCounter.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/IWindowedCounter.ts#L49)

Adds to the count of the window the current moment falls into.

The increment and the expiry are applied as one operation, so two instances incrementing at the
same moment produce two distinct values and neither can lose the other's write.

#### Parameters

| Parameter  | Type     | Description                                                               |
| ---------- | -------- | ------------------------------------------------------------------------- |
| `key`      | `string` | Identifier of the counted subject, for example a tenant and a limit name. |
| `windowMs` | `number` | Length of the window in milliseconds.                                     |
| `amount?`  | `number` | Amount to add. Defaults to 1.                                             |

#### Returns

`Promise`\<[`IWindowedCounterResult`](Interface.IWindowedCounterResult)\>

---

### peek()

```ts
peek(key, windowMs): Promise<IWindowedCounterResult>;
```

Defined in: [libs/platform-caching/src/interfaces/IWindowedCounter.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/IWindowedCounter.ts#L58)

Reads the current window without changing it.

#### Parameters

| Parameter  | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `key`      | `string` | Identifier of the counted subject.    |
| `windowMs` | `number` | Length of the window in milliseconds. |

#### Returns

`Promise`\<[`IWindowedCounterResult`](Interface.IWindowedCounterResult)\>

---

### reset()

```ts
reset(key, windowMs): Promise<void>;
```

Defined in: [libs/platform-caching/src/interfaces/IWindowedCounter.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/IWindowedCounter.ts#L67)

Discards the current window of a subject.

#### Parameters

| Parameter  | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `key`      | `string` | Identifier of the counted subject.    |
| `windowMs` | `number` | Length of the window in milliseconds. |

#### Returns

`Promise`\<`void`\>
