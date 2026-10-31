---
title: 'Interface: ISituationContext'
generated: true
editUrl: false
---

# Interface: ISituationContext

Defined in: [libs/platform-intelligence-agents/src/interfaces/ISituationContext.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/ISituationContext.ts#L9)

One event and the participant receiving it.

## Properties

### event

```ts
readonly event: AgentEvent;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/ISituationContext.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/ISituationContext.ts#L13)

Semantic event currently being evaluated or processed.

---

### participant

```ts
readonly participant: ParticipantBase;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/ISituationContext.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/ISituationContext.ts#L17)

Participant receiving the event.
