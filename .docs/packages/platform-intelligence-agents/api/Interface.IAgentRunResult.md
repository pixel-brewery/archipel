---
title: 'Interface: IAgentRunResult'
generated: true
editUrl: false
---

# Interface: IAgentRunResult

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts#L10)

Observable outcome. Paused loops are process-local and must be resumed or cancelled explicitly.

## Properties

### agentId

```ts
readonly agentId: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts#L18)

Identifier of the AI participant responsible for the run.

---

### context

```ts
readonly context: IModelContextRecord;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts#L34)

Defensive snapshot of this run's isolated conversation, including messages already processed before a pause.

---

### loopId

```ts
readonly loopId: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts#L14)

Correlation identifier retained across this run and its resumed invocations.

---

### reason?

```ts
readonly reason?: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts#L26)

Optional explanation supplied by the interception policy when it stops the run.

---

### result?

```ts
readonly result?: IAgentInferenceResult;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts#L30)

Latest provider response, or undefined when execution stops or pauses before inference.

---

### status

```ts
readonly status: "completed" | "paused" | "stopped";
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts#L22)

Terminal or paused outcome of the run.

---

### transitions

```ts
readonly transitions: readonly AgentLoopState[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunResult.ts#L38)

Snapshot of visited execution phases in execution order.
