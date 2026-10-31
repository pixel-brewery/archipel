---
title: 'Function: createAnthropicToolSearchRegex20251119Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicToolSearchRegex20251119Tool()

```ts
function createAnthropicToolSearchRegex20251119Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicToolSearchRegex20251119Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicToolSearchRegex20251119Tool.ts#L19)

Creates an Anthropic regex tool-search tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                          |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic regex tool-search options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
