---
title: 'Function: createIntelligenceJsonSchema()'
generated: true
editUrl: false
---

# Function: createIntelligenceJsonSchema()

```ts
function createIntelligenceJsonSchema<T>(jsonSchema, validate?): IIntelligenceSchema<T>;
```

Defined in: [libs/platform-intelligence/src/contracts/createIntelligenceJsonSchema.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/createIntelligenceJsonSchema.ts#L12)

Creates a provider-neutral JSON Schema wrapper.

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Parameters

| Parameter    | Type                                                                                                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jsonSchema` | `Readonly`\<`Record`\<`string`, `unknown`\>\>                                                                                                                                                                   |
| `validate?`  | (`value`) => \| \{ `success`: `true`; `value`: `T`; \} \| \{ `error`: `Error`; `success`: `false`; \} \| `Promise`\< \| \{ `success`: `true`; `value`: `T`; \} \| \{ `error`: `Error`; `success`: `false`; \}\> |

## Returns

[`IIntelligenceSchema`](TypeAlias.IIntelligenceSchema)\<`T`\>
