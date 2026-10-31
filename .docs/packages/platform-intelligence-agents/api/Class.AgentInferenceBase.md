---
title: 'Abstract Class: AgentInferenceBase'
generated: true
editUrl: false
---

# Abstract Class: AgentInferenceBase

Defined in: [libs/platform-intelligence-agents/src/abstracts/AgentInferenceBase.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/AgentInferenceBase.ts#L13)

Defines a replaceable boundary for one buffered or streaming model step.

## Remarks

Adapters must honor abortSignal, preserve tool-call identities and wrap provider errors. The default adapter reuses
the lower intelligence layer's provider resilience; custom adapters own their retry and circuit-breaker policy.

## Extended by

- [`IntelligenceInferenceAdapter`](Class.IntelligenceInferenceAdapter)

## Constructors

### Constructor

```ts
new AgentInferenceBase(): AgentInferenceBase;
```

#### Returns

`AgentInferenceBase`

## Methods

### run()

```ts
abstract run(request): Promise<IAgentInferenceResult>;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/AgentInferenceBase.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/AgentInferenceBase.ts#L32)

Generates exactly one provider response without executing tool effects.

#### Parameters

| Parameter | Type                                                         | Description                                                                    |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `request` | [`IAgentInferenceRequest`](Interface.IAgentInferenceRequest) | Instructions, messages, tool declarations and provider controls for this step. |

#### Returns

`Promise`\<[`IAgentInferenceResult`](Interface.IAgentInferenceResult)\>

One normalized model response with tool calls and usage evidence.

#### Throws

When the configured adapter cannot complete the provider step.

---

### stream()

```ts
abstract stream(request): AsyncIterable<AgentInferenceEvent>;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/AgentInferenceBase.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/AgentInferenceBase.ts#L41)

Streams one provider step, ending with exactly one normalized output event.

#### Parameters

| Parameter | Type                                                         | Description                                                                    |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `request` | [`IAgentInferenceRequest`](Interface.IAgentInferenceRequest) | Instructions, messages, tool declarations and provider controls for this step. |

#### Returns

`AsyncIterable`\<[`AgentInferenceEvent`](TypeAlias.AgentInferenceEvent)\>

Incremental events followed by the normalized final response.

#### Throws

When the configured adapter cannot complete the provider stream.
