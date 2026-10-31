---
title: 'Function: pipeAll()'
generated: true
editUrl: false
---

# Function: pipeAll()

```ts
function pipeAll<D, R>(delegate, ...ops): Promise<R>;
```

Defined in: [libs/platform-database/src/repositories2/operators/pipe.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/pipe.ts#L22)

**`Beta`**

Sequentially executes multiple operators. The last result is returned.
Useful for multi-step dependent operations.

## Type Parameters

| Type Parameter                    | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` | Concrete delegate type (e.g. Prisma.UserDelegate) |
| <a id="type-parameter-r"></a> `R` | Result type produced by the operator              |

## Parameters

| Parameter  | Type                                |
| ---------- | ----------------------------------- |
| `delegate` | `D`                                 |
| ...`ops`   | `QueryOperator`\<`D`, `unknown`\>[] |

## Returns

`Promise`\<`R`\>
