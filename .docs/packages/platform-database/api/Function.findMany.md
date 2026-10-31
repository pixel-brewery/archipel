---
title: 'Function: findMany()'
generated: true
editUrl: false
---

# Function: findMany()

```ts
function findMany<D>(...args): QueryOperator<D, ReturnType<D['findMany']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/findMany.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/findMany.ts#L9)

**`Beta`**

Finds many records via the delegate `findMany` method.

## Type Parameters

| Type Parameter                                                                           |
| ---------------------------------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ \{ `findMany`: (...`inner`) => `unknown`; \} |

## Parameters

| Parameter | Type                                | Description                          |
| --------- | ----------------------------------- | ------------------------------------ |
| ...`args` | `Parameters`\<`D`\[`"findMany"`\]\> | Prisma findMany arguments (optional) |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"findMany"`\]\>\>
