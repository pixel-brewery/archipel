---
title: 'Function: createOpenAIWebSearchPreviewTool()'
generated: true
editUrl: false
---

# Function: createOpenAIWebSearchPreviewTool()

```ts
function createOpenAIWebSearchPreviewTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIWebSearchPreviewTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIWebSearchPreviewTool.ts#L19)

Creates an OpenAI web-search-preview tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                             |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI web-search-preview tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
