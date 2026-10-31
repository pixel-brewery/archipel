---
title: '@pixel-brewery/archipel-platform-mcp'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-mcp

## Classes

| Class                                                      | Description                                                                                                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [McpClient](Class.McpClient)                               | Adapts Streamable HTTP MCP connections to bounded remote tool operations.                                                                                                             |
| [McpClientBase](Class.McpClientBase)                       | Defines bounded remote-tool operations for a caller-owned MCP connection.                                                                                                             |
| [McpClientError](Class.McpClientError)                     | Represents a sanitized configuration, protocol or lifecycle failure at the MCP client boundary.                                                                                       |
| [McpClientHealthIndicator](Class.McpClientHealthIndicator) | Register with HealthOrchestrator for each configured MCP client. No credentials appear in its result.                                                                                 |
| [McpDiscoveryService](Class.McpDiscoveryService)           | Discovers all NestJS providers that have methods decorated with `@McpTool`, `@McpResource`, or `@McpPrompt` and registers them in the [McpRegistryService](Class.McpRegistryService). |
| [McpHealthIndicator](Class.McpHealthIndicator)             | Health indicator for the MCP server infrastructure. Verifies that at least one tool, resource, or prompt handler is registered.                                                       |
| [McpModule](Class.McpModule)                               | NestJS dynamic module that bootstraps an MCP server.                                                                                                                                  |
| [McpRegistryService](Class.McpRegistryService)             | Central registry that stores all MCP tool, resource, and prompt handlers discovered from NestJS providers.                                                                            |
| [McpServerService](Class.McpServerService)                 | Manages the MCP server lifecycle. Creates the `McpServer` instance, registers all discovered handlers from the registry, and provides methods to connect various transports.          |

## Interfaces

| Interface                                                                    | Description                                                                                     |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [IMcpClientOptions](Interface.IMcpClientOptions)                             | Explicit MCP connection settings; credentials must be supplied by the consumer's ConfigService. |
| [IMcpHandlerMetadata](Interface.IMcpHandlerMetadata)                         | Internal metadata stored for each decorated handler method.                                     |
| [IMcpModuleAsyncOptions](Interface.IMcpModuleAsyncOptions)                   | Async options for configuring the MCP module via a factory.                                     |
| [IMcpModuleOptions](Interface.IMcpModuleOptions)                             | Options for configuring the MCP module.                                                         |
| [IMcpModuleOptionsFactory](Interface.IMcpModuleOptionsFactory)               | Factory interface for creating MCP module options.                                              |
| [IMcpPromptMetadata](Interface.IMcpPromptMetadata)                           | Metadata describing an MCP prompt registration.                                                 |
| [IMcpResourceMetadata](Interface.IMcpResourceMetadata)                       | Metadata describing an MCP resource registration.                                               |
| [IMcpToolMetadata](Interface.IMcpToolMetadata)                               | Metadata describing an MCP tool registration.                                                   |
| [IRegisteredPrompt](Interface.IRegisteredPrompt)                             | Entry for a registered prompt handler.                                                          |
| [IRegisteredResource](Interface.IRegisteredResource)                         | Entry for a registered resource handler.                                                        |
| [IRegisteredTool](Interface.IRegisteredTool)                                 | Entry for a registered tool handler.                                                            |
| [ISseTransportOptions](Interface.ISseTransportOptions)                       | Options for creating an SSE transport.                                                          |
| [IStreamableHttpTransportOptions](Interface.IStreamableHttpTransportOptions) | Options for creating a Streamable HTTP transport.                                               |

## Variables

| Variable                                            | Description                              |
| --------------------------------------------------- | ---------------------------------------- |
| [MCP\_MODULE\_OPTIONS](Variable.MCP_MODULE_OPTIONS) | Injection tokens used by the MCP module. |

## Functions

| Function                            | Description                                |
| ----------------------------------- | ------------------------------------------ |
| [McpPrompt](Function.McpPrompt)     | Marks a method as an MCP prompt handler.   |
| [McpResource](Function.McpResource) | Marks a method as an MCP resource handler. |
| [McpTool](Function.McpTool)         | Marks a method as an MCP tool handler.     |
