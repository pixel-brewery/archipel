---
title: 'Function: createAnthropicWebSearch20250305Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicWebSearch20250305Tool()

```ts
function createAnthropicWebSearch20250305Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicWebSearch20250305Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicWebSearch20250305Tool.ts#L19)

Creates an Anthropic web-search tool registration for the 2025-03-05 version.

## Parameters

| Parameter  | Type                                                                           | Description                        |
| ---------- | ------------------------------------------------------------------------------ | ---------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic web-search tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
