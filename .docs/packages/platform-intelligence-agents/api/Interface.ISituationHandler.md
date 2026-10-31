---
title: 'Interface: ISituationHandler'
generated: true
editUrl: false
---

# Interface: ISituationHandler

Defined in: [libs/platform-intelligence-agents/src/interfaces/ISituationHandler.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/ISituationHandler.ts#L9)

A predicate and its reaction.

## Properties

### processor

```ts
readonly processor: SituationProcessorBase;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/ISituationHandler.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/ISituationHandler.ts#L17)

Application-owned reaction invoked for a matching situation.

---

### specification

```ts
readonly specification: SituationSpecificationBase;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/ISituationHandler.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/ISituationHandler.ts#L13)

Predicate that determines whether a participant should react.
