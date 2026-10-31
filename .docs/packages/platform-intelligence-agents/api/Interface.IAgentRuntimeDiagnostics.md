---
title: 'Interface: IAgentRuntimeDiagnostics'
generated: true
editUrl: false
---

# Interface: IAgentRuntimeDiagnostics

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts#L6)

Bounded local runtime gauges for consumer observability.

## Properties

### activeLoops

```ts
readonly activeLoops: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts#L14)

Number of agent loops currently executing.

---

### dispatchFailures

```ts
readonly dispatchFailures: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts#L26)

Bounded count of dispatch failures awaiting acknowledgment through drain.

---

### disposed

```ts
readonly disposed: boolean;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts#L30)

Whether the runtime has begun disposing and rejects new application work.

---

### participants

```ts
readonly participants: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts#L10)

Number of participants currently registered in the runtime.

---

### pausedLoops

```ts
readonly pausedLoops: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts#L18)

Number of paused loops retaining runtime capacity.

---

### pendingHandlers

```ts
readonly pendingHandlers: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRuntimeDiagnostics.ts#L22)

Number of participant or sink jobs still awaiting settlement.
