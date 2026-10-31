---
title: 'Function: cursorPaginator()'
generated: true
editUrl: false
---

# Function: cursorPaginator()

```ts
function cursorPaginator(defaultOptions): CursorPaginateFunction;
```

Defined in: [libs/platform-database/src/features/CursorPagination.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/CursorPagination.ts#L50)

Creates a cursor-based pagination function with the given default options.

## Parameters

| Parameter        | Type                                                         | Description                        |
| ---------------- | ------------------------------------------------------------ | ---------------------------------- |
| `defaultOptions` | [`ICursorPaginateOptions`](Interface.ICursorPaginateOptions) | Default cursor pagination options. |

## Returns

[`CursorPaginateFunction`](TypeAlias.CursorPaginateFunction)

A function that paginates using cursor-based strategy.
