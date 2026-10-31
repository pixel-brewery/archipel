---
title: 'Class: DefaultIntelligencePromptPolicyAdapter'
generated: true
editUrl: false
---

# Class: DefaultIntelligencePromptPolicyAdapter

Defined in: [libs/platform-intelligence/src/prompts/DefaultIntelligencePromptPolicyAdapter.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/DefaultIntelligencePromptPolicyAdapter.ts#L17)

Default prompt policy that supports native settings and automatic model selection.

## Extends

- [`IntelligencePromptPolicyBase`](Class.IntelligencePromptPolicyBase)

## Constructors

### Constructor

```ts
new DefaultIntelligencePromptPolicyAdapter(): DefaultIntelligencePromptPolicyAdapter;
```

#### Returns

`DefaultIntelligencePromptPolicyAdapter`

#### Inherited from

[`IntelligencePromptPolicyBase`](Class.IntelligencePromptPolicyBase).[`constructor`](Class.IntelligencePromptPolicyBase#constructor)

## Methods

### resolve()

```ts
resolve(request): Promise<IIntelligencePromptEffectivePolicy>;
```

Defined in: [libs/platform-intelligence/src/prompts/DefaultIntelligencePromptPolicyAdapter.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/DefaultIntelligencePromptPolicyAdapter.ts#L32)

#### Parameters

| Parameter | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `request` | [`IIntelligencePromptPolicyRequest`](Interface.IIntelligencePromptPolicyRequest) |

#### Returns

`Promise`\<[`IIntelligencePromptEffectivePolicy`](Interface.IIntelligencePromptEffectivePolicy)\>

#### Overrides

[`IntelligencePromptPolicyBase`](Class.IntelligencePromptPolicyBase).[`resolve`](Class.IntelligencePromptPolicyBase#resolve)
