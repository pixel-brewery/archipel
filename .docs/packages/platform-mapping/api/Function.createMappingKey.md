---
title: 'Function: createMappingKey()'
generated: true
editUrl: false
---

# Function: createMappingKey()

```ts
function createMappingKey<TInput, TOutput>(key): IMappingKey<TInput, TOutput>;
```

Defined in: [libs/platform-mapping/src/types/MappingKey.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/types/MappingKey.ts#L28)

Creates a type-safe mapping key.

## Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`   |
| <a id="type-parameter-toutput"></a> `TOutput` |

## Parameters

| Parameter | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `key`     | `string` | The unique string identifier for the mapping. |

## Returns

[`IMappingKey`](Interface.IMappingKey)\<`TInput`, `TOutput`\>

A branded mapping key that encodes the input and output types.

## Example

```typescript
export const PRODUCT_MAPPING_KEY = createMappingKey<IProductMappingInput, ProductResponse>('food.product');
```
