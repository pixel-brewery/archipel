---
title: MCP Server
description: Build a Model Context Protocol (MCP) server with tools, resources, and prompts for AI agent integration.
order: 13
---

# MCP Server

This guide covers building an MCP server with `platform-mcp`: defining tools, resources, and prompts that AI agents can discover and invoke, selecting transports, and registering everything with auto-discovery.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-mcp
```

---

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/) is an open standard for connecting AI agents to external tools and data sources. An MCP server exposes:

- **Tools** — Functions the AI can call (e.g., search a database, create a record)
- **Resources** — Data the AI can read (e.g., configuration, documentation)
- **Prompts** — Pre-built prompt templates the AI can use

`platform-mcp` provides decorators and a discovery service that auto-registers your tools, resources, and prompts.

---

## Module Registration

```typescript
import { Module } from '@nestjs/common';
import { McpModule } from '@pixel-brewery/archipel-platform-mcp';

@Module({
    imports: [
        McpModule.register({
            name: 'my-api-mcp',
            version: '1.0.0',
        }),
    ],
})
export class AppModule {}
```

Or asynchronously with configuration:

```typescript
import { McpModule } from '@pixel-brewery/archipel-platform-mcp';
import { ConfigService } from '@pixel-brewery/archipel-platform-core';

McpModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    name: configService.get('MCP_SERVER_NAME'),
    version: configService.get('MCP_SERVER_VERSION'),
  }),
  inject: [ConfigService],
}),
```

---

## Defining Tools

Use `@McpTool()` to define callable functions:

```typescript
import { Injectable } from '@nestjs/common';
import { McpTool } from '@pixel-brewery/archipel-platform-mcp';

@Injectable()
export class UserTools {
    @McpTool({
        name: 'search_users',
        description: 'Search for users by name or email',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search term' },
                limit: { type: 'number', description: 'Max results', default: 10 },
            },
            required: ['query'],
        },
    })
    public async searchUsers(params: { query: string; limit?: number }): Promise<unknown> {
        // Implementation: search your database and return results
    }

    @McpTool({
        name: 'get_user',
        description: 'Get a user by their ID',
        parameters: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'The user ID' },
            },
            required: ['userId'],
        },
    })
    public async getUser(params: { userId: string }): Promise<unknown> {
        // Implementation: fetch a single user
    }
}
```

---

## Defining Resources

Use `@McpResource()` to expose data that AI agents can read:

```typescript
import { Injectable } from '@nestjs/common';
import { McpResource } from '@pixel-brewery/archipel-platform-mcp';

@Injectable()
export class DocsResources {
    @McpResource({
        name: 'api_documentation',
        description: 'API documentation and usage guidelines',
        uri: 'docs://api/overview',
    })
    public async getApiDocs(): Promise<string> {
        return `
      # API Overview
      Base URL: https://api.yourapp.com/v1
      Authentication: Bearer token required
      Rate limit: 1000 requests/hour
    `;
    }
}
```

---

## Defining Prompts

Use `@McpPrompt()` to register reusable prompt templates:

```typescript
import { Injectable } from '@nestjs/common';
import { McpPrompt } from '@pixel-brewery/archipel-platform-mcp';

@Injectable()
export class AnalysisPrompts {
    @McpPrompt({
        name: 'analyze_user_activity',
        description: "Analyze a user's recent activity and provide insights",
        parameters: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'The user to analyze' },
                timeRange: { type: 'string', description: 'Time range (e.g., 7d, 30d)', default: '7d' },
            },
            required: ['userId'],
        },
    })
    public getTemplate(params: { userId: string; timeRange?: string }): string {
        return `Analyze the recent activity for user ${params.userId} over the last ${params.timeRange ?? '7d'}.
    Provide insights on usage patterns, feature adoption, and potential issues.`;
    }
}
```

---

## Auto-Discovery

`McpDiscoveryService` automatically finds and registers all classes that use `@McpTool`, `@McpResource`, or `@McpPrompt` decorators. Just ensure the classes are registered as NestJS providers:

```typescript
@Module({
    imports: [McpModule.register({ name: 'my-api-mcp', version: '1.0.0' })],
    providers: [UserTools, DocsResources, AnalysisPrompts],
})
export class McpFeatureModule {}
```

---

## Transport Options

MCP supports multiple transport protocols:

| Transport | When to use                                   |
| --------- | --------------------------------------------- |
| **SSE**   | Browser-based AI agents, streaming responses  |
| **HTTP**  | Standard REST-based AI agent communication    |
| **Stdio** | CLI tools, local development, piped processes |

The `McpServerService` handles transport negotiation automatically.

---

## Connecting the Guides

The MCP server can expose Archipel's guides as resources. This makes your documentation discoverable by AI agents:

```typescript
@Injectable()
export class GuideResources {
    @McpResource({
        name: 'guide_authentication',
        description: 'Guide for setting up authentication and authorization',
        uri: 'docs://guides/authentication-and-authorization',
    })
    public async getAuthGuide(): Promise<string> {
        // Read and return the guide content
    }
}
```

---

## Operational Limits

| Limit                | Value     | Description                                                          |
| -------------------- | --------- | -------------------------------------------------------------------- |
| **Max transports**   | 1,000     | `McpServerService` tracks up to 1,000 concurrent transports          |
| **Shutdown timeout** | 5 seconds | Transports and server are closed with a 5-second timeout on shutdown |

---

## Next Steps

- Browse the [platform-mcp API reference](/packages/platform-mcp/api/) for complete decorator options
- See the [Getting Started](/guides/getting-started) guide for basic module setup

## Consuming the Published Tools

The shared [MCP client](/packages/platform-mcp/#client-connections) discovers the standard tool definitions emitted by this existing decorator and registry pipeline. Intelligence Agents consumes that client through its [tool adapter](/packages/platform-intelligence-agents/#mcp-tools); no second server registration is required.
