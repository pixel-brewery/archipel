---
title: 'Class: AgentRuntime'
generated: true
editUrl: false
---

# Class: AgentRuntime

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L20)

Owns participant membership and coordinates isolated agent runs for one application scope.

## Constructors

### Constructor

```ts
new AgentRuntime(
   inference,
   options?,
   onDispose?
): AgentRuntime;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L47)

Creates an application-owned runtime with bounded execution and event dispatch.

#### Parameters

| Parameter    | Type                                                     | Description                                                                      |
| ------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `inference`  | [`AgentInferenceBase`](Class.AgentInferenceBase)         | Provider-neutral adapter used for every model step.                              |
| `options?`   | [`IAgentRuntimeOptions`](Interface.IAgentRuntimeOptions) | Membership, event sink and resource budgets for this runtime.                    |
| `onDispose?` | () => `void`                                             | Lifecycle callback invoked once after runtime cleanup, including failed cleanup. |

#### Returns

`AgentRuntime`

#### Throws

When capacities are not positive safe integers or shutdown exceeds ten seconds.

## Properties

### state

```ts
readonly state: RuntimeState;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L25)

Participant membership owned by this runtime.

## Accessors

### diagnostics

#### Get Signature

```ts
get diagnostics(): IAgentRuntimeDiagnostics;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:70](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L70)

Captures collection sizes and lifecycle state for consumer metrics.

##### Returns

[`IAgentRuntimeDiagnostics`](Interface.IAgentRuntimeDiagnostics)

Current local gauges; no mutable runtime collections are exposed.

## Methods

### cancelLoop()

```ts
cancelLoop(loopId): void;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:196](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L196)

Cancels an active loop or discards a paused loop. Tools must honor abortSignal. No effect is retried.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `loopId`  | `string` | Identifier of the active or paused loop. |

#### Returns

`void`

#### Throws

When the loop is not retained by this runtime.

---

### dispose()

```ts
dispose(): Promise<void>;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:222](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L222)

Cancels runs, drains outstanding events and releases membership once per owner lifetime.

#### Returns

`Promise`\<`void`\>

The shared cleanup promise, resolving when all tracked work has settled.

#### Throws

When execution or queued reactions cannot drain within the shutdown budget.

---

### drain()

```ts
drain(timeoutMs?): Promise<void>;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:213](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L213)

Waits for participant reactions and sink publications, including nested events.

#### Parameters

| Parameter    | Type     | Description                                                            |
| ------------ | -------- | ---------------------------------------------------------------------- |
| `timeoutMs?` | `number` | Maximum wait in milliseconds; defaults to the runtime shutdown budget. |

#### Returns

`Promise`\<`void`\>

Resolves after queued jobs settle without an unacknowledged dispatch failure.

#### Throws

When the budget is invalid or expires, or a reaction or sink fails.

---

### getParticipant()

```ts
getParticipant(id): ParticipantBase;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:123](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L123)

Resolves a currently registered participant.

#### Parameters

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `id`      | `string` | Stable identity to resolve or remove from the owning registry. |

#### Returns

[`ParticipantBase`](Class.ParticipantBase)

The currently registered participant for the supplied identity.

#### Throws

When the identity is absent or the runtime has been disposed.

---

### join()

```ts
join(participant): void;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:90](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L90)

Registers a participant; duplicate joins are idempotent and emit no duplicate event.

#### Parameters

| Parameter     | Type                                       | Description                              |
| ------------- | ------------------------------------------ | ---------------------------------------- |
| `participant` | [`ParticipantBase`](Class.ParticipantBase) | Participant to register in this runtime. |

#### Returns

`void`

#### Throws

When the runtime is disposed, participant capacity is exhausted or event publication
overflows.

---

### leave()

```ts
leave(id): void;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:102](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L102)

Removes membership and cancels that participant's active or paused runs.

#### Parameters

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `id`      | `string` | Stable identity to resolve or remove from the owning registry. |

#### Returns

`void`

#### Throws

When the participant is absent or the runtime has been disposed.

---

### resumeLoop()

```ts
resumeLoop(loopId): Promise<IAgentRunResult>;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:182](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L182)

Resumes a paused loop; interception and permission guards run again.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `loopId`  | `string` | Identifier of the active or paused loop. |

#### Returns

`Promise`\<[`IAgentRunResult`](Interface.IAgentRunResult)\>

The resumed loop outcome with the same loop identity.

#### Throws

When the loop is unavailable or a resumed execution boundary rejects the work.

---

### runLoop()

```ts
runLoop(
   agentId,
   message,
   options?
): Promise<IAgentRunResult>;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:163](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L163)

Runs one bounded loop; concurrent calls fork memory and carry independent loop identifiers.

#### Parameters

| Parameter  | Type                                             | Description                                             |
| ---------- | ------------------------------------------------ | ------------------------------------------------------- |
| `agentId`  | `string`                                         | Registered AI participant that owns the run.            |
| `message`  | `string`                                         | Message that triggers this run or participant reaction. |
| `options?` | [`IAgentRunOptions`](Interface.IAgentRunOptions) | Explicit owner configuration and operation budgets.     |

#### Returns

`Promise`\<[`IAgentRunResult`](Interface.IAgentRunResult)\>

The completed, paused or stopped run and its isolated conversation snapshot.

#### Throws

When identity, policy, capacity, cancellation or a selected execution boundary
prevents completion.

---

### sendEvent()

```ts
sendEvent(event): void;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:149](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L149)

Publishes a custom event after verifying its sender identity.

#### Parameters

| Parameter | Type                             | Description                            |
| --------- | -------------------------------- | -------------------------------------- |
| `event`   | [`AgentEvent`](Class.AgentEvent) | Semantic event to publish or evaluate. |

#### Returns

`void`

#### Throws

When the producer is unregistered, the runtime is disposed or the event queue is
full.

---

### sendMessage()

```ts
sendMessage(message, senderId): void;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts:138](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/AgentRuntime.ts#L138)

Publishes a message from a registered participant. Handlers decide who reacts.

#### Parameters

| Parameter  | Type     | Description                                             |
| ---------- | -------- | ------------------------------------------------------- |
| `message`  | `string` | Message that triggers this run or participant reaction. |
| `senderId` | `string` | Registered participant producing the message.           |

#### Returns

`void`

#### Throws

When the sender is unregistered, the runtime is disposed or the event queue is full.
