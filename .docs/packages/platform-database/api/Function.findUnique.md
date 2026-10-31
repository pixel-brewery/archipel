---
title: 'Function: findUnique()'
generated: true
editUrl: false
---

# Function: findUnique()

```ts
function findUnique<D>(...args): QueryOperator<D, ReturnType<D['findUnique']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/findUnique.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/findUnique.ts#L9)

**`Beta`**

Finds a unique record via the delegate `findUnique` method.

## Type Parameters

| Type Parameter                                                                             |
| ------------------------------------------------------------------------------------------ |
| <a id="type-parameter-d"></a> `D` _extends_ \{ `findUnique`: (...`inner`) => `unknown`; \} |

## Parameters

| Parameter | Type                                  | Description                 |
| --------- | ------------------------------------- | --------------------------- |
| ...`args` | `Parameters`\<`D`\[`"findUnique"`\]\> | Prisma findUnique arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"findUnique"`\]\>\>
