---
title: 'Interface: IAgentInferenceRequest'
generated: true
editUrl: false
---

# Interface: IAgentInferenceRequest

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceRequest.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceRequest.ts#L8)

One provider step. Tools are declarations only; execution belongs to the agent loop.

## Properties

### options

```ts
readonly options: IIntelligenceLanguageGenerationOptions;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceRequest.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceRequest.ts#L16)

Single-step provider options, including tool declarations and the active abort signal.

---

### prompt

```ts
readonly prompt: IIntelligencePrompt;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceRequest.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceRequest.ts#L12)

Provider-neutral instructions and conversation for one inference step.

---

### schema?

```ts
readonly schema?: IIntelligenceSchema<unknown>;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentInferenceRequest.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentInferenceRequest.ts#L20)

Optional schema for the final structured result.
