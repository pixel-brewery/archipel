---
title: 'Function: upsert()'
generated: true
editUrl: false
---

# Function: upsert()

```ts
function upsert<D, A>(args): QueryOperator<D, ReturnType<D['upsert']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/upsert.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/upsert.ts#L13)

**`Beta`**

Creates or updates a record via the delegate `upsert` method.

## Type Parameters

| Type Parameter                                                |
| ------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IUpsertDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`         |

## Parameters

| Parameter | Type | Description             |
| --------- | ---- | ----------------------- |
| `args`    | `A`  | Prisma upsert arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"upsert"`\]\>\>
