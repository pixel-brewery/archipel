---
title: 'Class: McpRegistryService'
generated: true
editUrl: false
---

# Class: McpRegistryService

Defined in: [libs/platform-mcp/src/services/McpRegistryService.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpRegistryService.ts#L14)

Central registry that stores all MCP tool, resource, and prompt handlers
discovered from NestJS providers.

## Constructors

### Constructor

```ts
new McpRegistryService(): McpRegistryService;
```

#### Returns

`McpRegistryService`

## Accessors

### prompts

#### Get Signature

```ts
get prompts(): ReadonlyMap<string, IRegisteredPrompt>;
```

Defined in: [libs/platform-mcp/src/services/McpRegistryService.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpRegistryService.ts#L52)

Returns all registered prompts.

##### Returns

`ReadonlyMap`\<`string`, [`IRegisteredPrompt`](Interface.IRegisteredPrompt)\>

A readonly view of the authoritative local prompt registrations.

---

### resources

#### Get Signature

```ts
get resources(): ReadonlyMap<string, IRegisteredResource>;
```

Defined in: [libs/platform-mcp/src/services/McpRegistryService.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpRegistryService.ts#L43)

Returns all registered resources.

##### Returns

`ReadonlyMap`\<`string`, [`IRegisteredResource`](Interface.IRegisteredResource)\>

A readonly view of the authoritative local resource registrations.

---

### tools

#### Get Signature

```ts
get tools(): ReadonlyMap<string, IRegisteredTool>;
```

Defined in: [libs/platform-mcp/src/services/McpRegistryService.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpRegistryService.ts#L34)

Returns all registered tools.

##### Returns

`ReadonlyMap`\<`string`, [`IRegisteredTool`](Interface.IRegisteredTool)\>

A readonly view of the authoritative local tool registrations.

## Methods

### registerPrompt()

```ts
registerPrompt(metadata, handler): void;
```

Defined in: [libs/platform-mcp/src/services/McpRegistryService.ts:96](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpRegistryService.ts#L96)

Registers a prompt handler.

#### Parameters

| Parameter  | Type                                                 | Description                                      |
| ---------- | ---------------------------------------------------- | ------------------------------------------------ |
| `metadata` | [`IMcpPromptMetadata`](Interface.IMcpPromptMetadata) | Prompt metadata from the decorator.              |
| `handler`  | (...`args`) => `unknown`                             | Bound method that handles the prompt generation. |

#### Returns

`void`

---

### registerResource()

```ts
registerResource(metadata, handler): void;
```

Defined in: [libs/platform-mcp/src/services/McpRegistryService.ts:81](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpRegistryService.ts#L81)

Registers a resource handler.

#### Parameters

| Parameter  | Type                                                     | Description                                  |
| ---------- | -------------------------------------------------------- | -------------------------------------------- |
| `metadata` | [`IMcpResourceMetadata`](Interface.IMcpResourceMetadata) | Resource metadata from the decorator.        |
| `handler`  | (...`args`) => `unknown`                                 | Bound method that handles the resource read. |

#### Returns

`void`

---

### registerTool()

```ts
registerTool(metadata, handler): void;
```

Defined in: [libs/platform-mcp/src/services/McpRegistryService.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/services/McpRegistryService.ts#L66)

Registers a tool handler.

#### Parameters

| Parameter  | Type                                             | Description                                    |
| ---------- | ------------------------------------------------ | ---------------------------------------------- |
| `metadata` | [`IMcpToolMetadata`](Interface.IMcpToolMetadata) | Tool metadata from the decorator.              |
| `handler`  | (...`args`) => `unknown`                         | Bound method that handles the tool invocation. |

#### Returns

`void`
