---
title: 'Abstract Class: AgentEventSinkBase'
generated: true
editUrl: false
---

# Abstract Class: AgentEventSinkBase

Defined in: [libs/platform-intelligence-agents/src/abstracts/AgentEventSinkBase.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/AgentEventSinkBase.ts#L8)

Application-owned audit, telemetry or distributed-event adapter. No vendor cloud dependency.

## Constructors

### Constructor

```ts
new AgentEventSinkBase(): AgentEventSinkBase;
```

#### Returns

`AgentEventSinkBase`

## Methods

### publish()

```ts
abstract publish(event): void | Promise<void>;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/AgentEventSinkBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/AgentEventSinkBase.ts#L29)

Delivers a semantic event to an application-owned audit or transport boundary.

#### Parameters

| Parameter | Type                             | Description                                                                       |
| --------- | -------------------------------- | --------------------------------------------------------------------------------- |
| `event`   | [`AgentEvent`](Class.AgentEvent) | Event selected for delivery, including participant and optional loop correlation. |

#### Returns

`void` \| `Promise`\<`void`\>

Completes synchronously or resolves after delivery finishes.

#### Remarks

Delivery is asynchronous and does not provide a transactional outbox. Consumers own scoping, redaction,
deduplication and persistence.
