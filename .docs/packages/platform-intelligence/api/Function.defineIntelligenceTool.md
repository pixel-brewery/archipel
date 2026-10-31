---
title: 'Function: defineIntelligenceTool()'
generated: true
editUrl: false
---

# Function: defineIntelligenceTool()

```ts
function defineIntelligenceTool<TInput, TOutput>(definition): IIntelligenceToolDefinition<TInput, TOutput>;
```

Defined in: [libs/platform-intelligence/src/contracts/defineIntelligenceTool.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/defineIntelligenceTool.ts#L12)

Defines a provider-neutral intelligence tool while preserving its input and output types.

## Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`   |
| <a id="type-parameter-toutput"></a> `TOutput` |

## Parameters

| Parameter    | Type                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------- |
| `definition` | [`IIntelligenceToolDefinition`](Interface.IIntelligenceToolDefinition)\<`TInput`, `TOutput`\> |

## Returns

[`IIntelligenceToolDefinition`](Interface.IIntelligenceToolDefinition)\<`TInput`, `TOutput`\>
