---
title: 'Function: findFirstOrThrow()'
generated: true
editUrl: false
---

# Function: findFirstOrThrow()

```ts
function findFirstOrThrow<D, A>(args): QueryOperator<D, ReturnType<D['findFirstOrThrow']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/findFirstOrThrow.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/findFirstOrThrow.ts#L14)

**`Beta`**

Finds the first record matching the criteria via the delegate `findFirstOrThrow` method.
Throws a `PrismaClientKnownRequestError` with code `P2025` if no record is found.

## Type Parameters

| Type Parameter                                                          |
| ----------------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IFindFirstOrThrowDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`                   |

## Parameters

| Parameter | Type | Description                       |
| --------- | ---- | --------------------------------- |
| `args`    | `A`  | Prisma findFirstOrThrow arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"findFirstOrThrow"`\]\>\>
