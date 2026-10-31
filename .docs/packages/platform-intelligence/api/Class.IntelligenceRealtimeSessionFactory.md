---
title: 'Class: IntelligenceRealtimeSessionFactory'
generated: true
editUrl: false
---

# Class: IntelligenceRealtimeSessionFactory

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L67)

Creates server-owned WebSocket sessions, negotiates browser-owned WebRTC
sessions, and ends browser-owned WebRTC sessions at their provider.

Applications forward normalized events and audio chunks through their own
authenticated WebSocket gateway for server-owned sessions. Provider
credentials, event mapping, and upstream sockets remain inside Archipel.

## Implements

- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new IntelligenceRealtimeSessionFactory(
   modelResolver,
   providerRegistry,
   toolRegistry,
   metering,
   runtime
): IntelligenceRealtimeSessionFactory;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L91)

#### Parameters

| Parameter          | Type                                                                         |
| ------------------ | ---------------------------------------------------------------------------- |
| `modelResolver`    | `IntelligenceModelResolver`                                                  |
| `providerRegistry` | [`IntelligenceProviderRegistry`](Class.IntelligenceProviderRegistry)         |
| `toolRegistry`     | [`IntelligenceToolRegistry`](Class.IntelligenceToolRegistry)                 |
| `metering`         | [`IntelligenceRealtimeMeteringBase`](Class.IntelligenceRealtimeMeteringBase) |
| `runtime`          | `IIntelligenceRealtimeRuntimeOptions`                                        |

#### Returns

`IntelligenceRealtimeSessionFactory`

## Accessors

### activeSessionCount

#### Get Signature

```ts
get activeSessionCount(): number;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:110](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L110)

Number of sessions currently owned by this module instance.

##### Returns

`number`

---

### registeredProviders

#### Get Signature

```ts
get registeredProviders(): readonly string[];
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:115](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L115)

Providers currently registered for server-owned realtime sessions.

##### Returns

readonly `string`[]

## Methods

### createSession()

#### Call Signature

```ts
createSession(options): Promise<IIntelligenceRealtimeWebRTCSessionResult>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:135](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L135)

Creates a WebSocket session or exchanges a browser SDP offer for WebRTC.

WebSocket results remain server-owned and require `connect()`. A WebRTC
result contains the SDP answer; the browser owns its media connection.
A WebRTC session that continues an earlier conversation can receive its
recent turns through `conversationHistory`; the result reports whether
the provider received them or cannot take them during setup.

##### Parameters

| Parameter | Type                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceRealtimeWebRTCSessionOptions`](Interface.IIntelligenceRealtimeWebRTCSessionOptions) |

##### Returns

`Promise`\<[`IIntelligenceRealtimeWebRTCSessionResult`](Interface.IIntelligenceRealtimeWebRTCSessionResult)\>

##### Throws

IntelligenceValidationError when options are invalid or the conversation history exceeds
`IntelligenceRealtimeConversationHistoryLimits`, before any provider request.

#### Call Signature

```ts
createSession(options): Promise<IntelligenceRealtimeSessionBase>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:136](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L136)

Creates a WebSocket session or exchanges a browser SDP offer for WebRTC.

WebSocket results remain server-owned and require `connect()`. A WebRTC
result contains the SDP answer; the browser owns its media connection.
A WebRTC session that continues an earlier conversation can receive its
recent turns through `conversationHistory`; the result reports whether
the provider received them or cannot take them during setup.

##### Parameters

| Parameter | Type                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceRealtimeSessionOptions`](Interface.IIntelligenceRealtimeSessionOptions) |

##### Returns

`Promise`\<[`IntelligenceRealtimeSessionBase`](Class.IntelligenceRealtimeSessionBase)\>

##### Throws

IntelligenceValidationError when options are invalid or the conversation history exceeds
`IntelligenceRealtimeConversationHistoryLimits`, before any provider request.

#### Call Signature

