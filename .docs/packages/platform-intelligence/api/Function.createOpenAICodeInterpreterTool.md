---
title: 'Function: createOpenAICodeInterpreterTool()'
generated: true
editUrl: false
---

# Function: createOpenAICodeInterpreterTool()

```ts
function createOpenAICodeInterpreterTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAICodeInterpreterTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAICodeInterpreterTool.ts#L19)

Creates an OpenAI code-interpreter tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                           |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI code-interpreter tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
