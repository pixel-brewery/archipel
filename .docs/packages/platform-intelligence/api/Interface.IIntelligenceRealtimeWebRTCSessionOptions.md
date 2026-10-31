---
title: 'Interface: IIntelligenceRealtimeWebRTCSessionOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeWebRTCSessionOptions

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.ts#L13)

Server-side SDP exchange for a browser-owned WebRTC realtime session.

## Extends

- `Pick`\<[`IIntelligenceRealtimeSessionOptions`](Interface.IIntelligenceRealtimeSessionOptions),
  \| `"requestId"`
  \| `"sessionId"`
  \| `"model"`
  \| `"provider"`
  \| `"sessionConfiguration"`\>

## Properties

### connectionMode

```ts
readonly connectionMode: "webrtc";
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.ts#L19)

---

### conversationHistory?

```ts
readonly conversationHistory?: readonly IIntelligenceRealtimeConversationTurn[];
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.ts#L37)

Earlier turns of the same conversation, oldest first, for a session that
continues it on a new provider connection, for example after a pause,
a dropped connection, or a page reload.

The provider receives the turns with the session setup as one quoted,
untrusted context block: never as instructions and never as the model's
own statements, so a browser-reported transcript cannot speak for the
model. The handover does not make the model respond. The history must
stay within `IntelligenceRealtimeConversationHistoryLimits`; a larger one
is rejected, not shortened. The result reports whether the provider
received it.

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L26)

Realtime model identifier such as `gpt-realtime`.

#### Inherited from

[`IIntelligenceRealtimeSessionOptions`](Interface.IIntelligenceRealtimeSessionOptions).[`model`](Interface.IIntelligenceRealtimeSessionOptions#model)

---

### offerSdp

```ts
readonly offerSdp: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.ts#L22)

Browser-generated SDP offer. The application must authenticate its caller.

---

### provider?

```ts
readonly provider?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L29)

Optional provider override. Defaults to the configured intelligence provider.

#### Inherited from

[`IIntelligenceRealtimeSessionOptions`](Interface.IIntelligenceRealtimeSessionOptions).[`provider`](Interface.IIntelligenceRealtimeSessionOptions#provider)

---

### requestId?

```ts
readonly requestId?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L20)

Correlation identifier included in structured Archipel logs.

#### Inherited from

[`IIntelligenceRealtimeSessionOptions`](Interface.IIntelligenceRealtimeSessionOptions).[`requestId`](Interface.IIntelligenceRealtimeSessionOptions#requestid)

---

### sessionConfiguration?

```ts
readonly sessionConfiguration?: IIntelligenceRealtimeSessionConfiguration;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L35)

Provider-neutral realtime session configuration.

#### Inherited from

[`IIntelligenceRealtimeSessionOptions`](Interface.IIntelligenceRealtimeSessionOptions).[`sessionConfiguration`](Interface.IIntelligenceRealtimeSessionOptions#sessionconfiguration)

---

### sessionId

```ts
readonly sessionId: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeSessionOptions.ts#L23)

Application-owned identifier used for persistence, billing, and audit correlation.

#### Inherited from

[`IIntelligenceRealtimeSessionOptions`](Interface.IIntelligenceRealtimeSessionOptions).[`sessionId`](Interface.IIntelligenceRealtimeSessionOptions#sessionid)
