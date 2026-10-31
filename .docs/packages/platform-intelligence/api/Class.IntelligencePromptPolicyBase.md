---
title: 'Abstract Class: IntelligencePromptPolicyBase'
generated: true
editUrl: false
---

# Abstract Class: IntelligencePromptPolicyBase

Defined in: [libs/platform-intelligence/src/prompts/abstracts/IntelligencePromptPolicyBase.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/abstracts/IntelligencePromptPolicyBase.ts#L11)

Resolves provider-neutral prompt requirements into effective generation settings.

This abstract class also serves as the NestJS dependency injection token.

## Extended by

- [`DefaultIntelligencePromptPolicyAdapter`](Class.DefaultIntelligencePromptPolicyAdapter)

## Constructors

### Constructor

```ts
new IntelligencePromptPolicyBase(): IntelligencePromptPolicyBase;
```

#### Returns

`IntelligencePromptPolicyBase`

## Methods

### resolve()

```ts
abstract resolve(request): Promise<IIntelligencePromptEffectivePolicy>;
```

Defined in: [libs/platform-intelligence/src/prompts/abstracts/IntelligencePromptPolicyBase.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/abstracts/IntelligencePromptPolicyBase.ts#L23)

#### Parameters

| Parameter | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `request` | [`IIntelligencePromptPolicyRequest`](Interface.IIntelligencePromptPolicyRequest) |

#### Returns

`Promise`\<[`IIntelligencePromptEffectivePolicy`](Interface.IIntelligencePromptEffectivePolicy)\>
