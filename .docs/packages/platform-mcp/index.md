---
title: MCP Server and Client
description: Shared MCP decorators, handler registry, server transports and bounded client connections.
---

# MCP Server and Client

`@pixel-brewery/archipel-platform-mcp` owns MCP protocol integration for every consumer. Its server module provides decorators, handler discovery, a shared registry and server transports. Its independent `/client` entry point connects to those tools or any compatible MCP server.

See the [server integration guide](/guides/mcp-server) for decorator, registry and transport composition, and the [API reference](./api/) for the public contracts.

## Client Connections

The `/client` entry point owns the bounded Streamable HTTP tool client. It is independent of the server module and of any AI runtime:

```typescript
import { McpClient, McpClientHealthIndicator } from '@pixel-brewery/archipel-platform-mcp/client';

const client = new McpClient({ url: configuredServerUrl, authToken: configuredToken });
healthOrchestrator.registerIndicator(new McpClientHealthIndicator(client, 'remote-tools'));
try {
    const tools = await client.listTools();
    const result = await client.callTool('echo', { value: 'inspect' });
    // tools use the standard MCP Tool contract; result is a complete CallToolResult.
} finally {
    await client.close();
}
```

`McpClientBase` lives under `client/abstracts/`, while `IMcpClientOptions` lives under `client/interfaces/`. The injectable `McpClient` implements the base class with an explicitly owned connection. Consumers can implement another transport by extending that base. Client failures use the library-owned `McpClientError` and never expose raw SDK diagnostics or credentials.

There is one server registration pipeline: `@McpTool` metadata is discovered into `McpRegistryService`, then registered with `McpServerService`. Decorator metadata uses local Zod validators; discovery over the wire uses the MCP SDK's existing `Tool` JSON-schema contract. The client preserves that standard declaration, including output schemas, annotations and metadata. Calls return the SDK's `CallToolResult` with all content blocks, structured content and protocol metadata. No parallel Archipel tool-specification model or handler registry is introduced. AI consumers can use the separate Intelligence Agents tool adapter on top of this API.

Connections share initialization across concurrent callers. Discovery follows all pages and rejects duplicate tool names, cyclic cursors and capacity overflow. Defaults are a five-second connection/operation budget, an independent three-second readiness probe, a five-second cleanup budget and 128 tools; operation budgets are configurable up to 60 seconds and tool capacity up to 1024. `ping()` invokes no business tool. A failed connection is closed before explicit replacement. Remote tool mutations may be non-idempotent, so no automatic effect retry is performed; consumers own authoritative deduplication and connection backoff/circuit-breaker policy.

Resolve endpoint and credentials through the consuming application's typed `ConfigService` keys in a factory provider. A bootstrap owner connects/discovers and registers its health indicator in `onModuleInit()`, then closes the client in `onModuleDestroy()`. Work-item owners use `try/finally`. Structured failure warnings include correlation, operation, duration and code without endpoints, headers, arguments or remote diagnostics. The package defines no global client endpoint or credential variables.

Retained third-party license terms are included in [third-party notices](./third-party-notices).
