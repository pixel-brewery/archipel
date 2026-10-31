---
title: 'Interface: ITransactionalRepositoryQuery\<TResult\>'
generated: true
editUrl: false
---

# Interface: ITransactionalRepositoryQuery\<TResult\>

Defined in: [libs/platform-database/src/repositories/queries/ITransactionalRepositoryQuery.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/ITransactionalRepositoryQuery.ts#L12)

Represents a repository query that requires a Prisma TransactionClient to access multiple delegates.

## Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tresult"></a> `TResult` |

## Properties

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-database/src/repositories/queries/ITransactionalRepositoryQuery.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/ITransactionalRepositoryQuery.ts#L16)

Identifier used for logging.

## Methods

### run()

```ts
run(tx): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/queries/ITransactionalRepositoryQuery.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/ITransactionalRepositoryQuery.ts#L27)

Executes the query with an active transaction client.

#### Parameters

| Parameter | Type                       | Description                |
| --------- | -------------------------- | -------------------------- |
| `tx`      | `Prisma.TransactionClient` | Prisma transaction client. |

#### Returns

`Promise`\<`TResult`\>
