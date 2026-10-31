---
title: 'Interface: IAgentRunOptions'
generated: true
editUrl: false
---

# Interface: IAgentRunOptions

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L9)

Bounded per-run controls. Model/provider policy remains in platform-intelligence.

## Properties

### approveToolCall?

```ts
readonly approveToolCall?: (call, context) => boolean | Promise<boolean>;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L40)

Required for tools declaring needsApproval. Called before every tool effect, never inferred by the model.

#### Parameters

| Parameter             | Type                                                    | Description                                                            |
| --------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| `call`                | `IIntelligenceToolCall`                                 | -                                                                      |
| `context`             | \{ `abortSignal`: `AbortSignal`; `loopId`: `string`; \} | -                                                                      |
| `context.abortSignal` | `AbortSignal`                                           | Cancellation signal that adapters and effects must honor.              |
| `context.loopId`      | `string`                                                | Correlation identifier of the originating agent loop, when applicable. |

#### Returns

`boolean` \| `Promise`\<`boolean`\>

---

### beforeToolCall?

```ts
readonly beforeToolCall?: (call, context) => void | Promise<void>;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L56)

Authoritative application guard before every tool effect, including after a paused run resumes.

#### Parameters

| Parameter             | Type                                                    | Description                                                            |
| --------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| `call`                | `IIntelligenceToolCall`                                 | -                                                                      |
| `context`             | \{ `abortSignal`: `AbortSignal`; `loopId`: `string`; \} | -                                                                      |
| `context.abortSignal` | `AbortSignal`                                           | Cancellation signal that adapters and effects must honor.              |
| `context.loopId`      | `string`                                                | Correlation identifier of the originating agent loop, when applicable. |

#### Returns

`void` \| `Promise`\<`void`\>

---

### generation?

```ts
readonly generation?: Omit<IIntelligenceLanguageGenerationOptions,
  | "tools"
  | "maxSteps"
  | "includeRegisteredTools"
  | "deferredToolLoading"
  | "activeToolNames"
  | "onToolExecutionStart"
| "onToolExecutionEnd">;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L13)

Single-step provider controls; tool ownership remains with the agent loop.

---

### interception?

```ts
readonly interception?: AgentInterceptionBase;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L28)

Application policy evaluated before a matching loop phase executes.

---

### maxTransitions?

```ts
readonly maxTransitions?: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L32)

Maximum state executions across the run and all resumes; defaults to 64, with a supported range of 1–4096.

---

### schema?

```ts
readonly schema?: IIntelligenceSchema<unknown>;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L20)

Optional schema for the final structured result.

---

### streaming?

```ts
readonly streaming?: boolean;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L24)

Whether provider output is delivered incrementally during the run.

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentRunOptions.ts#L36)

Timeout for each active run/resume invocation in milliseconds; defaults to 30000, with a range of 1–3600000.
