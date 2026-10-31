---
title: 'Function: createAnthropicCodeExecution20260120Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicCodeExecution20260120Tool()

```ts
function createAnthropicCodeExecution20260120Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicCodeExecution20260120Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicCodeExecution20260120Tool.ts#L19)

Creates an Anthropic code-execution tool registration for the 2026-01-20 version.

## Parameters

| Parameter  | Type                                                                           | Description                            |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic code-execution tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
