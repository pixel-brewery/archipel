---
title: 'Abstract Class: SituationSpecificationBase'
generated: true
editUrl: false
---

# Abstract Class: SituationSpecificationBase

Defined in: [libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts#L8)

Defines a composable predicate for selecting participant reactions.

## Constructors

### Constructor

```ts
new SituationSpecificationBase(): SituationSpecificationBase;
```

#### Returns

`SituationSpecificationBase`

## Methods

### and()

```ts
and(other): SituationSpecificationBase;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts#L34)

Requires both predicates, with short-circuit evaluation.

#### Parameters

| Parameter | Type                         | Description                                     |
| --------- | ---------------------------- | ----------------------------------------------- |
| `other`   | `SituationSpecificationBase` | Other predicate to compose with this condition. |

#### Returns

`SituationSpecificationBase`

A predicate requiring both conditions with short-circuit evaluation.

---

### isSatisfiedBy()

```ts
abstract isSatisfiedBy(context): boolean;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts#L26)

Evaluates whether a participant should react to its current event.

#### Parameters

| Parameter | Type                                               | Description                                      |
| --------- | -------------------------------------------------- | ------------------------------------------------ |
| `context` | [`ISituationContext`](Interface.ISituationContext) | Semantic event and the participant receiving it. |

#### Returns

`boolean`

True when this predicate selects the situation.

---

### not()

```ts
not(): SituationSpecificationBase;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts#L53)

Negates this predicate.

#### Returns

`SituationSpecificationBase`

A predicate that negates this condition.

---

### or()

```ts
or(other): SituationSpecificationBase;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/SituationSpecificationBase.ts#L44)

Requires either predicate, with short-circuit evaluation.

#### Parameters

| Parameter | Type                         | Description                                     |
| --------- | ---------------------------- | ----------------------------------------------- |
| `other`   | `SituationSpecificationBase` | Other predicate to compose with this condition. |

#### Returns

`SituationSpecificationBase`

A predicate accepting either condition with short-circuit evaluation.
