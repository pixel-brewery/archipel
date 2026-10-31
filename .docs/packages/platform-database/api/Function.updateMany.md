---
title: 'Function: updateMany()'
generated: true
editUrl: false
---

# Function: updateMany()

```ts
function updateMany<D, A>(args): QueryOperator<D, ReturnType<D['updateMany']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/updateMany.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/updateMany.ts#L13)

**`Beta`**

Updates multiple records via the delegate `updateMany` method.

## Type Parameters

| Type Parameter                                                    |
| ----------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IUpdateManyDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`             |

## Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| `args`    | `A`  | Prisma updateMany arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"updateMany"`\]\>\>
