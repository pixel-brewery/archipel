---
title: 'Interface: IIntelligenceProviderLoadRequest'
generated: true
editUrl: false
---

# Interface: IIntelligenceProviderLoadRequest

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L13)

Internal model/API load request passed to a provider adapter.

## Extended by

- [`IIntelligenceProviderWebRTCConversationHistoryRequest`](Interface.IIntelligenceProviderWebRTCConversationHistoryRequest)
- [`IIntelligenceProviderWebRTCTerminationRequest`](Interface.IIntelligenceProviderWebRTCTerminationRequest)

## Properties

### capability

```ts
readonly capability: IntelligenceCapability;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L16)

---

### configuration

```ts
readonly configuration: IIntelligenceProviderConfiguration;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L17)

---

### operationTimeoutMs

```ts
readonly operationTimeoutMs: number;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L19)

Total timeout for the complete capability operation, including retries and polling.

---

### providerRequestTimeoutMs

```ts
readonly providerRequestTimeoutMs: number;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderLoadRequest.ts#L22)

Timeout for one outbound provider request.
