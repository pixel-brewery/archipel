---
title: 'Function: removeMany()'
generated: true
editUrl: false
---

# Function: removeMany()

```ts
function removeMany<D, A>(args): QueryOperator<D, ReturnType<D['deleteMany']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/deleteMany.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/deleteMany.ts#L13)

**`Beta`**

Deletes multiple records via the delegate `deleteMany` method.

## Type Parameters

| Type Parameter                                                    |
| ----------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IDeleteManyDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`             |

## Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| `args`    | `A`  | Prisma deleteMany arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"deleteMany"`\]\>\>
