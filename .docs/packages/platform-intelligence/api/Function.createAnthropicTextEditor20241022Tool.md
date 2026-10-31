---
title: 'Function: createAnthropicTextEditor20241022Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicTextEditor20241022Tool()

```ts
function createAnthropicTextEditor20241022Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicTextEditor20241022Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicTextEditor20241022Tool.ts#L19)

Creates an Anthropic text-editor tool registration for the 2024-10-22 version.

## Parameters

| Parameter  | Type                                                                           | Description                         |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic text-editor tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
