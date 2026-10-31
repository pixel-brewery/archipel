---
title: 'Type Alias: PaginateFunction'
generated: true
editUrl: false
---

# Type Alias: PaginateFunction

```ts
type PaginateFunction = <T, K>(model, args?, options?) => Promise<IPaginatedResult<T>>;
```

Defined in: [libs/platform-database/src/features/Pagination.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/features/Pagination.ts#L18)

## Type Parameters

| Type Parameter                          |
| --------------------------------------- |
| <a id="type-parameter-__typet"></a> `T` |
| <a id="type-parameter-__typek"></a> `K` |

## Parameters

| Parameter  | Type                                             |
| ---------- | ------------------------------------------------ |
| `model`    | `any`                                            |
| `args?`    | `K`                                              |
| `options?` | [`IPaginateOptions`](Interface.IPaginateOptions) |

## Returns

`Promise`\<[`IPaginatedResult`](Interface.IPaginatedResult)\<`T`\>\>
