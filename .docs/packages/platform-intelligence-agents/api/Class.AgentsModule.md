---
title: 'Class: AgentsModule'
generated: true
editUrl: false
---

# Class: AgentsModule

Defined in: [libs/platform-intelligence-agents/src/AgentsModule.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/AgentsModule.ts#L13)

Multi-agent orchestration layered above platform-intelligence. No global runtime or credentials.

## Constructors

### Constructor

```ts
new AgentsModule(): AgentsModule;
```

#### Returns

`AgentsModule`

## Methods

### register()

```ts
static register(options?): DynamicModule;
```

Defined in: [libs/platform-intelligence-agents/src/AgentsModule.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/AgentsModule.ts#L30)

Imports the consumer's configured IntelligenceModule, or an application inference adapter's dependencies.

#### Parameters

| Parameter  | Type                                                     | Description                                         |
| ---------- | -------------------------------------------------------- | --------------------------------------------------- |
| `options?` | [`IAgentsModuleOptions`](Interface.IAgentsModuleOptions) | Explicit owner configuration and operation budgets. |

#### Returns

`DynamicModule`

A dynamic NestJS module exposing the inference abstract base and runtime factory.
