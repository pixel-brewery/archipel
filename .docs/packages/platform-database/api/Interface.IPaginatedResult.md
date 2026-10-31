---
title: 'Interface: IPaginatedResult\<T\>'
generated: true
editUrl: false
---

# Interface: IPaginatedResult\<T\>

Defined in: [libs/platform-database/src/features/Pagination.ts:1](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/Pagination.ts#L1)

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Properties

### data

```ts
data: T[];
```

Defined in: [libs/platform-database/src/features/Pagination.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/Pagination.ts#L2)

---

### meta

```ts
meta: {
    currentPage: number;
    lastPage: number;
    next: number | null;
    perPage: number;
    prev: number | null;
    total: number;
}
```

Defined in: [libs/platform-database/src/features/Pagination.ts:3](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/Pagination.ts#L3)

#### currentPage

```ts
currentPage: number;
```

#### lastPage

```ts
lastPage: number;
```

#### next

```ts
next: number | null;
```

#### perPage

```ts
perPage: number;
```

#### prev

```ts
prev: number | null;
```

#### total

```ts
total: number;
```
