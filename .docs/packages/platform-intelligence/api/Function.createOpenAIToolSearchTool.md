---
title: 'Function: createOpenAIToolSearchTool()'
generated: true
editUrl: false
---

# Function: createOpenAIToolSearchTool()

```ts
function createOpenAIToolSearchTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIToolSearchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIToolSearchTool.ts#L19)

Creates an OpenAI tool-search tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                 |
| ---------- | ------------------------------------------------------------------------------ | --------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI tool-search options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
