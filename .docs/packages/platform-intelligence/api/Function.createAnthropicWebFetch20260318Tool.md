---
title: 'Function: createAnthropicWebFetch20260318Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicWebFetch20260318Tool()

```ts
function createAnthropicWebFetch20260318Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicWebFetch20260318Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicWebFetch20260318Tool.ts#L19)

Creates an Anthropic web-fetch tool registration for the 2026-03-18 version.

## Parameters

| Parameter  | Type                                                                           | Description                       |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic web-fetch tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
