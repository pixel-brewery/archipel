---
title: 'Class: McpClientHealthIndicator'
generated: true
editUrl: false
---

# Class: McpClientHealthIndicator

Defined in: [libs/platform-mcp/src/client/McpClientHealthIndicator.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClientHealthIndicator.ts#L10)

Register with HealthOrchestrator for each configured MCP client. No credentials appear in its result.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new McpClientHealthIndicator(client, key?): McpClientHealthIndicator;
```

Defined in: [libs/platform-mcp/src/client/McpClientHealthIndicator.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClientHealthIndicator.ts#L27)

Creates a readiness indicator for an explicitly owned MCP client.

#### Parameters

| Parameter | Type                                   | Default value  | Description                                                                     |
| --------- | -------------------------------------- | -------------- | ------------------------------------------------------------------------------- |
| `client`  | [`McpClientBase`](Class.McpClientBase) | `undefined`    | Client whose independent protocol probe determines readiness.                   |
| `key?`    | `string`                               | `'mcp-client'` | Unique result key used when registering this indicator with HealthOrchestrator. |

#### Returns

`McpClientHealthIndicator`

## Properties

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-mcp/src/client/McpClientHealthIndicator.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClientHealthIndicator.ts#L15)

Key used to identify this client in the health result.

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): Promise<Record<string, {
  status: "up" | "down";
}>>;
```

Defined in: [libs/platform-mcp/src/client/McpClientHealthIndicator.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/McpClientHealthIndicator.ts#L42)

Reports protocol readiness without exposing endpoint, credentials or provider diagnostics.

#### Returns

`Promise`\<`Record`\<`string`, \{
`status`: `"up"` \| `"down"`;
\}\>\>

A health result keyed by this indicator's configured registration key.

#### Implementation of

`IHealthIndicator.check`
