---
title: 'Function: intelligencePrompt()'
generated: true
editUrl: false
---

# Function: intelligencePrompt()

```ts
function intelligencePrompt<TInput, TOutput>(configuration): IIntelligencePromptDefinition<TInput, TOutput, 'object' | 'text'>;
```

Defined in: [libs/platform-intelligence/src/prompts/intelligencePrompt.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/intelligencePrompt.ts#L15)

Creates a reusable intelligence prompt definition.

## Type Parameters

| Type Parameter                                | Default type |
| --------------------------------------------- | ------------ |
| <a id="type-parameter-tinput"></a> `TInput`   | -            |
| <a id="type-parameter-toutput"></a> `TOutput` | `string`     |

## Parameters

| Parameter       | Type                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `configuration` | [`IntelligencePromptDefinitionConfiguration`](TypeAlias.IntelligencePromptDefinitionConfiguration)\<`TInput`, `TOutput`\> |

## Returns

[`IIntelligencePromptDefinition`](Interface.IIntelligencePromptDefinition)\<`TInput`, `TOutput`, `"object"` \| `"text"`\>
