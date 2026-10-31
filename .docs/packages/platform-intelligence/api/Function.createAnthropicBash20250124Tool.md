---
title: 'Function: createAnthropicBash20250124Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicBash20250124Tool()

```ts
function createAnthropicBash20250124Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicBash20250124Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicBash20250124Tool.ts#L19)

Creates an Anthropic bash tool registration for the 2025-01-24 version.

## Parameters

| Parameter  | Type                                          | Description                  |
| ---------- | --------------------------------------------- | ---------------------------- |
| `options?` | `Readonly`\<`Record`\<`string`, `unknown`\>\> | Anthropic bash tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
