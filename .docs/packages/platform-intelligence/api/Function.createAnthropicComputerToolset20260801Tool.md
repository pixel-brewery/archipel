---
title: 'Function: createAnthropicComputerToolset20260801Tool()'
generated: true
editUrl: false
---

# Function: createAnthropicComputerToolset20260801Tool()

```ts
function createAnthropicComputerToolset20260801Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicComputerToolset20260801Tool.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicComputerToolset20260801Tool.ts#L22)

Creates an Anthropic computer-use toolset registration for the 2026-08-01 version.

Each member action arrives as the `action` of one computer tool call. Newer Claude models require this
toolset instead of the older computer tool versions.

## Parameters

| Parameter  | Type                                                                           | Description                                                  |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic computer-use toolset options keyed by member name. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
