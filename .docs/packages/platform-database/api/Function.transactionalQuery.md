---
title: 'Function: transactionalQuery()'
generated: true
editUrl: false
---

# Function: transactionalQuery()

```ts
function transactionalQuery<TResult>(name, run): ITransactionalRepositoryQuery<TResult>;
```

Defined in: [libs/platform-database/src/repositories/queries/transactionalQuery.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/transactionalQuery.ts#L11)

Factory to create a transactional repository query.

## Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tresult"></a> `TResult` |

## Parameters

| Parameter | Type                             |
| --------- | -------------------------------- |
| `name`    | `string`                         |
| `run`     | (`tx`) => `Promise`\<`TResult`\> |

## Returns

[`ITransactionalRepositoryQuery`](Interface.ITransactionalRepositoryQuery)\<`TResult`\>
