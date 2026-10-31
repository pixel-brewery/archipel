---
title: 'Class: McpClient'
generated: true
editUrl: false
---

# Class: McpClient

Defined in: [libs/platform-mcp/src/client/McpClient.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClient.ts#L16)

Adapts Streamable HTTP MCP connections to bounded remote tool operations.

## Extends

- [`McpClientBase`](Class.McpClientBase)

## Constructors

### Constructor

```ts
new McpClient(options): McpClient;
```

Defined in: [libs/platform-mcp/src/client/McpClient.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClient.ts#L35)

Creates a caller-owned Streamable HTTP client from validated transport settings.

#### Parameters

| Parameter | Type                                               | Description                                                                      |
| --------- | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `options` | [`IMcpClientOptions`](Interface.IMcpClientOptions) | Endpoint, credentials and limits resolved by the consumer through ConfigService. |

#### Returns

`McpClient`

#### Throws

When endpoint, headers, timeout or tool capacity are invalid.

#### Overrides

[`McpClientBase`](Class.McpClientBase).[`constructor`](Class.McpClientBase#constructor)

## Methods

### callTool()

```ts
callTool(
   name,
   input,
   signal?
): Promise<{
[key: string]: unknown;
}>;
```

Defined in: [libs/platform-mcp/src/client/McpClient.ts:149](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClient.ts#L149)

Invokes a remote tool once and preserves the standard MCP result.

#### Parameters

| Parameter | Type                            | Description                                          |
| --------- | ------------------------------- | ---------------------------------------------------- |
| `name`    | `string`                        | Exact remote tool identifier returned by discovery.  |
| `input`   | `Record`\<`string`, `unknown`\> | Arguments validated against the tool's input schema. |
| `signal?` | `AbortSignal`                   | Optional caller cancellation signal.                 |

#### Returns

`Promise`\<\{
\[`key`: `string`\]: `unknown`;
\}\>

Validated MCP content blocks, structured content and protocol metadata.

#### Remarks

Remote mutations may be non-idempotent. No automatic retry is performed; consumers own deduplication at the
server's authoritative write boundary.

#### Throws

When invocation fails, is cancelled or returns an unusable result.

#### Overrides

[`McpClientBase`](Class.McpClientBase).[`callTool`](Class.McpClientBase#calltool)

---

### close()

```ts
close(): Promise<void>;
```

Defined in: [libs/platform-mcp/src/client/McpClient.ts:189](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClient.ts#L189)

Disposes the transport once, including failed or partial initialization.

#### Returns

`Promise`\<`void`\>

The shared cleanup promise, resolving after transport disposal.

#### Throws

When cleanup exceeds its five-second budget or the transport fails.

#### Overrides

[`McpClientBase`](Class.McpClientBase).[`close`](Class.McpClientBase#close)

---

### connect()

```ts
connect(): Promise<void>;
```

Defined in: [libs/platform-mcp/src/client/McpClient.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClient.ts#L84)

Shares one bounded protocol initialization attempt across concurrent callers.

#### Returns

`Promise`\<`void`\>

Resolves when the shared initialization attempt completes.

#### Remarks

A failed connection remains failed. Close and replace the client before an explicit retry so a partially
initialized transport is never reused.

#### Throws

When the client is closed or initialization fails.

#### Overrides

[`McpClientBase`](Class.McpClientBase).[`connect`](Class.McpClientBase#connect)

---

### listTools()

```ts
listTools(): Promise<readonly {
}[]>;
```

Defined in: [libs/platform-mcp/src/client/McpClient.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClient.ts#L105)

Discovers all pages; rejects duplicate tool names and excessive or cyclic pagination.

#### Returns

`Promise`\<readonly \{
\}[]\>

All validated tool declarations within the configured capacity.

#### Throws

When discovery, pagination, duplicate names or tool capacity prevent a complete
catalog.

#### Overrides

[`McpClientBase`](Class.McpClientBase).[`listTools`](Class.McpClientBase#listtools)

---

### ping()

```ts
ping(): Promise<void>;
```

Defined in: [libs/platform-mcp/src/client/McpClient.ts:171](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClient.ts#L171)

Probes readiness within three seconds, including lazy connection initialization.

#### Returns

`Promise`\<`void`\>

Resolves when the remote protocol is ready.

#### Throws

When readiness cannot be confirmed within the health budget.

#### Overrides

[`McpClientBase`](Class.McpClientBase).[`ping`](Class.McpClientBase#ping)
