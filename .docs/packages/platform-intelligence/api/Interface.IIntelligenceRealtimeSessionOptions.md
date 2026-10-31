---
title: 'Interface: IIntelligenceRealtimeSessionOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeSessionOptions

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L16)

Options used to create one server-owned WebSocket realtime connection.

## Properties

### activeToolNames?

```ts
readonly activeToolNames?: readonly string[];
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L38)

Optional allow-list of registered Archipel tools exposed to this session.

---

### connectionMode?

```ts
readonly connectionMode?: "auto" | "client-secret-websocket" | "server-websocket";
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L32)

Connection mode. `auto` selects a supported server WebSocket first, then the legacy client-secret WebSocket.

---

### metadata?

```ts
readonly metadata?: Readonly<Record<string, IntelligenceRealtimeMetadataValue>>;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L41)

Bounded, non-sensitive correlation metadata copied to metering events.

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L26)

Realtime model identifier such as `gpt-realtime`.

---

### onClose?

```ts
readonly onClose?: (event) => void | Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L50)

Receives the terminal upstream connection state.

#### Parameters

| Parameter | Type                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `event`   | [`IIntelligenceRealtimeCloseEvent`](Interface.IIntelligenceRealtimeCloseEvent) |

#### Returns

`void` \| `Promise`\<`void`\>

---

### onError?

```ts
readonly onError?: (error) => void | Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L47)

Receives transport, provider, parsing, and metering adapter failures.

#### Parameters

| Parameter | Type    |
| --------- | ------- |
| `error`   | `Error` |

#### Returns

`void` \| `Promise`\<`void`\>

---

### onEvent?

```ts
readonly onEvent?: (event) => void | Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L44)

Receives normalized provider events in wire order.

#### Parameters

| Parameter | Type                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `event`   | [`IntelligenceRealtimeServerEvent`](TypeAlias.IntelligenceRealtimeServerEvent) |

#### Returns

`void` \| `Promise`\<`void`\>

---

### provider?

```ts
readonly provider?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L29)

Optional provider override. Defaults to the configured intelligence provider.

---

### requestId?

```ts
readonly requestId?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L20)

Correlation identifier included in structured Archipel logs.

---

### sessionConfiguration?

```ts
readonly sessionConfiguration?: IIntelligenceRealtimeSessionConfiguration;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L35)

Provider-neutral realtime session configuration.

---

### sessionId

```ts
readonly sessionId: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L23)

Application-owned identifier used for persistence, billing, and audit correlation.
