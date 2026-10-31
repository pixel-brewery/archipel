---
title: 'Class: IntelligenceInferenceAdapter'
generated: true
editUrl: false
---

# Class: IntelligenceInferenceAdapter

Defined in: [libs/platform-intelligence-agents/src/adapters/IntelligenceInferenceAdapter.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/adapters/IntelligenceInferenceAdapter.ts#L17)

Uses Archipel's existing models, validation, provider resilience and streaming.

## Extends

- [`AgentInferenceBase`](Class.AgentInferenceBase)

## Constructors

### Constructor

```ts
new IntelligenceInferenceAdapter(generator): IntelligenceInferenceAdapter;
```

Defined in: [libs/platform-intelligence-agents/src/adapters/IntelligenceInferenceAdapter.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/adapters/IntelligenceInferenceAdapter.ts#L29)

Connects the agent inference boundary to the configured language generator.

#### Parameters

| Parameter   | Type                            | Description                                                                         |
| ----------- | ------------------------------- | ----------------------------------------------------------------------------------- |
| `generator` | `IntelligenceLanguageGenerator` | Canonical owner of provider selection, validation, retries and usage normalization. |

#### Returns

`IntelligenceInferenceAdapter`

#### Overrides

[`AgentInferenceBase`](Class.AgentInferenceBase).[`constructor`](Class.AgentInferenceBase#constructor)

## Methods

### run()

```ts
run(request): Promise<IAgentInferenceResult>;
```

Defined in: [libs/platform-intelligence-agents/src/adapters/IntelligenceInferenceAdapter.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/adapters/IntelligenceInferenceAdapter.ts#L48)

Generates one model response through the canonical intelligence infrastructure.

#### Parameters

| Parameter | Type                                                         | Description                                                             |
| --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `request` | [`IAgentInferenceRequest`](Interface.IAgentInferenceRequest) | Instructions, messages, schema and provider controls for a single step. |

#### Returns

`Promise`\<[`IAgentInferenceResult`](Interface.IAgentInferenceResult)\>

Normalized text or structured output, tool calls and provider usage evidence.

#### Remarks

Only tool declarations reach the provider. Approval and tool effects remain with the interceptable agent loop.

#### Throws

When tool declarations, provider preparation or generation fail.

#### Overrides

[`AgentInferenceBase`](Class.AgentInferenceBase).[`run`](Class.AgentInferenceBase#run)

---

### stream()

```ts
stream(request): AsyncIterable<AgentInferenceEvent>;
```

Defined in: [libs/platform-intelligence-agents/src/adapters/IntelligenceInferenceAdapter.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/adapters/IntelligenceInferenceAdapter.ts#L74)

Streams incremental provider events and one normalized final response.

#### Parameters

| Parameter | Type                                                         | Description                                                             |
| --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `request` | [`IAgentInferenceRequest`](Interface.IAgentInferenceRequest) | Instructions, messages, schema and provider controls for a single step. |

#### Returns

`AsyncIterable`\<[`AgentInferenceEvent`](TypeAlias.AgentInferenceEvent)\>

Text/tool events or partial structured output, followed by one final output event.

#### Throws

When declarations, stream content or provider metadata are invalid or unavailable.

#### Overrides

[`AgentInferenceBase`](Class.AgentInferenceBase).[`stream`](Class.AgentInferenceBase#stream)
