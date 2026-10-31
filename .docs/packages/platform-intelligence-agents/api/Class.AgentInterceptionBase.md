---
title: 'Abstract Class: AgentInterceptionBase'
generated: true
editUrl: false
---

# Abstract Class: AgentInterceptionBase

Defined in: [libs/platform-intelligence-agents/src/abstracts/AgentInterceptionBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/AgentInterceptionBase.ts#L9)

Defines the application policy boundary before a selected loop state executes.

## Constructors

### Constructor

```ts
new AgentInterceptionBase(): AgentInterceptionBase;
```

#### Returns

`AgentInterceptionBase`

## Methods

### handle()

```ts
abstract handle(transition, context): Promise<AgentInterceptionResult>;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/AgentInterceptionBase.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/AgentInterceptionBase.ts#L38)

Approves, rewrites, pauses or stops the selected transition before execution.

#### Parameters

| Parameter             | Type                                                                         | Description                                                                |
| --------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `transition`          | [`AgentTransition`](TypeAlias.AgentTransition)                               | Next typed step selected for policy inspection.                            |
| `context`             | \{ `abortSignal`: `AbortSignal`; `agentId`: `string`; `loopId`: `string`; \} | Loop identity, agent identity and cancellation signal for this invocation. |
| `context.abortSignal` | `AbortSignal`                                                                | Cancellation signal that adapters and effects must honor.                  |
| `context.agentId`     | `string`                                                                     | Identifier of the AI participant responsible for the run.                  |
| `context.loopId`      | `string`                                                                     | Correlation identifier of the originating agent loop, when applicable.     |

#### Returns

`Promise`\<[`AgentInterceptionResult`](TypeAlias.AgentInterceptionResult)\>

The continuation, pause or stop decision for this transition.

#### Remarks

Implementations must honor the supplied cancellation signal and resolve current application permissions.

---

### isSatisfiedBy()

```ts
abstract isSatisfiedBy(transition): boolean;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/AgentInterceptionBase.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/AgentInterceptionBase.ts#L27)

Selects transitions that require application policy inspection.

#### Parameters

| Parameter    | Type                                           | Description                           |
| ------------ | ---------------------------------------------- | ------------------------------------- |
| `transition` | [`AgentTransition`](TypeAlias.AgentTransition) | Next typed step proposed by the loop. |

#### Returns

`boolean`

True when handle must evaluate this transition.
