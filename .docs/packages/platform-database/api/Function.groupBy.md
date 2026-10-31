---
title: 'Function: groupBy()'
generated: true
editUrl: false
---

# Function: groupBy()

```ts
function groupBy<D, A>(args): QueryOperator<D, ReturnType<D['groupBy']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/groupBy.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/groupBy.ts#L13)

**`Beta`**

Performs a group-by query via the delegate `groupBy` method.

## Type Parameters

| Type Parameter                                                 |
| -------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `IGroupByDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`          |

## Parameters

| Parameter | Type | Description              |
| --------- | ---- | ------------------------ |
| `args`    | `A`  | Prisma groupBy arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"groupBy"`\]\>\>
