---
title: MCP Server
description: A Model Context Protocol server that provides Archipel platform knowledge and code patterns to AI tools.
order: 1
---

# MCP Server

The Archipel MCP server is a standalone [Model Context Protocol](https://modelcontextprotocol.io/) server that provides platform documentation and code generation patterns to AI-powered development tools like GitHub Copilot, Cursor, or any MCP-compatible client.

It runs as a local process via stdio transport — no NestJS runtime or server infrastructure required.

## Installation

Before running the package, configure GitHub Packages authentication as
described in [Getting Started](/guides/getting-started#install-the-foundation).
The `npx` process uses the configured `.npmrc` and `NODE_AUTH_TOKEN`.

Run the MCP server directly via npx — no local build or clone required:

```bash
npx -y @pixel-brewery/archipel-mcp
```

## Configuration

Add the server to your editor's MCP configuration. The exact format depends on your editor.

### VS Code (`.vscode/mcp.json`)

```json
{
    "servers": {
        "archipel": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@pixel-brewery/archipel-mcp"]
        }
    }
}
```

### Cursor (`.cursor/mcp.json`)

```json
{
    "mcpServers": {
        "archipel": {
            "command": "npx",
            "args": ["-y", "@pixel-brewery/archipel-mcp"]
        }
    }
}
```

### Codex

Codex supports MCP servers both in the CLI and in the IDE extension.

#### Option 1: Add via CLI

Run the following command to register the Archipel MCP server in Codex:

```bash
codex mcp add archipel -- npx -y @pixel-brewery/archipel-mcp
```

Use `codex mcp --help` to see all available MCP management commands.

#### Option 2: Add via config.toml

You can also configure the server manually in `~/.codex/config.toml` or in a project-scoped `.codex/config.toml`:

```toml
[mcp_servers.archipel]
command = "npx"
args = ["-y", "@pixel-brewery/archipel-mcp"]
```

Once configured, your AI assistant can query the server for Archipel documentation and generate code using the platform's established patterns.

## Available Tools

The server exposes tools in two categories: documentation lookup and code pattern generation.

### Documentation Tools

| Tool              | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `list-packages`   | Lists all platform packages with their descriptions and tags.            |
| `get-package-doc` | Returns the full documentation and API reference for a specific package. |
| `search-docs`     | Performs a keyword search across all package documentation.              |

These tools give AI assistants access to the same content you see on this documentation site, so they can answer questions about package capabilities, abstract base contracts, and configuration options without hallucinating.

### Code Pattern Tools

These tools return detailed pattern documentation. When optional parameters are provided, they generate tailored code scaffolds that follow Archipel conventions.

| Tool                         | Description                                                                                     | Optional Parameters                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `get-query-pattern`          | Repository query pattern with `IRepositoryQuery`, `query()` factory, and transactional support. | `modelName`, `fields` — generates a model-specific query scaffold   |
| `get-repository-pattern`     | `RepositoryBase` subclass pattern with the `execute(query)` flow.                               | `modelName` — generates a typed repository class                    |
| `get-mapping-pattern`        | Type-safe `MappingService` pattern with `MappingProfileBase` and branded keys.                  | `entityName`, `fields` — generates a complete mapping profile       |
| `get-module-pattern`         | Dynamic module pattern with `register()`, abstract base definitions, and adapter DI wiring.     | `moduleName`, `bases` — scaffolds a full module with abstract bases |
| `get-error-handling-pattern` | Platform errors, exception filters, and structured error responses.                             | —                                                                   |
| `get-config-pattern`         | Typed config keys with `createConfigKey<T>()` and `ConfigRegistry`.                             | —                                                                   |
| `get-guard-pattern`          | Metadata-driven guards, interceptors, and the Decorator → Guard → Interceptor pattern.          | —                                                                   |
| `get-dto-pattern`            | class-validator DTOs with OpenAPI decorators and cross-field validation.                        | —                                                                   |
| `get-testing-pattern`        | Vitest test conventions and mocking patterns for repositories, services, and mappings.          | —                                                                   |

### How Scaffolding Works

When you provide optional parameters to a pattern tool, the server appends a generated code scaffold to the pattern documentation. For example, calling `get-repository-pattern` with `modelName: "Order"` returns both the general pattern explanation and a ready-to-use `OrderRepository` class.

This means AI assistants can generate code that follows your exact project conventions instead of generic NestJS patterns.
