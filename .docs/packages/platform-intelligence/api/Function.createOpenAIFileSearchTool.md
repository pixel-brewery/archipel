---
title: 'Function: createOpenAIFileSearchTool()'
generated: true
editUrl: false
---

# Function: createOpenAIFileSearchTool()

```ts
function createOpenAIFileSearchTool(options): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIFileSearchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIFileSearchTool.ts#L19)

Creates an OpenAI file-search tool registration.

## Parameters

| Parameter | Type                                                                           | Description                      |
| --------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI file-search tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
