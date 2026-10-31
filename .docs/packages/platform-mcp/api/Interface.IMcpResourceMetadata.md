---
title: 'Interface: IMcpResourceMetadata'
generated: true
editUrl: false
---

# Interface: IMcpResourceMetadata

Defined in: [libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts#L4)

Metadata describing an MCP resource registration.

## Properties

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts#L19)

Description of the resource.

---

### mimeType?

```ts
readonly mimeType?: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts#L22)

MIME type of the resource content.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts#L6)

Unique name of the resource.

---

### title?

```ts
readonly title?: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts#L16)

Human-readable title of the resource.

---

### uri

```ts
readonly uri: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpResourceMetadata.ts#L13)

URI or URI template for the resource.
Use a plain string for static resources, or a `ResourceTemplate` pattern
(e.g. `users://{userId}/profile`) for dynamic resources.
