---
title: 'Function: createAnthropicCodeExecution20250825Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicCodeExecution20250825Tool()

```ts
function createAnthropicCodeExecution20250825Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicCodeExecution20250825Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicCodeExecution20250825Tool.ts#L19)

Creates an Anthropic code-execution tool registration for the 2025-08-25 version.

## Parameters

| Parameter  | Type                                                                           | Description                            |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic code-execution tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
