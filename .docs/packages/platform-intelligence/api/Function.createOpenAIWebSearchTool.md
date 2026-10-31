---
title: 'Function: createOpenAIWebSearchTool()'
generated: true
editUrl: false
---

# Function: createOpenAIWebSearchTool()

```ts
function createOpenAIWebSearchTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIWebSearchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIWebSearchTool.ts#L19)

Creates an OpenAI web-search tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                     |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI web-search tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
