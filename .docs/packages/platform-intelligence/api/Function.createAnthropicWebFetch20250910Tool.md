---
title: 'Function: createAnthropicWebFetch20250910Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicWebFetch20250910Tool()

```ts
function createAnthropicWebFetch20250910Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicWebFetch20250910Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicWebFetch20250910Tool.ts#L19)

Creates an Anthropic web-fetch tool registration for the 2025-09-10 version.

## Parameters

| Parameter  | Type                                                                           | Description                       |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic web-fetch tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
