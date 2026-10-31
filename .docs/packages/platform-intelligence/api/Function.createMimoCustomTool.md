---
title: 'Function: createMimoCustomTool()'
generated: true
editUrl: false
---

# Function: createMimoCustomTool()

```ts
function createMimoCustomTool(definition, name): IIntelligenceTool;
```

Defined in: [libs/platform-intelligence/src/providers/mimo/tools/createMimoCustomTool.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/mimo/tools/createMimoCustomTool.ts#L21)

Creates a provider-neutral function tool for MiMo.

MiMo exposes OpenAI-compatible function tools, so this adapter keeps the same
Archipel shape as the other provider-specific tool factories.

## Parameters

| Parameter    | Type                                                                   | Description                                |
| ------------ | ---------------------------------------------------------------------- | ------------------------------------------ |
| `definition` | [`IIntelligenceToolDefinition`](Interface.IIntelligenceToolDefinition) | Provider-neutral Archipel tool definition. |
| `name`       | `string`                                                               | Archipel registry name.                    |

## Returns

[`IIntelligenceTool`](Interface.IIntelligenceTool)

Tool registration compatible with the intelligence tool registry.
