---
title: 'Interface: IMcpHandlerMetadata'
generated: true
editUrl: false
---

# Interface: IMcpHandlerMetadata

Defined in: [libs/platform-mcp/src/interfaces/IMcpHandlerMetadata.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpHandlerMetadata.ts#L4)

Internal metadata stored for each decorated handler method.

## Properties

### metadata

```ts
readonly metadata: Record<string, unknown>;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpHandlerMetadata.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpHandlerMetadata.ts#L12)

The metadata associated with the registration.

---

### methodName

```ts
readonly methodName: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpHandlerMetadata.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpHandlerMetadata.ts#L9)

The method name on the provider class.

---

### type

```ts
readonly type: "tool" | "resource" | "prompt";
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpHandlerMetadata.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpHandlerMetadata.ts#L6)

Type of MCP capability.
