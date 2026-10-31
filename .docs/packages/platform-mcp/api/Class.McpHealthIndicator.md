---
title: 'Class: McpHealthIndicator'
generated: true
editUrl: false
---

# Class: McpHealthIndicator

Defined in: [libs/platform-mcp/src/health/McpHealthIndicator.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/health/McpHealthIndicator.ts#L13)

Health indicator for the MCP server infrastructure.
Verifies that at least one tool, resource, or prompt handler is registered.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new McpHealthIndicator(registry?): McpHealthIndicator;
```

Defined in: [libs/platform-mcp/src/health/McpHealthIndicator.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/health/McpHealthIndicator.ts#L30)

Creates the local server readiness projection.

#### Parameters

| Parameter   | Type                                             | Description                                                                |
| ----------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| `registry?` | [`McpRegistryService`](Class.McpRegistryService) | Optional server handler registry; absence reports disabled infrastructure. |

#### Returns

`McpHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'mcp';
```

Defined in: [libs/platform-mcp/src/health/McpHealthIndicator.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/health/McpHealthIndicator.ts#L17)

Key identifying server handler readiness in the combined health result.

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): HealthIndicatorResult<string>;
```

Defined in: [libs/platform-mcp/src/health/McpHealthIndicator.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/health/McpHealthIndicator.ts#L49)

Verifies that the MCP registry has at least one registered handler.
Returns disabled status when no registry is configured.

#### Returns

`HealthIndicatorResult`\<`string`\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
