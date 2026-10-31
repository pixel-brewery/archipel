---
title: 'Abstract Class: McpClientBase'
generated: true
editUrl: false
---

# Abstract Class: McpClientBase

Defined in: [libs/platform-mcp/src/client/abstracts/McpClientBase.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/abstracts/McpClientBase.ts#L12)

Defines bounded remote-tool operations for a caller-owned MCP connection.

## Remarks

Implementations own transport timeouts, sanitized errors and circuit-breaker policy. A failed initialization must be
cleaned up before a client is replaced. Remote tool effects may be non-idempotent; automatic retries require an
explicit server-side idempotency contract.

## Extended by

- [`McpClient`](Class.McpClient)

## Constructors

### Constructor

```ts
new McpClientBase(): McpClientBase;
```

#### Returns

`McpClientBase`

## Methods

### callTool()

```ts
abstract callTool(
   name,
   input,
   signal?
): Promise<{
[key: string]: unknown;
}>;
```

Defined in: [libs/platform-mcp/src/client/abstracts/McpClientBase.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/abstracts/McpClientBase.ts#L52)

Invokes one remote tool without automatically retrying an ambiguous effect.

#### Parameters

| Parameter | Type                            | Description                                           |
| --------- | ------------------------------- | ----------------------------------------------------- |
| `name`    | `string`                        | Exact remote tool identifier returned by discovery.   |
| `input`   | `Record`\<`string`, `unknown`\> | Arguments validated against that tool's input schema. |
| `signal?` | `AbortSignal`                   | Optional cancellation signal for the invocation.      |

#### Returns

`Promise`\<\{
\[`key`: `string`\]: `unknown`;
\}\>

The standard MCP result, including content blocks and optional structured content.

#### Remarks

MCP does not supply a generic idempotency key. Consumers must deduplicate mutations at the authoritative write
boundary or use a server-specific idempotency argument.

#### Throws

When invocation or remote result validation fails.

---

### close()

```ts
abstract close(): Promise<void>;
```

Defined in: [libs/platform-mcp/src/client/abstracts/McpClientBase.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/abstracts/McpClientBase.ts#L68)

Closes the connection within a bounded cleanup budget.

#### Returns

`Promise`\<`void`\>

Resolves when transport cleanup completes.

#### Throws

When transport cleanup fails.

---

### connect()

```ts
abstract connect(): Promise<void>;
```

Defined in: [libs/platform-mcp/src/client/abstracts/McpClientBase.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/abstracts/McpClientBase.ts#L30)

Establishes one connection while sharing concurrent initialization.

#### Returns

`Promise`\<`void`\>

Resolves when protocol initialization completes.

#### Throws

When initialization fails or the client has been closed.

---

### listTools()

```ts
abstract listTools(): Promise<readonly {
}[]>;
```

Defined in: [libs/platform-mcp/src/client/abstracts/McpClientBase.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/abstracts/McpClientBase.ts#L38)

Discovers a complete, bounded catalog across all server pages.

#### Returns

`Promise`\<readonly \{
\}[]\>

Validated remote tool declarations with unique names.

#### Throws

When discovery, pagination or catalog validation fails.

---

### ping()

```ts
abstract ping(): Promise<void>;
```

Defined in: [libs/platform-mcp/src/client/abstracts/McpClientBase.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/abstracts/McpClientBase.ts#L60)

Probes protocol readiness within an independent three-second budget.

#### Returns

`Promise`\<`void`\>

Resolves when the remote protocol is ready.

#### Throws

When readiness cannot be confirmed within the health budget.
