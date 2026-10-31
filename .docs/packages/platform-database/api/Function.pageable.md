---
title: 'Function: pageable()'
generated: true
editUrl: false
---

# Function: pageable()

```ts
function pageable<TEntity>(items, total, skip, take?): IPageableCollection<TEntity>;
```

Defined in: [libs/platform-database/src/models/entities/IPageableEntityCollection.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/entities/IPageableEntityCollection.ts#L13)

## Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tentity"></a> `TEntity` |

## Parameters

| Parameter | Type        |
| --------- | ----------- |
| `items`   | `TEntity`[] |
| `total`   | `number`    |
| `skip`    | `number`    |
| `take?`   | `number`    |

## Returns

`IPageableCollection`\<`TEntity`\>
