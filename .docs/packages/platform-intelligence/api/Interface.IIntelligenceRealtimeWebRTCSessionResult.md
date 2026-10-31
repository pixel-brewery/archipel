---
title: 'Interface: IIntelligenceRealtimeWebRTCSessionResult'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeWebRTCSessionResult

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L14)

SDP answer and data-channel information returned to the browser.

The browser owns media, events, and the connection lifecycle after setup.

## Properties

### answerSdp

```ts
readonly answerSdp: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L22)

---

### connectionMode

```ts
readonly connectionMode: "webrtc";
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L17)

---

### conversationHistory?

```ts
readonly conversationHistory?: IntelligenceRealtimeConversationHistoryStatus;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L26)

Outcome of the requested `conversationHistory`; absent when none was requested.

---

### dataChannelLabel

```ts
readonly dataChannelLabel: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L23)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L21)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L20)

---

### providerSessionId

```ts
readonly providerSessionId: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L19)

---

### sessionId

```ts
readonly sessionId: string;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.ts#L18)
