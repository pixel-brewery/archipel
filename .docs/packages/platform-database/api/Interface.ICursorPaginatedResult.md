---
title: 'Interface: ICursorPaginatedResult\<T\>'
generated: true
editUrl: false
---

# Interface: ICursorPaginatedResult\<T\>

Defined in: [libs/platform-database/src/features/CursorPagination.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/CursorPagination.ts#L6)

Represents the result of a cursor-paginated query.

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Properties

### data

```ts
data: T[];
```

Defined in: [libs/platform-database/src/features/CursorPagination.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/CursorPagination.ts#L7)

---

### meta

```ts
meta: {
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
}
```

Defined in: [libs/platform-database/src/features/CursorPagination.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/CursorPagination.ts#L8)

#### endCursor

```ts
endCursor: string | null;
```

#### hasNextPage

```ts
hasNextPage: boolean;
```

#### hasPreviousPage

```ts
hasPreviousPage: boolean;
```

#### startCursor

```ts
startCursor: string | null;
```
