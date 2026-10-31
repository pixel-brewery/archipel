---
title: 'Function: query()'
generated: true
editUrl: false
---

# Function: query()

```ts
function query<TDelegate, TResult>(name, run): IRepositoryQuery<TDelegate, TResult>;
```

Defined in: [libs/platform-database/src/repositories/queries/query.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/query.ts#L15)

Creates a new repository query.

## Type Parameters

| Type Parameter                                    |
| ------------------------------------------------- |
| <a id="type-parameter-tdelegate"></a> `TDelegate` |
| <a id="type-parameter-tresult"></a> `TResult`     |

## Parameters

| Parameter | Type                                | Description                       |
| --------- | ----------------------------------- | --------------------------------- |
| `name`    | `string`                            | The name of the query.            |
| `run`     | (`model`) => `Promise`\<`TResult`\> | The function that runs the query. |

## Returns

[`IRepositoryQuery`](Interface.IRepositoryQuery)\<`TDelegate`, `TResult`\>

The repository query.
