---
title: 'Class: McpDiscoveryService'
generated: true
editUrl: false
---

# Class: McpDiscoveryService

Defined in: [libs/platform-mcp/src/services/McpDiscoveryService.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpDiscoveryService.ts#L16)

Discovers all NestJS providers that have methods decorated with
`@McpTool`, `@McpResource`, or `@McpPrompt` and registers them
in the [McpRegistryService](Class.McpRegistryService).

## Implements

- `OnModuleInit`

## Constructors

### Constructor

```ts
new McpDiscoveryService(
   discoveryService,
   metadataScanner,
   registry
): McpDiscoveryService;
```

Defined in: [libs/platform-mcp/src/services/McpDiscoveryService.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpDiscoveryService.ts#L36)

Creates handler discovery over the application's registered NestJS providers.

#### Parameters

| Parameter          | Type                                             | Description                                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------------------- |
| `discoveryService` | `DiscoveryService`                               | Inventory of instantiated application providers.        |
| `metadataScanner`  | `MetadataScanner`                                | NestJS metadata scanner supplied by module composition. |
| `registry`         | [`McpRegistryService`](Class.McpRegistryService) | Catalog receiving each discovered, bound handler.       |

#### Returns

`McpDiscoveryService`

## Methods

### discoverHandlers()

```ts
discoverHandlers(): void;
```

Defined in: [libs/platform-mcp/src/services/McpDiscoveryService.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpDiscoveryService.ts#L65)

Discovers and registers MCP handlers exactly once.

#### Returns

`void`

#### Remarks

`McpServerService` invokes this method explicitly before it snapshots
the registry. This avoids relying on relative lifecycle-hook ordering,
which changed in NestJS 12.

---

### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [libs/platform-mcp/src/services/McpDiscoveryService.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpDiscoveryService.ts#L53)

Called by NestJS after the module is initialized.
Scans all providers and registers discovered MCP handlers.

#### Returns

`void`

#### Implementation of

`OnModuleInit.onModuleInit`
