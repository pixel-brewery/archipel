---
title: 'Class: Agent'
generated: true
editUrl: false
---

# Class: Agent

Defined in: [libs/platform-intelligence-agents/src/participants/Agent.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/participants/Agent.ts#L13)

Defines an AI participant with its own instructions, tool catalog and conversation memory.

## Extends

- [`ParticipantBase`](Class.ParticipantBase)

## Constructors

### Constructor

```ts
new Agent(configuration): Agent;
```

Defined in: [libs/platform-intelligence-agents/src/participants/Agent.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/participants/Agent.ts#L36)

Creates an AI participant with its own instructions, tool catalog and conversation.

#### Parameters

| Parameter       | Type                                                   | Description                                                         |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| `configuration` | [`IAgentConfiguration`](Interface.IAgentConfiguration) | Identity, instructions, tools, memory and optional event reactions. |

#### Returns

`Agent`

#### Throws

When identity, handler count or tool capacity is invalid.

#### Overrides

[`ParticipantBase`](Class.ParticipantBase).[`constructor`](Class.ParticipantBase#constructor)

## Properties

### instruction

```ts
readonly instruction: string;
```

Defined in: [libs/platform-intelligence-agents/src/participants/Agent.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/participants/Agent.ts#L18)

Instructions applied to every provider request made for this agent.

---

### memory

```ts
readonly memory: ModelContext;
```

Defined in: [libs/platform-intelligence-agents/src/participants/Agent.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/participants/Agent.ts#L26)

Bounded conversation shared across completed runs; each active run uses an independent fork.

---

### tools

```ts
readonly tools: Readonly<Record<string, IIntelligenceToolDefinition>>;
```

Defined in: [libs/platform-intelligence-agents/src/participants/Agent.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/participants/Agent.ts#L22)

Immutable catalog of application tools available to this agent.

## Accessors

### id

#### Get Signature

```ts
get id(): string;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L46)

Stable participant identifier.

##### Returns

`string`

The immutable identity supplied when the participant was created.

#### Inherited from

[`ParticipantBase`](Class.ParticipantBase).[`id`](Class.ParticipantBase#id)

## Methods

### getHandlers()

```ts
getHandlers(): readonly ISituationHandler[];
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L68)

Returns a snapshot of registered handlers.

#### Returns

readonly [`ISituationHandler`](Interface.ISituationHandler)[]

A snapshot of the current handler registrations.

#### Inherited from

[`ParticipantBase`](Class.ParticipantBase).[`getHandlers`](Class.ParticipantBase#gethandlers)

---

### getManifest()

```ts
getManifest(): IParticipantManifest;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L59)

Returns the immutable public manifest.

#### Returns

[`IParticipantManifest`](Interface.IParticipantManifest)

The immutable participant identity and descriptive capabilities.

#### Inherited from

[`ParticipantBase`](Class.ParticipantBase).[`getManifest`](Class.ParticipantBase#getmanifest)

---

### setHandlers()

```ts
setHandlers(handlers): void;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:78](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L78)

Atomically replaces handlers; existing dispatches keep their snapshot.

#### Parameters

| Parameter  | Type                                                          | Description                                           |
| ---------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `handlers` | readonly [`ISituationHandler`](Interface.ISituationHandler)[] | Initial or replacement participant reaction handlers. |

#### Returns

`void`

#### Throws

When the handler list exceeds the supported participant capacity.

#### Inherited from

[`ParticipantBase`](Class.ParticipantBase).[`setHandlers`](Class.ParticipantBase#sethandlers)
