---
title: 'Interface: IMcpModuleOptionsFactory'
generated: true
editUrl: false
---

# Interface: IMcpModuleOptionsFactory

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleOptionsFactory.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleOptionsFactory.ts#L6)

Factory interface for creating MCP module options.

## Methods

### createMcpOptions()

```ts
createMcpOptions():
  | IMcpModuleOptions
| Promise<IMcpModuleOptions>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleOptionsFactory.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleOptionsFactory.ts#L12)

Supplies the server configuration requested during asynchronous module composition.

#### Returns

\| [`IMcpModuleOptions`](Interface.IMcpModuleOptions)
\| `Promise`\<[`IMcpModuleOptions`](Interface.IMcpModuleOptions)\>

Server options, synchronously or after application configuration has resolved.
