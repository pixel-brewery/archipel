---
title: 'Class: AgentRuntimeFactory'
generated: true
editUrl: false
---

# Class: AgentRuntimeFactory

Defined in: [libs/platform-intelligence-agents/src/AgentRuntimeFactory.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/AgentRuntimeFactory.ts#L13)

Creates explicitly owned runtimes and disposes them on application shutdown.

## Implements

- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new AgentRuntimeFactory(inference): AgentRuntimeFactory;
```

Defined in: [libs/platform-intelligence-agents/src/AgentRuntimeFactory.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/AgentRuntimeFactory.ts#L26)

Creates a lifecycle-managed factory using the configured inference adapter.

#### Parameters

| Parameter   | Type                                             | Description                                                              |
| ----------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| `inference` | [`AgentInferenceBase`](Class.AgentInferenceBase) | Adapter shared by the explicitly owned runtimes created by this factory. |

#### Returns

`AgentRuntimeFactory`

## Methods

### create()

```ts
create(options?): AgentRuntime;
```

Defined in: [libs/platform-intelligence-agents/src/AgentRuntimeFactory.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/AgentRuntimeFactory.ts#L42)

Creates a runtime; consumers should dispose it at the end of its owner lifetime. Maximum 128 live runtimes.

#### Parameters

| Parameter  | Type                                                     | Description                                         |
| ---------- | -------------------------------------------------------- | --------------------------------------------------- |
| `options?` | [`IAgentRuntimeOptions`](Interface.IAgentRuntimeOptions) | Explicit owner configuration and operation budgets. |

#### Returns

[`AgentRuntime`](Class.AgentRuntime)

An explicitly owned runtime registered for application shutdown.

#### Throws

When the factory is closed or its runtime capacity is exhausted.

---

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-intelligence-agents/src/AgentRuntimeFactory.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/AgentRuntimeFactory.ts#L58)

Disposes every owned runtime when the NestJS application shuts down.

#### Returns

`Promise`\<`void`\>

Resolves when all runtime cleanup attempts have completed successfully.

#### Throws

When one or more runtimes fail their bounded cleanup.

#### Implementation of

`OnModuleDestroy.onModuleDestroy`
