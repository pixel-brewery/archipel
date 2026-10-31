---
title: 'Interface: IMcpClientOptions'
generated: true
editUrl: false
---

# Interface: IMcpClientOptions

Defined in: [libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts#L6)

Explicit MCP connection settings; credentials must be supplied by the consumer's ConfigService.

## Properties

### authToken?

```ts
readonly authToken?: string;
```

Defined in: [libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts#L14)

Optional bearer credential supplied by consumer configuration and never included in logs.

---

### headers?

```ts
readonly headers?: Readonly<Record<string, string>>;
```

Defined in: [libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts#L18)

Additional request headers supplied by the consumer.

---

### maxTools?

```ts
readonly maxTools?: number;
```

Defined in: [libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts#L30)

Maximum discovered tools per client; defaults to 128 and cannot exceed 1024.

---

### name?

```ts
readonly name?: string;
```

Defined in: [libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts#L22)

Client name advertised during MCP protocol initialization; defaults to archipel-mcp-client.

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts#L26)

Connection and operation timeout in milliseconds; defaults to 5000, with a supported range of 1–60000.

---

### url

```ts
readonly url: string;
```

Defined in: [libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/client/interfaces/IMcpClientOptions.ts#L10)

Streamable HTTP endpoint supplied by consumer configuration.
