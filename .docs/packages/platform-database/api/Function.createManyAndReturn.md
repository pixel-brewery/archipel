---
title: 'Function: createManyAndReturn()'
generated: true
editUrl: false
---

# Function: createManyAndReturn()

```ts
function createManyAndReturn<D, A>(args): QueryOperator<D, ReturnType<D['createManyAndReturn']>>;
```

Defined in: [libs/platform-database/src/repositories2/operators/createManyAndReturn.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/operators/createManyAndReturn.ts#L15)

**`Beta`**

Creates multiple records and returns them via the delegate `createManyAndReturn` method.

**Provider support:** PostgreSQL, CockroachDB, SQLite only.

## Type Parameters

| Type Parameter                                                             |
| -------------------------------------------------------------------------- |
| <a id="type-parameter-d"></a> `D` _extends_ `ICreateManyAndReturnDelegate` |
| <a id="type-parameter-a"></a> `A` _extends_ `unknown`                      |

## Parameters

| Parameter | Type | Description                          |
| --------- | ---- | ------------------------------------ |
| `args`    | `A`  | Prisma createManyAndReturn arguments |

## Returns

`QueryOperator`\<`D`, `ReturnType`\<`D`\[`"createManyAndReturn"`\]\>\>
