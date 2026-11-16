---
title: 'Function: createOpenAIComputerTool()'
generated: true
editUrl: false
---

# Function: createOpenAIComputerTool()

```ts
function createOpenAIComputerTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIComputerTool.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIComputerTool.ts#L22)

Creates an OpenAI computer-use tool registration.

The application executes the batched UI actions and returns an updated screenshot. Run it in an isolated
environment, treat on-screen content as untrusted and require confirmation for consequential actions.

## Parameters

| Parameter  | Type                                                                           | Description                       |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI computer-use tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
