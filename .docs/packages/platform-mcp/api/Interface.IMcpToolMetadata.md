---
title: 'Interface: IMcpToolMetadata'
generated: true
editUrl: false
---

# Interface: IMcpToolMetadata

Defined in: [libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts#L6)

Metadata describing an MCP tool registration.

## Properties

### annotations?

```ts
readonly annotations?: Record<string, unknown>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts#L23)

Annotations for the tool (e.g. readOnlyHint, destructiveHint).

---

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts#L14)

Description of what the tool does.

---

### inputSchema?

```ts
readonly inputSchema?: Record<string, ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts#L17)

Zod schema defining the tool's input parameters.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts#L8)

Unique name of the tool.

---

### outputSchema?

```ts
readonly outputSchema?: Record<string, ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts#L20)

Zod schema defining the tool's structured output.

---

### requiredScopes?

```ts
readonly requiredScopes?: readonly string[];
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts#L26)

Required scopes checked against SDK `authInfo.scopes`; trusted legacy `extra.scopes` remains supported.

---

### title?

```ts
readonly title?: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpToolMetadata.ts#L11)

Human-readable title of the tool.
