---
title: 'Function: findManyPaged()'
generated: true
editUrl: false
---

# Function: findManyPaged()

```ts
function findManyPaged<D, A>(page, args?): QueryOperator<D, unknown>;
```

Defined in: [libs/platform-database/src/repositories2/operators/findManyPaged.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/findManyPaged.ts#L15)

**`Beta`**

Finds many records with pagination using the delegate `findMany` method.

## Type Parameters

| Type Parameter                                                  |
| --------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IFindManyDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`           |

## Parameters

| Parameter | Type                                                           | Description                          |
| --------- | -------------------------------------------------------------- | ------------------------------------ |
| `page`    | `Required`\<[`IPaginateOptions`](Interface.IPaginateOptions)\> | Pagination configuration             |
| `args?`   | `A`                                                            | Prisma findMany arguments (optional) |

## Returns

`QueryOperator`\<`D`, `unknown`\>
