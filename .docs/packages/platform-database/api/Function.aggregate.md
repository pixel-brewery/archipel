---
title: 'Function: aggregate()'
generated: true
editUrl: false
---

# Function: aggregate()

```ts
function aggregate<D, A>(args): QueryOperator<D, ReturnType<D['aggregate']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/aggregate.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/aggregate.ts#L13)

**`Beta`**

Executes an aggregate query via the delegate `aggregate` method.

## Type Parameters

| Type Parameter                                                   |
| ---------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IAggregateDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`            |

## Parameters

| Parameter | Type | Description                |
| --------- | ---- | -------------------------- |
| `args`    | `A`  | Prisma aggregate arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"aggregate"`\]\>\>
