---
title: 'Interface: IIntelligenceRealtimeWebRTCTerminationResult'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeWebRTCTerminationResult

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts#L12)

Result of ending a browser-owned WebRTC realtime session from the server.

## Properties

### durationSeconds?

```ts
readonly durationSeconds?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts#L36)

Final cumulative voice duration in seconds that the provider reported
while this call closed the running session, for example GPT-Live's
`session.closed` usage. Absent when the session had already ended, the
provider reports no duration, or its control channel was unavailable
and the session was hung up instead.

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts#L28)

Resolved model that selected the provider API.

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts#L25)

Resolved provider that handled the request.

---

### providerSessionId

```ts
readonly providerSessionId: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts#L22)

Provider session identifier that the request addressed.

---

### sessionId

```ts
readonly sessionId: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts#L19)

Application-owned session identifier from the request.

---

### status

```ts
readonly status: IntelligenceRealtimeWebRTCTerminationStatus;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.ts#L16)

Provider outcome of the termination request.
