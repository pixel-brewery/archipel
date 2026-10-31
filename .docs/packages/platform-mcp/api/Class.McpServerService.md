---
title: 'Class: McpServerService'
generated: true
editUrl: false
---

# Class: McpServerService

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L23)

Manages the MCP server lifecycle.
Creates the `McpServer` instance, registers all discovered handlers from
the registry, and provides methods to connect various transports.

## Implements

- `OnModuleInit`
- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new McpServerService(
   options,
   registry,
   discovery
): McpServerService;
```

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L45)

Composes the existing handler registry, discovery and server configuration.

#### Parameters

| Parameter   | Type                                               | Description                                                        |
| ----------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| `options`   | [`IMcpModuleOptions`](Interface.IMcpModuleOptions) | Server identity and advertised protocol capabilities.              |
| `registry`  | [`McpRegistryService`](Class.McpRegistryService)   | Authoritative catalog of locally registered handlers.              |
| `discovery` | [`McpDiscoveryService`](Class.McpDiscoveryService) | Idempotent discovery run before the server snapshots its handlers. |

#### Returns

`McpServerService`

## Accessors

### server

#### Get Signature

```ts
get server(): McpServer;
```

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L61)

Returns the underlying `McpServer` instance.

##### Throws

Error if the server has not been initialized yet.

##### Returns

`McpServer`

The initialized SDK server that owns protocol dispatch.

## Methods

### connectStdio()

```ts
connectStdio(): Promise<StdioServerTransport>;
```

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:131](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L131)

Connects the server to a stdio transport.
Suitable for local, process-spawned integrations.

#### Returns

`Promise`\<`StdioServerTransport`\>

The connected standard input/output transport tracked for shutdown.

---

### connectTransport()

```ts
connectTransport(transport): Promise<void>;
```

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:184](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L184)

Connects a custom transport to the MCP server.

#### Parameters

| Parameter   | Type        | Description                                             |
| ----------- | ----------- | ------------------------------------------------------- |
| `transport` | `Transport` | Any transport implementing the MCP Transport interface. |

#### Returns

`Promise`\<`void`\>

Resolves after connection and lifecycle tracking complete.

---

### createSseTransport()

```ts
createSseTransport(options, response): Promise<SSEServerTransport>;
```

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:169](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L169)

Creates an SSE transport for legacy client support.
The caller is responsible for wiring the returned transport to Express routes.

#### Parameters

| Parameter  | Type                                                     | Description                                         |
| ---------- | -------------------------------------------------------- | --------------------------------------------------- |
| `options`  | [`ISseTransportOptions`](Interface.ISseTransportOptions) | SSE transport configuration.                        |
| `response` | `Response`                                               | The Express response object for the SSE connection. |

#### Returns

`Promise`\<`SSEServerTransport`\>

The configured SSE transport instance.

---

### createStreamableHttpTransport()

```ts
createStreamableHttpTransport(options?): Promise<StreamableHTTPServerTransport>;
```

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:148](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L148)

Creates a Streamable HTTP transport for use with Express.
The caller is responsible for wiring the transport's `handleRequest`
method to the appropriate Express routes.

#### Parameters

| Parameter  | Type                                                                           | Description                      |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `options?` | [`IStreamableHttpTransportOptions`](Interface.IStreamableHttpTransportOptions) | Transport configuration options. |

#### Returns

`Promise`\<`StreamableHTTPServerTransport`\>

The configured transport instance.

---

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L103)

Cleans up all active transports when the module is destroyed.

#### Returns

`Promise`\<`void`\>

Resolves after the existing bounded transport and server cleanup attempts.

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [libs/platform-mcp/src/services/McpServerService.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpServerService.ts#L77)

Initializes the MCP server and registers all tools, resources, and prompts
from the registry.

#### Returns

`void`

#### Implementation of

`OnModuleInit.onModuleInit`
