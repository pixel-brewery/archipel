---
title: 'Interface: IIntelligenceProviderWebRTCConversationHistoryRequest'
generated: true
editUrl: false
---

# Interface: IIntelligenceProviderWebRTCConversationHistoryRequest

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCConversationHistoryRequest.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCConversationHistoryRequest.ts#L19)

Provider request to add earlier conversation turns to the setup of one
browser-owned WebRTC realtime session.

The inherited configuration carries the realtime model that selects the
provider API. The turns are already validated against
`IntelligenceRealtimeConversationHistoryLimits`.

## Extends

- [`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest)

## Properties

### capability

```ts
readonly capability: IntelligenceCapability;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L16)

#### Inherited from

[`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest).[`capability`](Interface.IIntelligenceProviderLoadRequest#capability)

---

### configuration

```ts
readonly configuration: IIntelligenceProviderConfiguration;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L17)

#### Inherited from

[`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest).[`configuration`](Interface.IIntelligenceProviderLoadRequest#configuration)

---

### conversationHistory

```ts
readonly conversationHistory: readonly IIntelligenceRealtimeConversationTurn[];
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCConversationHistoryRequest.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCConversationHistoryRequest.ts#L26)

Earlier turns of the conversation, oldest first.

---

### operationTimeoutMs

```ts
readonly operationTimeoutMs: number;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L19)

Total timeout for the complete capability operation, including retries and polling.

#### Inherited from

[`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest).[`operationTimeoutMs`](Interface.IIntelligenceProviderLoadRequest#operationtimeoutms)

---

### providerRequestTimeoutMs

```ts
readonly providerRequestTimeoutMs: number;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L22)

Timeout for one outbound provider request.

#### Inherited from

[`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest).[`providerRequestTimeoutMs`](Interface.IIntelligenceProviderLoadRequest#providerrequesttimeoutms)

---

### sessionConfiguration

```ts
readonly sessionConfiguration: IIntelligenceRealtimeSessionConfiguration;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCConversationHistoryRequest.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCConversationHistoryRequest.ts#L23)

Session configuration the application passed for the SDP exchange.
