---
title: 'Function: skip()'
generated: true
editUrl: false
---

# Function: skip()

```ts
function skip<T>(value): Exclude<T, undefined> | undefined;
```

Defined in: [libs/platform-database/src/types/Skip.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/types/Skip.ts#L9)

Utility function that returns the provided value or `undefined` if the value is `undefined`.
In Prisma 6+, passing `undefined` for a field in a query signals Prisma to skip that field.

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Parameters

| Parameter | Type | Description         |
| --------- | ---- | ------------------- |
| `value`   | `T`  | The value to check. |

## Returns

`Exclude`\<`T`, `undefined`\> \| `undefined`

The original value (excluding undefined) or `undefined` to skip the field.
