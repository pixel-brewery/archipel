---
title: 'Function: createAnthropicMemory20250818Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicMemory20250818Tool()

```ts
function createAnthropicMemory20250818Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicMemory20250818Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicMemory20250818Tool.ts#L19)

Creates an Anthropic memory tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                    |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------ |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic memory tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
