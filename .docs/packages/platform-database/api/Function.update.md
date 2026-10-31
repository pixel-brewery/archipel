---
title: 'Function: update()'
generated: true
editUrl: false
---

# Function: update()

```ts
function update<D, A>(args): QueryOperator<D, ReturnType<D['update']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/update.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/update.ts#L13)

**`Beta`**

Updates a single record via the delegate `update` method.

## Type Parameters

| Type Parameter                                                |
| ------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IUpdateDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`         |

## Parameters

| Parameter | Type | Description             |
| --------- | ---- | ----------------------- |
| `args`    | `A`  | Prisma update arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"update"`\]\>\>
