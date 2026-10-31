---
title: 'Interface: IIntelligenceRealtimeWebRTCTerminationOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeWebRTCTerminationOptions

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts#L10)

Identifies one browser-owned WebRTC session that the server ends at its provider.

Pass the identifiers of the `IIntelligenceRealtimeWebRTCSessionResult`
returned by `createSession()` unchanged; the application must persist them
server-side for as long as the browser connection can exist.

## Properties

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts#L31)

Model that created the session, as returned by `createSession()`.

A provider can serve several realtime APIs with separate session
namespaces, and the model selects the API that owns the session. There
is deliberately no default model: after a default change, the request
would reach an API that reports the session as unknown while the session
keeps running.

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts#L20)

Provider that created the session, as returned by `createSession()`.

---

### providerSessionId

```ts
readonly providerSessionId: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts#L34)

Provider session identifier returned as `providerSessionId` by `createSession()`.

---

### reason?

```ts
readonly reason?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts#L40)

Non-sensitive reason recorded in Archipel logs, such as `lease-expired`,
`client-disconnected`, or `session-completed`. It is not sent to the provider.

---

### requestId?

```ts
readonly requestId?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts#L14)

Correlation identifier included in structured Archipel logs.

---

### sessionId

```ts
readonly sessionId: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.ts#L17)

Application-owned session identifier used for log and error correlation.
