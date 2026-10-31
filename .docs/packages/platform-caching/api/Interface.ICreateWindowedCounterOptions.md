---
title: 'Interface: ICreateWindowedCounterOptions'
generated: true
editUrl: false
---

# Interface: ICreateWindowedCounterOptions

Defined in: [libs/platform-caching/src/createWindowedCounter.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/createWindowedCounter.ts#L15)

Options for [createWindowedCounter](Function.createWindowedCounter).

## Extends

- `Partial`\<[`IRedisWindowedCounterOptions`](Interface.IRedisWindowedCounterOptions)\>
- `Partial`\<[`IPostgresWindowedCounterOptions`](Interface.IPostgresWindowedCounterOptions)\>

## Properties

### client?

```ts
client?: ISqlClient;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L37)

Client used to run the counting statements.

#### Inherited from

[`IPostgresWindowedCounterOptions`](Interface.IPostgresWindowedCounterOptions).[`client`](Interface.IPostgresWindowedCounterOptions#client)

---

### keyPrefix?

```ts
keyPrefix?: string;
```

Defined in: [libs/platform-caching/src/redis/RedisWindowedCounter.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/redis/RedisWindowedCounter.ts#L27)

Key prefix applied to all Redis keys managed by this counter.

#### Inherited from

[`IRedisWindowedCounterOptions`](Interface.IRedisWindowedCounterOptions).[`keyPrefix`](Interface.IRedisWindowedCounterOptions#keyprefix)

---

### tableName?

```ts
tableName?: string;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L48)

Table holding the counting windows. Defaults to `rate_limit_windows`.

The table belongs to the consuming application, because the schema does. It needs the columns
`key` (text, primary key), `value` (bigint, default 0) and `expiresAt` (timestamp), and benefits
from an index on `expiresAt` for the cleanup.

#### Inherited from

[`IPostgresWindowedCounterOptions`](Interface.IPostgresWindowedCounterOptions).[`tableName`](Interface.IPostgresWindowedCounterOptions#tablename)

---

### url?

```ts
url?: string;
```

Defined in: [libs/platform-caching/src/createWindowedCounter.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/createWindowedCounter.ts#L21)

Redis connection URL. Used when no SQL client is supplied.

#### Overrides

[`IRedisWindowedCounterOptions`](Interface.IRedisWindowedCounterOptions).[`url`](Interface.IRedisWindowedCounterOptions#url)
