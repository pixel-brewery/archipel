---
title: 'Function: aggregateRaw()'
generated: true
editUrl: false
---

# Function: aggregateRaw()

```ts
function aggregateRaw<D>(...args): QueryOperator<D, ReturnType<D['aggregateRaw']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/aggregateRaw.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/aggregateRaw.ts#L15)

**`Beta`**

Executes a raw aggregate query via the delegate `aggregateRaw` method.

**Provider support:** MongoDB only.

## Type Parameters

| Type Parameter                                                      |
| ------------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IAggregateRawDelegate` |

## Parameters

| Parameter | Type                                    | Description                              |
| --------- | --------------------------------------- | ---------------------------------------- |
| ...`args` | `Parameters`\<`D`\[`"aggregateRaw"`\]\> | Prisma aggregateRaw arguments (optional) |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"aggregateRaw"`\]\>\>
