---
title: 'Interface: IMcpModuleAsyncOptions'
generated: true
editUrl: false
---

# Interface: IMcpModuleAsyncOptions

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts#L8)

Async options for configuring the MCP module via a factory.

## Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

## Properties

### inject?

```ts
readonly inject?: (InjectionToken | OptionalFactoryDependency)[];
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts#L10)

Injection tokens to make available to the factory.

---

### useClass?

```ts
readonly useClass?: Type<IMcpModuleOptionsFactory>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts#L19)

Optional class to instantiate as factory.

---

### useExisting?

```ts
readonly useExisting?: Type<IMcpModuleOptionsFactory>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts#L16)

Optional existing provider type.

---

### useFactory?

```ts
readonly useFactory?: (...args) =>
  | IMcpModuleOptions
| Promise<IMcpModuleOptions>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleAsyncOptions.ts#L13)

Factory function that returns module options (or a promise).

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| ...`args` | `unknown`[] |

#### Returns

\| [`IMcpModuleOptions`](Interface.IMcpModuleOptions)
\| `Promise`\<[`IMcpModuleOptions`](Interface.IMcpModuleOptions)\>
