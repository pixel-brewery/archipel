---
title: 'Function: createOpenAIImageGenerationTool()'
generated: true
editUrl: false
---

# Function: createOpenAIImageGenerationTool()

```ts
function createOpenAIImageGenerationTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIImageGenerationTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIImageGenerationTool.ts#L19)

Creates an OpenAI image-generation tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                           |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI image-generation tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
