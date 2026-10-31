---
title: 'Function: count()'
generated: true
editUrl: false
---

# Function: count()

```ts
function count<D, A>(args): QueryOperator<D, ReturnType<D['count']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/count.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/count.ts#L13)

**`Beta`**

Counts records via the delegate `count` method.

## Type Parameters

| Type Parameter                                               |
| ------------------------------------------------------------ |
| <a id="type-parameter-d"></a> `D` _extends_ `ICountDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`        |

## Parameters

| Parameter | Type | Description            |
| --------- | ---- | ---------------------- |
| `args`    | `A`  | Prisma count arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"count"`\]\>\>
