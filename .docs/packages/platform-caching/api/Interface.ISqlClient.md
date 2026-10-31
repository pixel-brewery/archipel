---
title: 'Interface: ISqlClient'
generated: true
editUrl: false
---

# Interface: ISqlClient

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L17)

Minimal contract of a SQL client able to run a parameterized statement.

Kept structural on purpose: the counter needs nothing but the ability to execute one statement, so
it works with a Prisma client, a transaction client, or any thin wrapper — and this package stays
free of a database dependency.

## Methods

### $queryRawUnsafe()

```ts
$queryRawUnsafe<TResult>(sql, ...values): Promise<TResult>;
```

Defined in: [libs/platform-caching/src/postgres/PostgresWindowedCounter.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/postgres/PostgresWindowedCounter.ts#L23)

Runs a parameterized SQL statement and returns its rows.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tresult"></a> `TResult` |

#### Parameters

| Parameter   | Type                 |
| ----------- | -------------------- |
| `sql`       | `string`             |
| ...`values` | readonly `unknown`[] |

#### Returns

`Promise`\<`TResult`\>