```ts
createSession(options): Promise<
  | IntelligenceRealtimeSessionBase
| IIntelligenceRealtimeWebRTCSessionResult>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:137](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L137)

Creates a WebSocket session or exchanges a browser SDP offer for WebRTC.

WebSocket results remain server-owned and require `connect()`. A WebRTC
result contains the SDP answer; the browser owns its media connection.
A WebRTC session that continues an earlier conversation can receive its
recent turns through `conversationHistory`; the result reports whether
the provider received them or cannot take them during setup.

##### Parameters

| Parameter | Type                                                                                                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options` | \| [`IIntelligenceRealtimeWebRTCSessionOptions`](Interface.IIntelligenceRealtimeWebRTCSessionOptions) \| [`IIntelligenceRealtimeSessionOptions`](Interface.IIntelligenceRealtimeSessionOptions) |

##### Returns

`Promise`\<
\| [`IntelligenceRealtimeSessionBase`](Class.IntelligenceRealtimeSessionBase)
\| [`IIntelligenceRealtimeWebRTCSessionResult`](Interface.IIntelligenceRealtimeWebRTCSessionResult)\>

##### Throws

IntelligenceValidationError when options are invalid or the conversation history exceeds
`IntelligenceRealtimeConversationHistoryLimits`, before any provider request.

---

### getWebRTCConfiguration()

```ts
getWebRTCConfiguration(options): Promise<IIntelligenceRealtimeWebRTCConfiguration>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:151](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L151)

Returns the data-channel label the browser needs before making its SDP offer.

#### Parameters

| Parameter           | Type                                            |
| ------------------- | ----------------------------------------------- |
| `options`           | \{ `model`: `string`; `provider?`: `string`; \} |
| `options.model`     | `string`                                        |
| `options.provider?` | `string`                                        |

#### Returns

`Promise`\<[`IIntelligenceRealtimeWebRTCConfiguration`](Interface.IIntelligenceRealtimeWebRTCConfiguration)\>

---

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:168](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L168)

Closes all server-owned upstream sessions during Nest application shutdown.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### supportsWebRTCSessionTermination()

```ts
supportsWebRTCSessionTermination(provider): boolean;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:185](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L185)

Reports whether a registered realtime provider can end browser-owned
WebRTC sessions from the server.

Fail-closed applications check this before they negotiate a
browser-owned session whose provider usage they must be able to stop.
A provider that supports termination can still report `unsupported`
for an individual model whose provider API cannot end sessions.

#### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `provider` | `string` |

#### Returns

`boolean`

#### Throws

IntelligenceConfigurationError when the provider is not registered for realtime.

---

### terminateWebRTCSession()

```ts
terminateWebRTCSession(options): Promise<IIntelligenceRealtimeWebRTCTerminationResult>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts:216](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceRealtimeSessionFactory.ts#L216)

Ends a browser-owned WebRTC session at its provider with server credentials.

The provider session keeps running, and consuming provider usage, for as
long as the browser keeps its peer connection open, even after the
application has stopped renewing or billing it. Call this when the
application's connection lease expires, when the browser reports that it
closed the connection, and when the logical session completes.

Termination is idempotent: an unknown or already ended provider session
resolves as `already-ended`, so concurrent triggers can call it safely.
A provider whose final usage is reported only on its server control
channel closes the running session there first, which returns the
provider-reported `durationSeconds`; within half of the budget it falls
back to the plain termination request, which reports no duration.
A provider without a server-side termination API resolves as
`unsupported` without a provider request, and that session can keep
running. The whole operation, including up to `terminationMaxRetries`
retries of transient failures, is bounded by `closeTimeoutMs`.

#### Parameters

| Parameter | Type                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `options` | [`IIntelligenceRealtimeWebRTCTerminationOptions`](Interface.IIntelligenceRealtimeWebRTCTerminationOptions) |

#### Returns

`Promise`\<[`IIntelligenceRealtimeWebRTCTerminationResult`](Interface.IIntelligenceRealtimeWebRTCTerminationResult)\>

#### Throws

IntelligenceValidationError when an identifier is invalid, before any provider request.

#### Throws

IntelligenceConfigurationError when the provider is not registered for realtime or has no credentials.

#### Throws

IntelligenceRealtimeError with phase `close` when the provider rejects or fails the request;
`isRetryable` marks transient failures that a later call can resolve.
