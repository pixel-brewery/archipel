---
title: 'Function: createAnthropicAdvisor20260301Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicAdvisor20260301Tool()

```ts
function createAnthropicAdvisor20260301Tool(options): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicAdvisor20260301Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicAdvisor20260301Tool.ts#L19)

Creates an Anthropic advisor tool registration.

## Parameters

| Parameter | Type                                                                           | Description                     |
| --------- | ------------------------------------------------------------------------------ | ------------------------------- |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic advisor tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
