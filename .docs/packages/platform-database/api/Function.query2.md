---
title: 'Function: query2()'
generated: true
editUrl: false
---

# Function: query2()

```ts
function query2<TDelegate, TRun, TResult>(name, run): IRepositoryQuery2<TDelegate, TRun>;
```

Defined in: [libs/platform-database/src/repositories2/queries/query2.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/queries/query2.ts#L15)

Creates a new repository query.

## Type Parameters

| Type Parameter                                                              |
| --------------------------------------------------------------------------- |
| <a id="type-parameter-tdelegate"></a> `TDelegate`                           |
| <a id="type-parameter-trun"></a> `TRun` _extends_ (`delegate`) => `TResult` |
| <a id="type-parameter-tresult"></a> `TResult`                               |

## Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `name`    | `string` | The name of the query.            |
| `run`     | `TRun`   | The function that runs the query. |

## Returns

[`IRepositoryQuery2`](Interface.IRepositoryQuery2)\<`TDelegate`, `TRun`\>

The repository query.
