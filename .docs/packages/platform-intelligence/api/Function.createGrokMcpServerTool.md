---
title: 'Function: createGrokMcpServerTool()'
generated: true
editUrl: false
---

# Function: createGrokMcpServerTool()

```ts
function createGrokMcpServerTool(options): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/grok/tools/createGrokMcpServerTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/grok/tools/createGrokMcpServerTool.ts#L19)

Creates a Grok MCP server tool registration.

## Parameters

| Parameter | Type                                                                           | Description                   |
| --------- | ------------------------------------------------------------------------------ | ----------------------------- |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Grok MCP server tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
