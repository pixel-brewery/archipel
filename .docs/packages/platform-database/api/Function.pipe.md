---
title: 'Function: pipe()'
generated: true
editUrl: false
---

# Function: pipe()

```ts
function pipe<D, R>(delegate, op): R;
```

Defined in: [libs/platform-database/src/repositories2/operators/pipe.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/pipe.ts#L10)

**`Beta`**

Executes a single operator against the provided delegate.

## Type Parameters

| Type Parameter                    | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` | Concrete delegate type (e.g. Prisma.UserDelegate) |
| <a id="type-parameter-r"></a> `R` | Result type produced by the operator              |

## Parameters

| Parameter  | Type                        |
| ---------- | --------------------------- |
| `delegate` | `D`                         |
| `op`       | `QueryOperator`\<`D`, `R`\> |

## Returns

`R`
