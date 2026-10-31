---
title: 'Function: McpPrompt()'
generated: true
editUrl: false
---

# Function: McpPrompt()

```ts
function McpPrompt(options): MethodDecorator;
```

Defined in: [libs/platform-mcp/src/decorators/McpPrompt.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/decorators/McpPrompt.ts#L15)

Marks a method as an MCP prompt handler.

The decorated method will be discovered at module initialization and registered
with the MCP server. The method receives the parsed prompt arguments and
should return an `MCP GetPromptResult`.

## Parameters

| Parameter | Type                                                 | Description                   |
| --------- | ---------------------------------------------------- | ----------------------------- |
| `options` | [`IMcpPromptMetadata`](Interface.IMcpPromptMetadata) | Prompt registration metadata. |

## Returns

`MethodDecorator`
