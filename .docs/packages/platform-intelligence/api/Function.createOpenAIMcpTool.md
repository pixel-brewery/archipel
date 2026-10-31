---
title: 'Function: createOpenAIMcpTool()'
generated: true
editUrl: false
---

# Function: createOpenAIMcpTool()

```ts
function createOpenAIMcpTool(options): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIMcpTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIMcpTool.ts#L19)

Creates an OpenAI MCP connector tool registration.

## Parameters

| Parameter | Type                                                                           | Description              |
| --------- | ------------------------------------------------------------------------------ | ------------------------ |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI MCP tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
