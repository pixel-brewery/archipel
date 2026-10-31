---
title: 'Function: createAnthropicCodeExecution20250522Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicCodeExecution20250522Tool()

```ts
function createAnthropicCodeExecution20250522Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicCodeExecution20250522Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicCodeExecution20250522Tool.ts#L19)

Creates an Anthropic code-execution tool registration for the 2025-05-22 version.

## Parameters

| Parameter  | Type                                                                           | Description                            |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic code-execution tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
