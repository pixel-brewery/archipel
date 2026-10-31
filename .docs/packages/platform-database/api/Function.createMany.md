---
title: 'Function: createMany()'
generated: true
editUrl: false
---

# Function: createMany()

```ts
function createMany<D, A>(args): QueryOperator<D, ReturnType<D['createMany']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/createMany.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/createMany.ts#L13)

**`Beta`**

Creates multiple records via the delegate `createMany` method.

## Type Parameters

| Type Parameter                                                    |
| ----------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `ICreateManyDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`             |

## Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| `args`    | `A`  | Prisma createMany arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"createMany"`\]\>\>
