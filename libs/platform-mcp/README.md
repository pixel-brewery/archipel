# @pixel-brewery/archipel-platform-mcp

Reusable NestJS module for building [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers and bounded tool clients. Provides decorators, automatic handler discovery, and transport management — all wired through NestJS dependency injection.

## Features

- **Decorator-driven** — Annotate methods with `@McpTool`, `@McpResource`, or `@McpPrompt` to register MCP handlers
- **Auto-discovery** — Handlers discovered at module init via NestJS `DiscoveryService`, no manual registration required
- **Dynamic module** — Configure via `McpModule.register()` (sync) or `McpModule.registerAsync()` (factory / class / existing provider)
- **Transport-agnostic** — Built-in support for Stdio, Streamable HTTP, and SSE transports; plug in any custom `Transport` implementation
- **Zod schemas** — Define input/output schemas for tools and argument schemas for prompts using Zod
- **NPM-publishable** — Designed as a standalone library for reuse across multiple NestJS projects
- **Health checks** — `McpHealthIndicator` for readiness probes (separate `/health` subpath)

---

## Quick Start

```typescript
import { Module, Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { McpModule, McpServerService, McpTool } from '@pixel-brewery/archipel-platform-mcp';
import { z } from 'zod';

// 1. Define a provider with tools
@Injectable()
class CalculatorProvider {
    @McpTool({
        name: 'add',
        description: 'Adds two numbers',
        inputSchema: { a: z.number(), b: z.number() },
    })
    public add(input: { a: number; b: number }) {
        return {
            content: [{ type: 'text' as const, text: String(input.a + input.b) }],
        };
    }
}

// 2. Import McpModule and register the provider
@Module({
    imports: [
        McpModule.register({
            name: 'calculator-server',
            version: '1.0.0',
        }),
    ],
    providers: [CalculatorProvider],
})
class AppModule {}

// 3. Bootstrap and connect a transport
async function main() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const mcpServer = app.get(McpServerService);
    await mcpServer.connectStdio();
}

main();
```

**Health indicator (optional):**

```typescript
import { McpHealthIndicator } from '@pixel-brewery/archipel-platform-mcp/health';
```

---

## Module Configuration

### Synchronous

```typescript
McpModule.register({
    name: 'my-mcp-server',
    version: '1.0.0',
    capabilities: {
        tools: { listChanged: true },
        resources: { subscribe: false, listChanged: true },
        prompts: { listChanged: true },
    },
    instructions: 'Optional instructions for MCP clients.',
});
```

### Asynchronous

#### Using a factory function

```typescript
McpModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        name: config.get('MCP_SERVER_NAME'),
        version: config.get('MCP_SERVER_VERSION'),
    }),
});
```

#### Using an existing provider

```typescript
McpModule.registerAsync({
    useExisting: McpConfigService,
});
```

Where `McpConfigService` implements `IMcpModuleOptionsFactory`:

```typescript
@Injectable()
class McpConfigService implements IMcpModuleOptionsFactory {
    public createMcpOptions(): IMcpModuleOptions {
        return { name: 'dynamic-server', version: '2.0.0' };
    }
}
```

#### Using a class

```typescript
McpModule.registerAsync({
    useClass: McpConfigService,
});
```

This instantiates `McpConfigService` and calls `createMcpOptions()` to produce the options.

---

## Decorators

All decorators are placed on **methods** of NestJS `@Injectable()` providers. The class must be registered as a provider in a NestJS module.

### @McpTool

Registers a method as an MCP tool handler.

```typescript
import { McpTool } from '@pixel-brewery/archipel-platform-mcp';
import { z } from 'zod';

@Injectable()
class FileTools {
    @McpTool({
        name: 'read-file',
        title: 'Read File',
        description: 'Reads the contents of a file at the given path.',
        inputSchema: {
            path: z.string().describe('Absolute file path'),
        },
        annotations: {
            readOnlyHint: true,
        },
    })
    public readFile(input: { path: string }) {
        const content = fs.readFileSync(input.path, 'utf-8');

        return {
            content: [{ type: 'text' as const, text: content }],
        };
    }
}
```

**Options (`IMcpToolMetadata`):**

| Property       | Type                      | Required | Description                           |
| -------------- | ------------------------- | -------- | ------------------------------------- |
| `name`         | `string`                  | Yes      | Unique tool name                      |
| `title`        | `string`                  | No       | Human-readable title                  |
| `description`  | `string`                  | No       | What the tool does                    |
| `inputSchema`  | `ZodRawShape`             | No       | Zod schema for input parameters       |
| `outputSchema` | `ZodRawShape`             | No       | Zod schema for structured output      |
| `annotations`  | `Record<string, unknown>` | No       | Hints (readOnlyHint, destructiveHint) |

### @McpResource

Registers a method as an MCP resource handler. Supports both static URIs and URI templates.

```typescript
import { McpResource } from '@pixel-brewery/archipel-platform-mcp';

@Injectable()
class ConfigResources {
    // Static resource
    @McpResource({
        name: 'app-config',
        uri: 'config://application',
        mimeType: 'application/json',
        description: 'Application configuration',
    })
    public getAppConfig() {
        return {
            contents: [
                {
                    uri: 'config://application',
                    text: JSON.stringify({ debug: false }),
                },
            ],
        };
    }

    // Template resource (dynamic)
    @McpResource({
        name: 'user-profile',
        uri: 'users://{userId}/profile',
        mimeType: 'application/json',
    })
    public getUserProfile(uri: URL, params: { userId: string }) {
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify({ userId: params.userId, name: 'Jane' }),
                },
            ],
        };
    }
}
```

URIs containing `{…}` placeholders are automatically registered as `ResourceTemplate` instances.

**Options (`IMcpResourceMetadata`):**

| Property      | Type     | Required | Description                |
| ------------- | -------- | -------- | -------------------------- |
| `name`        | `string` | Yes      | Unique resource name       |
| `uri`         | `string` | Yes      | Static URI or URI template |
| `title`       | `string` | No       | Human-readable title       |
| `description` | `string` | No       | Resource description       |
| `mimeType`    | `string` | No       | MIME type of the content   |

### @McpPrompt

Registers a method as an MCP prompt handler.

```typescript
import { McpPrompt } from '@pixel-brewery/archipel-platform-mcp';
import { z } from 'zod';

@Injectable()
class PromptProviders {
    @McpPrompt({
        name: 'code-review',
        title: 'Code Review',
        description: 'Generates a code review prompt for the given code.',
        argsSchema: {
            code: z.string().describe('The code to review'),
            language: z.string().optional().describe('Programming language'),
        },
    })
    public codeReview(args: { code: string; language?: string }) {
        return {
            messages: [
                {
                    role: 'user' as const,
                    content: {
                        type: 'text' as const,
                        text: `Review this ${args.language ?? ''} code:\n\n${args.code}`,
                    },
                },
            ],
        };
    }
}
```

**Options (`IMcpPromptMetadata`):**

| Property      | Type          | Required | Description                |
| ------------- | ------------- | -------- | -------------------------- |
| `name`        | `string`      | Yes      | Unique prompt name         |
| `title`       | `string`      | No       | Human-readable title       |
| `description` | `string`      | No       | Prompt description         |
| `argsSchema`  | `ZodRawShape` | No       | Zod schema for prompt args |

---

## Transports

### Stdio

Best for CLI tools and process-spawned integrations (e.g., VS Code extensions).

```typescript
const app = await NestFactory.createApplicationContext(AppModule);
const mcpServer = app.get(McpServerService);
await mcpServer.connectStdio();
```

### Streamable HTTP

The recommended transport for HTTP-based deployments. Use with Express or any HTTP server.

```typescript
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { McpServerService } from '@pixel-brewery/archipel-platform-mcp';

const app = await NestFactory.createApplicationContext(AppModule);
const mcpServer = app.get(McpServerService);
const transport = await mcpServer.createStreamableHttpTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
    enableJsonResponse: false,
});

const httpApp = express();

httpApp.post('/mcp', async (req, res) => {
    await transport.handleRequest(req, res);
});

httpApp.get('/mcp', async (req, res) => {
    await transport.handleRequest(req, res);
});

httpApp.delete('/mcp', async (req, res) => {
    await transport.handleRequest(req, res);
});

httpApp.listen(3000);
```

### Server-Sent Events (SSE)

Legacy transport for clients that do not support Streamable HTTP.

```typescript
import express from 'express';
import { McpServerService } from '@pixel-brewery/archipel-platform-mcp';

const app = await NestFactory.createApplicationContext(AppModule);
const mcpServer = app.get(McpServerService);

const httpApp = express();

httpApp.get('/sse', async (req, res) => {
    const transport = await mcpServer.createSseTransport({ endpoint: '/messages' }, res);
});

httpApp.post('/messages', async (req, res) => {
    // Handle incoming messages from the SSE transport
});

httpApp.listen(3000);
```

### Custom Transport

Connect any transport implementing the MCP `Transport` interface:

```typescript
const customTransport: Transport = /* your implementation */;
await mcpServer.connectTransport(customTransport);
```

---

## Services

### McpServerService

The main entry point for controlling the MCP server at runtime.

| Method                                    | Description                                      |
| ----------------------------------------- | ------------------------------------------------ |
| `server: McpServer`                       | The underlying `McpServer` instance (read-only)  |
| `connectStdio()`                          | Connects a stdio transport                       |
| `createStreamableHttpTransport(options?)` | Creates and connects a Streamable HTTP transport |
| `createSseTransport(options, response)`   | Creates and connects an SSE transport            |
| `connectTransport(transport)`             | Connects any custom `Transport`                  |

### McpRegistryService

Holds all registered tools, resources, and prompts. Populated automatically by `McpDiscoveryService` but can also be used for manual registration.

| Property / Method                             | Description                  |
| --------------------------------------------- | ---------------------------- |
| `tools: Map<string, IRegisteredTool>`         | All registered tools         |
| `resources: Map<string, IRegisteredResource>` | All registered resources     |
| `prompts: Map<string, IRegisteredPrompt>`     | All registered prompts       |
| `registerTool(metadata, handler)`             | Manually register a tool     |
| `registerResource(metadata, handler)`         | Manually register a resource |
| `registerPrompt(metadata, handler)`           | Manually register a prompt   |

---

## API Reference

### Interfaces

| Interface                         | Description                                         |
| --------------------------------- | --------------------------------------------------- |
| `IMcpModuleOptions`               | Server name, version, capabilities, instructions    |
| `IMcpModuleAsyncOptions`          | Async module configuration (factory/class/existing) |
| `IMcpModuleOptionsFactory`        | Factory interface for async configuration           |
| `IMcpToolMetadata`                | Tool decorator options                              |
| `IMcpResourceMetadata`            | Resource decorator options                          |
| `IMcpPromptMetadata`              | Prompt decorator options                            |
| `IMcpHandlerMetadata`             | Internal handler discovery metadata                 |
| `IRegisteredTool`                 | Registered tool entry (metadata + handler)          |
| `IRegisteredResource`             | Registered resource entry (metadata + handler)      |
| `IRegisteredPrompt`               | Registered prompt entry (metadata + handler)        |
| `IStreamableHttpTransportOptions` | Streamable HTTP transport config                    |
| `ISseTransportOptions`            | SSE transport config                                |

### Constants

| Constant             | Description                        |
| -------------------- | ---------------------------------- |
| `MCP_MODULE_OPTIONS` | Injection token for module options |

### SDK Re-exports

For convenience, the following are re-exported from `@modelcontextprotocol/sdk`:

- `McpServer`
- `ResourceTemplate`
- `StdioServerTransport`
- `SSEServerTransport`
- `StreamableHTTPServerTransport`

---

## Resource Limits

| Limit            | Value     | Description                                                            |
| ---------------- | --------- | ---------------------------------------------------------------------- |
| Max transports   | 1,000     | `McpServerService` tracks up to 1,000 active transports                |
| Shutdown timeout | 5 seconds | Each transport and the server are closed with a 5-second timeout guard |

## Lifecycle

| Service               | Hook              | Behaviour                                                                                          |
| --------------------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| `McpDiscoveryService` | `OnModuleInit`    | Scans all providers for `@McpTool`, `@McpResource`, `@McpPrompt` decorators and registers handlers |
| `McpServerService`    | `OnModuleInit`    | Creates the underlying `McpServer` instance and registers discovered handlers                      |
| `McpServerService`    | `OnModuleDestroy` | Closes all active transports and the server with a 5-second timeout guard                          |

## Peer Dependencies

| Package                                   | Required | Notes                         |
| ----------------------------------------- | -------- | ----------------------------- |
| `@nestjs/common`                          | Yes      | NestJS core                   |
| `@nestjs/core`                            | Yes      | NestJS core                   |
| `@modelcontextprotocol/sdk`               | Yes      | MCP SDK                       |
| `zod`                                     | Yes      | Schema validation             |
| `rxjs`                                    | Yes      | NestJS peer requirement       |
| `reflect-metadata`                        | Yes      | Decorator metadata            |
| `@pixel-brewery/archipel-platform-health` | No       | Required for health indicator |
| `@nestjs/terminus`                        | No       | Required for health indicator |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-mcp/index.md`](../../.docs/packages/platform-mcp/index.md)

## Development

```bash
# Build
yarn nx build platform-mcp

# Test
yarn nx test platform-mcp

# Lint
yarn nx lint platform-mcp
```

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

Retained third-party license terms are included in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
