---
title: 'Abstract Class: SituationProcessorBase'
generated: true
editUrl: false
---

# Abstract Class: SituationProcessorBase

Defined in: [libs/platform-intelligence-agents/src/abstracts/SituationProcessorBase.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/SituationProcessorBase.ts#L8)

Application-owned reaction; async processors do not block other participants.

## Constructors

### Constructor

```ts
new SituationProcessorBase(): SituationProcessorBase;
```

#### Returns

`SituationProcessorBase`

## Methods

### apply()

```ts
abstract apply(context): void | Promise<void>;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/SituationProcessorBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/SituationProcessorBase.ts#L29)

Reacts to a matching event without blocking other participants' reactions.

#### Parameters

| Parameter | Type                                               | Description                                                             |
| --------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| `context` | [`ISituationContext`](Interface.ISituationContext) | Semantic event and the participant selected by the situation predicate. |

#### Returns

`void` \| `Promise`\<`void`\>

Completes synchronously or resolves after the reaction finishes.

#### Remarks

The runtime isolates failures and reports them through drain. The application owns effect idempotency and
authorization.
