---
title: 'Interface: IAgentInferenceResult'
generated: true
editUrl: false
---

# Interface: IAgentInferenceResult

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts#L8)

Normalized provider output shared by buffered and streaming loops.

## Properties

### finishReason

```ts
readonly finishReason: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts#L36)

Normalized provider reason for ending generation.

---

### output?

```ts
readonly output?: unknown;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts#L16)

Normalized final output, including a schema-constrained object when requested.

---

### reasoningText?

```ts
readonly reasoningText?: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts#L20)

Reasoning text exposed by the configured provider, when available.

---

### stepUsage?

```ts
readonly stepUsage?: readonly (IIntelligenceUsage | null)[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts#L32)

Usage entries reported by the lower intelligence infrastructure, in call order.

---

### text

```ts
readonly text: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts#L12)

Normalized model text for the completed provider step.

---

### toolCalls

```ts
readonly toolCalls: readonly IIntelligenceToolCall[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts#L24)

Tool calls selected by the model, retained in response order.

---

### usage

```ts
readonly usage: IIntelligenceUsage | null;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceResult.ts#L28)

Normalized usage for this provider step; null means no usage was reported.
