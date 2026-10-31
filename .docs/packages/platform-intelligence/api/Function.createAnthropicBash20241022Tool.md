---
title: 'Function: createAnthropicBash20241022Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicBash20241022Tool()

```ts
function createAnthropicBash20241022Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicBash20241022Tool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicBash20241022Tool.ts#L19)

Creates an Anthropic bash tool registration for the 2024-10-22 version.

## Parameters

| Parameter  | Type                                          | Description                  |
| ---------- | --------------------------------------------- | ---------------------------- |
| `options?` | `Readonly`\<`Record`\<`string`, `unknown`\>\> | Anthropic bash tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
