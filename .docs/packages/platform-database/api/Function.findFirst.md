---
title: 'Function: findFirst()'
generated: true
editUrl: false
---

# Function: findFirst()

```ts
function findFirst<D, A>(args): QueryOperator<D, ReturnType<D['findFirst']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/findFirst.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/findFirst.ts#L14)

**`Beta`**

Creates an operator that executes a `findFirst` query with the provided arguments.

## Type Parameters

| Type Parameter                                                   |
| ---------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IFindFirstDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`            |

## Parameters

| Parameter | Type | Description                |
| --------- | ---- | -------------------------- |
| `args`    | `A`  | Prisma findFirst arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"findFirst"`\]\>\>

Operator yielding the record or null
