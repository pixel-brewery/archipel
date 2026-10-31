---
title: 'Class: McpToolAdapter'
generated: true
editUrl: false
---

# Class: McpToolAdapter

Defined in: [libs/platform-intelligence-agents/src/mcp/McpToolAdapter.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/mcp/McpToolAdapter.ts#L11)

Adapts the shared MCP client's protocol tools to the canonical intelligence tool contract.

## Constructors

### Constructor

```ts
new McpToolAdapter(clients, maxTools?): McpToolAdapter;
```

Defined in: [libs/platform-intelligence-agents/src/mcp/McpToolAdapter.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/mcp/McpToolAdapter.ts#L27)

Creates a bounded tool adapter and takes ownership of its shared MCP clients.

#### Parameters

| Parameter   | Type                       | Default value | Description                                                             |
| ----------- | -------------------------- | ------------- | ----------------------------------------------------------------------- |
| `clients`   | readonly `McpClientBase`[] | `undefined`   | Clients to discover and close, including clients whose discovery fails. |
| `maxTools?` | `number`                   | `128`         | Maximum combined catalog size; defaults to 128 and cannot exceed 128.   |

#### Returns

`McpToolAdapter`

#### Throws

When more than 16 clients are supplied or the tool budget is invalid.

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [libs/platform-intelligence-agents/src/mcp/McpToolAdapter.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/mcp/McpToolAdapter.ts#L59)

Closes every owned client, including clients whose discovery failed.

#### Returns

`Promise`\<`void`\>

Resolves when all client cleanup attempts complete successfully.

#### Throws

When one or more clients fail to close.

---

### discoverTools()

```ts
discoverTools(): Promise<Readonly<Record<string, IIntelligenceToolDefinition<unknown, unknown>>>>;
```

Defined in: [libs/platform-intelligence-agents/src/mcp/McpToolAdapter.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/mcp/McpToolAdapter.ts#L46)

Shares discovery and rejects collisions across servers, never silently overwriting tools.

#### Returns

`Promise`\<`Readonly`\<`Record`\<`string`, `IIntelligenceToolDefinition`\<`unknown`, `unknown`\>\>\>\>

The cached, collision-free catalog of remote tool definitions.

#### Throws

When the registry is closed, discovery fails or tool names/capacity are invalid.
