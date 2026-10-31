---
title: 'Function: createOpenAIShellTool()'
generated: true
editUrl: false
---

# Function: createOpenAIShellTool()

```ts
function createOpenAIShellTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIShellTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIShellTool.ts#L19)

Creates an OpenAI shell tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                |
| ---------- | ------------------------------------------------------------------------------ | -------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI shell tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
