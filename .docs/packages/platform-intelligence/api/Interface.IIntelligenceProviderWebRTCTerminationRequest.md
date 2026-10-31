---
title: 'Interface: IIntelligenceProviderWebRTCTerminationRequest'
generated: true
editUrl: false
---

# Interface: IIntelligenceProviderWebRTCTerminationRequest

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCTerminationRequest.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCTerminationRequest.ts#L15)

Provider request to end one browser-owned WebRTC realtime session.

The inherited configuration carries the resolved provider credentials, the
realtime model that selects the provider API, and the request timeouts.

## Extends

- [`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest)

## Properties

### abortSignal

```ts
readonly abortSignal: AbortSignal;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCTerminationRequest.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCTerminationRequest.ts#L22)

Aborts the outstanding provider request when the termination budget expires.

---

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

### providerSessionId

```ts
readonly providerSessionId: string;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCTerminationRequest.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCTerminationRequest.ts#L19)

Provider session identifier returned by the provider during WebRTC setup.
