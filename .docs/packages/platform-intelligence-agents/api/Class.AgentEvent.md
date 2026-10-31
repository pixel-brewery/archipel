---
title: 'Class: AgentEvent\<TPayload, TType\>'
generated: true
editUrl: false
---

# Class: AgentEvent\<TPayload, TType\>

Defined in: [libs/platform-intelligence-agents/src/events/AgentEvent.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/events/AgentEvent.ts#L6)

Represents a semantic event with producer identity and optional loop correlation.

## Type Parameters

| Type Parameter                                               | Default type |
| ------------------------------------------------------------ | ------------ |
| <a id="type-parameter-tpayload"></a> `TPayload`              | `unknown`    |
| <a id="type-parameter-ttype"></a> `TType` _extends_ `string` | `string`     |

## Constructors

### Constructor

```ts
new AgentEvent<TPayload, TType>(
   type,
   producerId,
   payload,
   loopId?,
   occurredAt?
): AgentEvent<TPayload, TType>;
```

Defined in: [libs/platform-intelligence-agents/src/events/AgentEvent.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/events/AgentEvent.ts#L40)

Creates a semantic event and defensively copies its occurrence timestamp.

#### Parameters

| Parameter     | Type       | Description                                                   |
| ------------- | ---------- | ------------------------------------------------------------- |
| `type`        | `TType`    | Semantic event type or state discriminator.                   |
| `producerId`  | `string`   | Identity of the participant that produced the event.          |
| `payload`     | `TPayload` | Event data owned and authorized by the consuming application. |
| `loopId?`     | `string`   | Identifier of the active or paused loop.                      |
| `occurredAt?` | `Date`     | Occurrence timestamp to copy into the event.                  |

#### Returns

`AgentEvent`\<`TPayload`, `TType`\>

## Properties

### loopId?

```ts
readonly loopId?: string;
```

Defined in: [libs/platform-intelligence-agents/src/events/AgentEvent.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/events/AgentEvent.ts#L27)

Correlation identifier of the originating agent loop, when applicable.

---

### occurredAt

```ts
readonly occurredAt: Date;
```

Defined in: [libs/platform-intelligence-agents/src/events/AgentEvent.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/events/AgentEvent.ts#L19)

Occurrence timestamp copied from the constructor argument.

---

### payload

```ts
readonly payload: TPayload;
```

Defined in: [libs/platform-intelligence-agents/src/events/AgentEvent.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/events/AgentEvent.ts#L23)

Event data whose authorization, redaction and retention are owned by the consumer.

---

### producerId

```ts
readonly producerId: string;
```

Defined in: [libs/platform-intelligence-agents/src/events/AgentEvent.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/events/AgentEvent.ts#L15)

Identifier of the participant that produced the event.

---

### type

```ts
readonly type: TType;
```

Defined in: [libs/platform-intelligence-agents/src/events/AgentEvent.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/events/AgentEvent.ts#L11)

Semantic discriminator used by participant situation predicates.
