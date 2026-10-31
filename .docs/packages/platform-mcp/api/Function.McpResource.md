---
title: 'Function: McpResource()'
generated: true
editUrl: false
---

# Function: McpResource()

```ts
function McpResource(options): MethodDecorator;
```

Defined in: [libs/platform-mcp/src/decorators/McpResource.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/decorators/McpResource.ts#L15)

Marks a method as an MCP resource handler.

The decorated method will be discovered at module initialization and registered
with the MCP server. The method receives the URI and parsed template parameters
as arguments and should return an `MCP ReadResourceResult`.

## Parameters

| Parameter | Type                                                     | Description                     |
| --------- | -------------------------------------------------------- | ------------------------------- |
| `options` | [`IMcpResourceMetadata`](Interface.IMcpResourceMetadata) | Resource registration metadata. |

## Returns

`MethodDecorator`
