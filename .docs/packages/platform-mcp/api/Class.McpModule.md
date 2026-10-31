---
title: 'Class: McpModule'
generated: true
editUrl: false
---

# Class: McpModule

Defined in: [libs/platform-mcp/src/module/McpModule.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/module/McpModule.ts#L26)

NestJS dynamic module that bootstraps an MCP server.

Import via `McpModule.register()` for synchronous configuration
or `McpModule.registerAsync()` for factory-based configuration.

## Example

```typescript
McpModule.register({
    name: 'my-mcp-server',
    version: '1.0.0',
});
```

## Constructors

### Constructor

```ts
new McpModule(): McpModule;
```

#### Returns

`McpModule`

## Methods

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-mcp/src/module/McpModule.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/module/McpModule.ts#L44)

Registers the MCP module with synchronous options.

#### Parameters

| Parameter | Type                                               | Description               |
| --------- | -------------------------------------------------- | ------------------------- |
| `options` | [`IMcpModuleOptions`](Interface.IMcpModuleOptions) | MCP server configuration. |

#### Returns

`DynamicModule`

A configured dynamic module.

---

### registerAsync()

```ts
static registerAsync(options): DynamicModule;
```

Defined in: [libs/platform-mcp/src/module/McpModule.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/module/McpModule.ts#L65)

Registers the MCP module with asynchronous options.

#### Parameters

| Parameter | Type                                                         | Description                     |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `options` | [`IMcpModuleAsyncOptions`](Interface.IMcpModuleAsyncOptions) | Async MCP server configuration. |

#### Returns

`DynamicModule`

A configured dynamic module.
