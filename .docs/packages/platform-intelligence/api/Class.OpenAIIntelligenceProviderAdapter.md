---
title: 'Class: OpenAIIntelligenceProviderAdapter'
generated: true
editUrl: false
---

# Class: OpenAIIntelligenceProviderAdapter

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L37)

OpenAI adapter for language, embeddings, images, audio, video, realtime, files, and skills.

## Extends

- [`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase)

## Constructors

### Constructor

```ts
new OpenAIIntelligenceProviderAdapter(configService): OpenAIIntelligenceProviderAdapter;
```

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L48)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`OpenAIIntelligenceProviderAdapter`

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`constructor`](Class.IntelligenceProviderAdapterBase#constructor)

## Properties

### capabilities

```ts
readonly capabilities: readonly ["language", "embedding", "image", "speech", "transcription", "video", "realtime", "files", "skills"];
```

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L58)

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`capabilities`](Class.IntelligenceProviderAdapterBase#capabilities)

---

### provider

```ts
readonly provider: "openai" = IntelligenceProviderNames.OpenAI;
```

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L57)

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`provider`](Class.IntelligenceProviderAdapterBase#provider)

## Methods

### applyWebRTCConversationHistory()

```ts
applyWebRTCConversationHistory(request): Promise<
  | IIntelligenceRealtimeSessionConfiguration
| null>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:178](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L178)

Seeds a GPT-Live WebRTC session with earlier conversation turns.

GPT-Live accepts prior messages in the session's `input` and does not
speak because of them. All turns become one `user` message holding the
quoted history, so neither a developer message nor an assistant message
carries application-reported text. Realtime API calls cannot receive
earlier turns during WebRTC setup and resolve `null`.

#### Parameters

| Parameter | Type                                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderWebRTCConversationHistoryRequest`](Interface.IIntelligenceProviderWebRTCConversationHistoryRequest) |

#### Returns

`Promise`\<
\| [`IIntelligenceRealtimeSessionConfiguration`](Interface.IIntelligenceRealtimeSessionConfiguration)
\| `null`\>

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`applyWebRTCConversationHistory`](Class.IntelligenceProviderAdapterBase#applywebrtcconversationhistory)

---

### closeWebRTCSession()

```ts
closeWebRTCSession(request): Promise<
  | IIntelligenceProviderWebRTCClosure
| null>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:271](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L271)

Closes a browser-owned GPT-Live session through its sideband WebSocket
and returns the final voice duration from `session.closed`.

GPT-Live bills sessions by duration and reports the final
`usage.seconds` only to the connections of the session, not in the
hangup response. The server attaches through
`wss://…/live/sessions/{session_id}/attach` with its API key, sends
`session.close`, and waits for `session.closed`. Realtime API calls are
priced by tokens and resolve `null`, so the factory hangs them up.

#### Parameters

| Parameter | Type                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderWebRTCTerminationRequest`](Interface.IIntelligenceProviderWebRTCTerminationRequest) |

#### Returns

`Promise`\<
\| [`IIntelligenceProviderWebRTCClosure`](Interface.IIntelligenceProviderWebRTCClosure)
\| `null`\>

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`closeWebRTCSession`](Class.IntelligenceProviderAdapterBase#closewebrtcsession)

---

### load()

```ts
load(request): Promise<unknown>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L74)

#### Parameters

| Parameter | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderLoadRequest`](Interface.IIntelligenceProviderLoadRequest) |

#### Returns

`Promise`\<`unknown`\>

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`load`](Class.IntelligenceProviderAdapterBase#load)

---

### probe()

```ts
probe(request): Promise<IIntelligenceProviderProbeResult>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:116](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L116)

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

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`probe`](Class.IntelligenceProviderAdapterBase#probe)

---

### terminateWebRTCSession()

```ts
terminateWebRTCSession(request): Promise<IntelligenceRealtimeWebRTCTerminationStatus>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts:223](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/OpenAIIntelligenceProviderAdapter.ts#L223)

Hangs up a browser-owned OpenAI realtime session with the server API key.

GPT-Live sessions end through `POST /live/sessions/{session_id}/hangup`
and Realtime API calls through `POST /realtime/calls/{call_id}/hangup`.
The model selects the API through the same OpenAI SDK routing that
negotiated the session. OpenAI reports unknown or ended sessions with a
session- or call-specific error code, which resolves as `already-ended`.
Provider error messages are never propagated because authentication
failures can echo parts of the API key.

#### Parameters

| Parameter | Type                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `request` | [`IIntelligenceProviderWebRTCTerminationRequest`](Interface.IIntelligenceProviderWebRTCTerminationRequest) |

#### Returns

`Promise`\<[`IntelligenceRealtimeWebRTCTerminationStatus`](TypeAlias.IntelligenceRealtimeWebRTCTerminationStatus)\>

#### Overrides

[`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase).[`terminateWebRTCSession`](Class.IntelligenceProviderAdapterBase#terminatewebrtcsession)
