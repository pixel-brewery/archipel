---
title: 'Function: remove()'
generated: true
editUrl: false
---

# Function: remove()

```ts
function remove<D, A>(args): QueryOperator<D, ReturnType<D['delete']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/delete.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/delete.ts#L13)

**`Beta`**

Deletes a single record via the delegate `delete` method.

## Type Parameters

| Type Parameter                                                |
| ------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IDeleteDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`         |

## Parameters

| Parameter | Type | Description             |
| --------- | ---- | ----------------------- |
| `args`    | `A`  | Prisma delete arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"delete"`\]\>\>
