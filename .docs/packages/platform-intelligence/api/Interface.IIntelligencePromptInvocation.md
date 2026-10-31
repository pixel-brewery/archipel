---
title: 'Interface: IIntelligencePromptInvocation\<TInput, TOutput, TMode, TMetadata\>'
generated: true
editUrl: false
---

# Interface: IIntelligencePromptInvocation\<TInput, TOutput, TMode, TMetadata\>

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptInvocation.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptInvocation.ts#L13)

Bound prompt definition ready for execution.

## Type Parameters

| Type Parameter                                                                                                   | Default type |
| ---------------------------------------------------------------------------------------------------------------- | ------------ |
| <a id="type-parameter-tinput"></a> `TInput`                                                                      | -            |
| <a id="type-parameter-toutput"></a> `TOutput`                                                                    | -            |
| <a id="type-parameter-tmode"></a> `TMode` _extends_ [`IntelligencePromptMode`](TypeAlias.IntelligencePromptMode) | -            |
| <a id="type-parameter-tmetadata"></a> `TMetadata`                                                                | `undefined`  |

## Properties

### definition

```ts
readonly definition: IIntelligencePromptDefinition<TInput, TOutput, TMode>;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptInvocation.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptInvocation.ts#L16)

---

### input

```ts
readonly input: Readonly<TInput>;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptInvocation.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptInvocation.ts#L17)

---

### metadata

```ts
readonly metadata: TMetadata | undefined;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptInvocation.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptInvocation.ts#L18)
