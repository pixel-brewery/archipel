---
title: 'Function: McpTool()'
generated: true
editUrl: false
---

# Function: McpTool()

```ts
function McpTool(options): MethodDecorator;
```

Defined in: [libs/platform-mcp/src/decorators/McpTool.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/decorators/McpTool.ts#L15)

Marks a method as an MCP tool handler.

The decorated method will be discovered at module initialization and registered
with the MCP server. The method receives the parsed input as its first argument
and should return an `MCP CallToolResult`.

## Parameters

| Parameter | Type                                             | Description                 |
| --------- | ------------------------------------------------ | --------------------------- |
| `options` | [`IMcpToolMetadata`](Interface.IMcpToolMetadata) | Tool registration metadata. |

## Returns

`MethodDecorator`
