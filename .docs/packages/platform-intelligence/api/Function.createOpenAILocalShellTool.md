---
title: 'Function: createOpenAILocalShellTool()'
generated: true
editUrl: false
---

# Function: createOpenAILocalShellTool()

```ts
function createOpenAILocalShellTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAILocalShellTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAILocalShellTool.ts#L19)

Creates an OpenAI local-shell tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                      |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI local-shell tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
