---
title: 'Type Alias: CursorPaginateFunction'
generated: true
editUrl: false
---

# Type Alias: CursorPaginateFunction

```ts
type CursorPaginateFunction = <T, K>(model, args?, options?) => Promise<ICursorPaginatedResult<T>>;
```

Defined in: [libs/platform-database/src/features/CursorPagination.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/CursorPagination.ts#L32)

The type of a cursor paginate function.

## Type Parameters

| Type Parameter                                                          |
| ----------------------------------------------------------------------- |
| <a id="type-parameter-__typet"></a> `T` _extends_ \{ `id`: `string`; \} |
| <a id="type-parameter-__typek"></a> `K`                                 |

## Parameters

| Parameter  | Type                                                         |
| ---------- | ------------------------------------------------------------ |
| `model`    | `unknown`                                                    |
| `args?`    | `K`                                                          |
| `options?` | [`ICursorPaginateOptions`](Interface.ICursorPaginateOptions) |

## Returns

`Promise`\<[`ICursorPaginatedResult`](Interface.ICursorPaginatedResult)\<`T`\>\>
