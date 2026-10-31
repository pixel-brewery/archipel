---
title: 'Function: updateManyAndReturn()'
generated: true
editUrl: false
---

# Function: updateManyAndReturn()

```ts
function updateManyAndReturn<D, A>(args): QueryOperator<D, ReturnType<D['updateManyAndReturn']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/updateManyAndReturn.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/updateManyAndReturn.ts#L15)

**`Beta`**

Updates multiple records and returns them via the delegate `updateManyAndReturn` method.

**Provider support:** PostgreSQL, CockroachDB, SQLite only.

## Type Parameters

| Type Parameter                                                             |
| -------------------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IUpdateManyAndReturnDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`                      |

## Parameters

| Parameter | Type | Description                          |
| --------- | ---- | ------------------------------------ |
| `args`    | `A`  | Prisma updateManyAndReturn arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"updateManyAndReturn"`\]\>\>
