---
title: 'Function: createAnthropicTextEditor20250728Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicTextEditor20250728Tool()

```ts
function createAnthropicTextEditor20250728Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicTextEditor20250728Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicTextEditor20250728Tool.ts#L19)

Creates an Anthropic text-editor tool registration for the 2025-07-28 version.

## Parameters

| Parameter  | Type                                                                           | Description                         |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic text-editor tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
