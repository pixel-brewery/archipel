---
title: 'Class: RedisWindowedCounter'
generated: true
editUrl: false
---

# Class: RedisWindowedCounter

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L43)

Windowed counter shared by every instance through Redis.

The increment and its expiry are issued as one pipeline, and `INCRBY` is atomic, so concurrent
instances cannot lose each other's writes. The expiry is set without overwriting an existing one,
which keeps the window anchored to its first increment instead of sliding forward with every call.

A failing store must not become a way past the limit: an error is reported to the caller rather
than answered with a count of zero.

## Implements

- [`IWindowedCounter`](Interface.IWindowedCounter)
- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new RedisWindowedCounter(options): RedisWindowedCounter;
```

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L58)

Initializes a new instance of the RedisWindowedCounter class.

#### Parameters

| Parameter | Type                                                                     | Description                     |
| --------- | ------------------------------------------------------------------------ | ------------------------------- |
| `options` | [`IRedisWindowedCounterOptions`](Interface.IRedisWindowedCounterOptions) | Redis connection configuration. |

#### Returns

`RedisWindowedCounter`

## Methods

### increment()

```ts
increment(
   key,
   windowMs,
   amount?
): Promise<IWindowedCounterResult>;
```

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L67)

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

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L97)

Closes the Redis connection when the module is destroyed.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### peek()

```ts
peek(key, windowMs): Promise<IWindowedCounterResult>;
```

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L80)

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

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L88)

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
