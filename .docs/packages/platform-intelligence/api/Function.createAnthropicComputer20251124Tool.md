---
title: 'Function: createAnthropicComputer20251124Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicComputer20251124Tool()

```ts
function createAnthropicComputer20251124Tool(options): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicComputer20251124Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicComputer20251124Tool.ts#L19)

Creates an Anthropic computer-use tool registration for the 2025-11-24 version.

## Parameters

| Parameter | Type                                                                           | Description                          |
| --------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic computer-use tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
