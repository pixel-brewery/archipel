---
title: 'Class: PostgresWindowedCounter'
generated: true
editUrl: false
---

# Class: PostgresWindowedCounter

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L73)

Windowed counter kept in the application's own PostgreSQL database.

For a deployment without a shared cache the database is the only store every instance already
shares. Counting in process memory would multiply each limit by the number of running instances,
so the configured limit would not be the effective one and would grow silently with every instance
added.

The increment is a single `INSERT … ON CONFLICT DO UPDATE`, which PostgreSQL applies atomically:
concurrent instances cannot lose each other's writes, and no read-modify-write round trip is
needed. The expiry is written only by the insert, so a busy window still ends when it was due.

## Implements

- [`IWindowedCounter`](Interface.IWindowedCounter)

## Constructors

### Constructor

```ts
new PostgresWindowedCounter(options): PostgresWindowedCounter;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:89](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L89)

Initializes a new instance of the PostgresWindowedCounter class.

#### Parameters

| Parameter | Type                                                                           | Description                          |
| --------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| `options` | [`IPostgresWindowedCounterOptions`](Interface.IPostgresWindowedCounterOptions) | Client, table and key configuration. |

#### Returns

`PostgresWindowedCounter`

## Methods

### increment()

```ts
increment(
   key,
   windowMs,
   amount?
): Promise<IWindowedCounterResult>;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:100](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L100)

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

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:116](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L116)

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

### removeExpiredWindows()

```ts
removeExpiredWindows(now?): Promise<void>;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:139](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L139)

Removes windows whose time has passed.

An expired window is never written to again — a later increment lands on a new key — so removing
it changes no limit and only frees space. Safe to repeat and safe to skip.

#### Parameters

| Parameter | Type   | Description                                                          |
| --------- | ------ | -------------------------------------------------------------------- |
| `now?`    | `Date` | Moment the expiry is compared against. Defaults to the current time. |

#### Returns

`Promise`\<`void`\>

---

### reset()

```ts
reset(key, windowMs): Promise<void>;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:126](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L126)

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
