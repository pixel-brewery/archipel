---
title: 'Interface: IPostgresWindowedCounterOptions'
generated: true
editUrl: false
---

# Interface: IPostgresWindowedCounterOptions

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L31)

Configuration options for [PostgresWindowedCounter](Class.PostgresWindowedCounter).

## Properties

### client

```ts
client: ISqlClient;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L37)

Client used to run the counting statements.

---

### keyPrefix?

```ts
keyPrefix?: string;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L55)

Prefix applied to every key, to keep these rows apart from other counters in the same table.

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
