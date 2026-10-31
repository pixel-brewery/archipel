---
title: 'Function: findRaw()'
generated: true
editUrl: false
---

# Function: findRaw()

```ts
function findRaw<D>(...args): QueryOperator<D, ReturnType<D['findRaw']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/findRaw.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/findRaw.ts#L15)

**`Beta`**

Executes a raw find query via the delegate `findRaw` method.

**Provider support:** MongoDB only.

## Type Parameters

| Type Parameter                                                 |
| -------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IFindRawDelegate` |

## Parameters

| Parameter | Type                               | Description                         |
| --------- | ---------------------------------- | ----------------------------------- |
| ...`args` | `Parameters`\<`D`\[`"findRaw"`\]\> | Prisma findRaw arguments (optional) |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"findRaw"`\]\>\>
