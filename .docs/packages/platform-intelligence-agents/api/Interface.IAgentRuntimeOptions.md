---
title: 'Interface: IAgentRuntimeOptions'
generated: true
editUrl: false
---

# Interface: IAgentRuntimeOptions

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts#L9)

Explicit ownership and resource budgets for a runtime.

## Properties

### eventSink?

```ts
readonly eventSink?: AgentEventSinkBase;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts#L17)

Optional consumer adapter for audit, telemetry or distributed delivery.

---

### maxConcurrentLoops?

```ts
readonly maxConcurrentLoops?: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts#L21)

Maximum active and paused loops retained by a runtime; defaults to 32.

---

### maxPendingHandlers?

```ts
readonly maxPendingHandlers?: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts#L25)

Maximum pending reaction and sink jobs; defaults to 1024.

---

### shutdownTimeoutMs?

```ts
readonly shutdownTimeoutMs?: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts#L29)

Maximum wait for runtime cleanup, in milliseconds; defaults to 5000 and must not exceed 10000.

---

### state?

```ts
readonly state?: RuntimeState;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeOptions.ts#L13)

Explicit membership state; a new RuntimeState is created when omitted.
