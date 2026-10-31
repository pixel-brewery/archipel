---
title: 'Interface: IRepositoryDatabase'
generated: true
editUrl: false
---

# Interface: IRepositoryDatabase

Defined in: [libs/platform-database/src/types/IRepositoryDatabase.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/types/IRepositoryDatabase.ts#L17)

Minimal database contract required by [RepositoryBase](Class.RepositoryBase).

## Remarks

Applications can provide their own Prisma client wrapper without extending
[DatabaseService](Class.DatabaseService). The implementation only needs to expose callback
transactions with Prisma's transaction client.

## Methods

### transactionCallback()

```ts
transactionCallback<TResult>(callback): Promise<TResult>;
```

Defined in: [libs/platform-database/src/types/IRepositoryDatabase.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/types/IRepositoryDatabase.ts#L24)

Executes a callback in a Prisma transaction.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tresult"></a> `TResult` |

#### Parameters

| Parameter  | Type                                      | Description                                         |
| ---------- | ----------------------------------------- | --------------------------------------------------- |
| `callback` | (`transaction`) => `Promise`\<`TResult`\> | Work to execute with the active transaction client. |

#### Returns

`Promise`\<`TResult`\>

The callback result.
