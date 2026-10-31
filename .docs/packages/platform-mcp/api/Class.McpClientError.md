---
title: 'Class: McpClientError'
generated: true
editUrl: false
---

# Class: McpClientError

Defined in: [libs/platform-mcp/src/client/errors/McpClientError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/errors/McpClientError.ts#L6)

Represents a sanitized configuration, protocol or lifecycle failure at the MCP client boundary.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new McpClientError(code, message): McpClientError;
```

Defined in: [libs/platform-mcp/src/client/errors/McpClientError.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/errors/McpClientError.ts#L24)

Creates a failure without exposing endpoint credentials or remote provider diagnostics.

#### Parameters

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| `code`    | `string` | Stable category used by the consuming application to handle the failure. |
| `message` | `string` | Sanitized explanation suitable for operational error handling.           |

#### Returns

`McpClientError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-mcp/src/client/errors/McpClientError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/errors/McpClientError.ts#L12)

Stable machine-readable failure category owned by the MCP library.
