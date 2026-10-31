---
title: 'Function: createAnthropicComputer20241022Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicComputer20241022Tool()

```ts
function createAnthropicComputer20241022Tool(options): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicComputer20241022Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicComputer20241022Tool.ts#L19)

Creates an Anthropic computer-use tool registration for the 2024-10-22 version.

## Parameters

| Parameter | Type                                                                           | Description                          |
| --------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic computer-use tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
