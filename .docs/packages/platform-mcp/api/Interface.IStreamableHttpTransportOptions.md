---
title: 'Interface: IStreamableHttpTransportOptions'
generated: true
editUrl: false
---

# Interface: IStreamableHttpTransportOptions

Defined in: [libs/platform-mcp/src/interfaces/IStreamableHttpTransportOptions.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IStreamableHttpTransportOptions.ts#L4)

Options for creating a Streamable HTTP transport.

## Properties

### enableJsonResponse?

```ts
readonly enableJsonResponse?: boolean;
```

Defined in: [libs/platform-mcp/src/interfaces/IStreamableHttpTransportOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IStreamableHttpTransportOptions.ts#L9)

Whether to enable JSON-only response mode (no SSE).

---

### sessionIdGenerator?

```ts
readonly sessionIdGenerator?: () => string;
```

Defined in: [libs/platform-mcp/src/interfaces/IStreamableHttpTransportOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IStreamableHttpTransportOptions.ts#L6)

Function to generate session IDs. Defaults to crypto.randomUUID.

#### Returns

`string`
