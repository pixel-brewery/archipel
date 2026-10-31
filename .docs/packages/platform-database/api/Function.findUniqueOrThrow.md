---
title: 'Function: findUniqueOrThrow()'
generated: true
editUrl: false
---

# Function: findUniqueOrThrow()

```ts
function findUniqueOrThrow<D, A>(args): QueryOperator<D, ReturnType<D['findUniqueOrThrow']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/findUniqueOrThrow.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/findUniqueOrThrow.ts#L14)

**`Beta`**

Finds a unique record via the delegate `findUniqueOrThrow` method.
Throws a `PrismaClientKnownRequestError` with code `P2025` if no record is found.

## Type Parameters

| Type Parameter                                                           |
| ------------------------------------------------------------------------ |
| <a id="type-parameter-d"></a> `D` _extends_ `IFindUniqueOrThrowDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`                    |

## Parameters

| Parameter | Type | Description                        |
| --------- | ---- | ---------------------------------- |
| `args`    | `A`  | Prisma findUniqueOrThrow arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"findUniqueOrThrow"`\]\>\>
