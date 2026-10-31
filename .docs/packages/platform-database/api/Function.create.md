---
title: 'Function: create()'
generated: true
editUrl: false
---

# Function: create()

```ts
function create<D, A>(args): QueryOperator<D, ReturnType<D['create']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/create.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/create.ts#L13)

**`Beta`**

Creates a record using the underlying delegate `create` method.

## Type Parameters

| Type Parameter                                                |
| ------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `ICreateDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`         |

## Parameters

| Parameter | Type | Description             |
| --------- | ---- | ----------------------- |
| `args`    | `A`  | Prisma create arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"create"`\]\>\>
