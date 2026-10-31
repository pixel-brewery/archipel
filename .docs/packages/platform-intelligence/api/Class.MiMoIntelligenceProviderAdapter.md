---
title: 'Class: MiMoIntelligenceProviderAdapter'
generated: true
editUrl: false
---

# Class: MiMoIntelligenceProviderAdapter

Defined in: [libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts#L24)

Xiaomi MiMo OpenAI-compatible language adapter.

## Extends

- [`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase)

## Constructors

### Constructor

```ts
new MiMoIntelligenceProviderAdapter(configService): MiMoIntelligenceProviderAdapter;
```

Defined in: [libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts#L33)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`MiMoIntelligenceProviderAdapter`

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`constructor`](Class.IntelligenceProviderAdapterBase#constructor)

## Properties

### capabilities

```ts
readonly capabilities: readonly ["language"];
```

Defined in: [libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts#L43)

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`capabilities`](Class.IntelligenceProviderAdapterBase#capabilities)

---

### provider

```ts
readonly provider: "mimo" = IntelligenceProviderNames.MiMo;
```

Defined in: [libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts#L42)

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`provider`](Class.IntelligenceProviderAdapterBase#provider)

## Methods

### applyWebRTCConversationHistory()?

```ts
applyWebRTCConversationHistory ? request : Promise<IIntelligenceRealtimeSessionConfiguration | null>;
```

Defined in: [libs/platform-intelligence/src/providers/abstracts/IntelligenceProviderAdapterBase.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/abstracts/IntelligenceProviderAdapterBase.ts#L68)

Adds earlier conversation turns to the setup of a browser-owned WebRTC
realtime session and returns the session configuration to send.

Implementing this method declares that the provider can receive earlier
turns during WebRTC setup. Implementations quote all turns in one
untrusted context block, never as instructions, system content, or the
model's own statements, through a provider mechanism that does not make
the model respond. The rendered history of any validated request must
fit the provider's own limits. Implementations resolve `null` without a
provider request when the request's model API cannot receive earlier
turns; the realtime session factory then reports `unsupported`.
Adapters without this capability omit the method.

#### Parameters

| Parameter | Type                                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderWebRTCConversationHistoryRequest`](Interface.IIntelligenceProviderWebRTCConversationHistoryRequest) |

#### Returns

`Promise`\<
\| [`IIntelligenceRealtimeSessionConfiguration`](Interface.IIntelligenceRealtimeSessionConfiguration)
\| `null`\>

#### Inherited from

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`applyWebRTCConversationHistory`](Class.IntelligenceProviderAdapterBase#applywebrtcconversationhistory)

---

### closeWebRTCSession()?

```ts
closeWebRTCSession ? request : Promise<IIntelligenceProviderWebRTCClosure | null>;
```

Defined in: [libs/platform-intelligence/src/providers/abstracts/IntelligenceProviderAdapterBase.ts:106](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/abstracts/IntelligenceProviderAdapterBase.ts#L106)

Ends a browser-owned WebRTC realtime session through the provider's
server control channel and returns the final usage the provider
reports while closing it.

Implement this method only for providers that report a session's final
billable usage exclusively on such a channel, and only together with
`terminateWebRTCSession`. The realtime session factory calls it first,
within a share of its termination budget, and falls back to
`terminateWebRTCSession` when it resolves `null` for a model whose API
has no control channel, throws, or runs out of time. Implementations
honour `abortSignal`, resolve `already-ended` when the provider no
longer knows the session, and never propagate provider error text.

#### Parameters

| Parameter | Type                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderWebRTCTerminationRequest`](Interface.IIntelligenceProviderWebRTCTerminationRequest) |

#### Returns

`Promise`\<
\| [`IIntelligenceProviderWebRTCClosure`](Interface.IIntelligenceProviderWebRTCClosure)
\| `null`\>

#### Inherited from

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`closeWebRTCSession`](Class.IntelligenceProviderAdapterBase#closewebrtcsession)

---

### load()

```ts
load(request): Promise<unknown>;
```

Defined in: [libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/mimo/MiMoIntelligenceProviderAdapter.ts#L49)

#### Parameters

| Parameter | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest) |

#### Returns

`Promise`\<`unknown`\>

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`load`](Class.IntelligenceProviderAdapterBase#load)

---

### probe()?

```ts
probe ? request : Promise<IIntelligenceProviderProbeResult>;
```

Defined in: [libs/platform-intelligence/src/providers/abstracts/IntelligenceProviderAdapterBase.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/abstracts/IntelligenceProviderAdapterBase.ts#L50)

Performs an optional, lightweight remote readiness probe.

Adapters without a provider-supported probe can omit this method. The
diagnostics facade then reports degraded local readiness after model
materialization. Operational calls remain isolated behind Archipel's
timeout, retry, and domain-error boundary, so a circuit-breaker
decorator can be introduced without changing capability facades.

#### Parameters

| Parameter | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest) |

#### Returns

`Promise`\<[`IIntelligenceProviderProbeResult`](Interface.IIntelligenceProviderProbeResult)\>

#### Inherited from

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`probe`](Class.IntelligenceProviderAdapterBase#probe)

---

### terminateWebRTCSession()?

```ts
terminateWebRTCSession ? request : Promise<IntelligenceRealtimeWebRTCTerminationStatus>;
```

Defined in: [libs/platform-intelligence/src/providers/abstracts/IntelligenceProviderAdapterBase.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/abstracts/IntelligenceProviderAdapterBase.ts#L88)

Ends a browser-owned WebRTC realtime session at the provider with the
server credentials of the request configuration.

Implementing this method declares that the provider exposes a
server-side termination API. Adapters without one omit it, and the
realtime session factory then reports `unsupported` without a provider
request instead of silently succeeding. Implementations make exactly
one provider request, honour `abortSignal`, resolve `already-ended` when
the provider reports the session as unknown or ended, resolve
`unsupported` for models whose API cannot end sessions, and throw
`IntelligenceProviderError` with `isRetryable` for any other failure.
The factory owns retries and the total time budget.

#### Parameters

| Parameter | Type                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderWebRTCTerminationRequest`](Interface.IIntelligenceProviderWebRTCTerminationRequest) |

#### Returns

`Promise`\<[`IntelligenceRealtimeWebRTCTerminationStatus`](TypeAlias.IntelligenceRealtimeWebRTCTerminationStatus)\>

#### Inherited from

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`terminateWebRTCSession`](Class.IntelligenceProviderAdapterBase#terminatewebrtcsession)
