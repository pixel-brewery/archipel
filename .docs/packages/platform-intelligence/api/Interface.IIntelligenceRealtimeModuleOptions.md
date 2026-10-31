---
title: 'Interface: IIntelligenceRealtimeModuleOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeModuleOptions

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L13)

Module-level resilience and resource limits for realtime intelligence.

## Properties

### closeTimeoutMs?

```ts
readonly closeTimeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L32)

Graceful close and total WebRTC termination timeout, capped at five seconds.

---

### connectionTimeoutMs?

```ts
readonly connectionTimeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L29)

Provider token and WebSocket connection timeout, capped at five seconds.

---

### maxActiveSessions?

```ts
readonly maxActiveSessions?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L20)

Maximum server-owned WebSockets and concurrent WebRTC negotiations. Defaults to 1,000.

---

### maxBufferedBytes?

```ts
readonly maxBufferedBytes?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L26)

Maximum upstream WebSocket buffered bytes. Defaults to 4 MiB.

---

### maxPendingEvents?

```ts
readonly maxPendingEvents?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L23)

Maximum queued inbound or outbound events per session. Defaults to 512.

---

### meteringAdapter?

```ts
readonly meteringAdapter?:
  | IntelligenceRealtimeMeteringBase
| Type<IntelligenceRealtimeMeteringBase>;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L17)

Application adapter that persists metering and audit events.

---

### meteringIntervalMs?

```ts
readonly meteringIntervalMs?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L35)

Provider-independent billing interval. Defaults to 30 seconds.

---

### terminationMaxRetries?

```ts
readonly terminationMaxRetries?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L41)

Transient WebRTC termination request retries within `closeTimeoutMs`, capped at two. Defaults to two.

---

### tokenRequestMaxRetries?

```ts
readonly tokenRequestMaxRetries?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/interfaces/IIntelligenceRealtimeModuleOptions.ts#L38)

Transient token request retries, capped at two.
