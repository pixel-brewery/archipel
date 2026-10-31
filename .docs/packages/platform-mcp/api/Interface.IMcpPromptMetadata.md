---
title: 'Interface: IMcpPromptMetadata'
generated: true
editUrl: false
---

# Interface: IMcpPromptMetadata

Defined in: [libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts#L6)

Metadata describing an MCP prompt registration.

## Properties

### argsSchema?

```ts
readonly argsSchema?: Record<string, ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts#L17)

Zod schema defining the prompt's arguments.

---

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts#L14)

Description of the prompt.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts#L8)

Unique name of the prompt.

---

### title?

```ts
readonly title?: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpPromptMetadata.ts#L11)

Human-readable title of the prompt.
