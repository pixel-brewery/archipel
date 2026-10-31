---
title: 'Class: IntelligencePromptExecutor'
generated: true
editUrl: false
---

# Class: IntelligencePromptExecutor

Defined in: [libs/platform-intelligence/src/prompts/IntelligencePromptExecutor.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IntelligencePromptExecutor.ts#L27)

Validates and executes reusable intelligence prompt invocations.

## Constructors

### Constructor

```ts
new IntelligencePromptExecutor(policy, languageGenerator): IntelligencePromptExecutor;
```

Defined in: [libs/platform-intelligence/src/prompts/IntelligencePromptExecutor.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IntelligencePromptExecutor.ts#L37)

#### Parameters

| Parameter           | Type                                                                   |
| ------------------- | ---------------------------------------------------------------------- |
| `policy`            | [`IntelligencePromptPolicyBase`](Class.IntelligencePromptPolicyBase)   |
| `languageGenerator` | [`IntelligenceLanguageGenerator`](Class.IntelligenceLanguageGenerator) |

#### Returns

`IntelligencePromptExecutor`

## Methods

### execute()

#### Call Signature

```ts
execute<TInput, TMetadata>(invocation, context?): Promise<IIntelligencePromptExecutionResult<string, TMetadata>>;
```

Defined in: [libs/platform-intelligence/src/prompts/IntelligencePromptExecutor.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IntelligencePromptExecutor.ts#L50)

##### Type Parameters

| Type Parameter                                    |
| ------------------------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`       |
| <a id="type-parameter-tmetadata"></a> `TMetadata` |

##### Parameters

| Parameter    | Type                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `invocation` | [`IIntelligencePromptInvocation`](Interface.IIntelligencePromptInvocation)\<`TInput`, `string`, `"text"`, `TMetadata`\> |
| `context?`   | [`IIntelligencePromptExecutionContext`](Interface.IIntelligencePromptExecutionContext)                                  |

##### Returns

`Promise`\<[`IIntelligencePromptExecutionResult`](Interface.IIntelligencePromptExecutionResult)\<`string`, `TMetadata`\>\>

#### Call Signature

```ts
execute<TInput, TOutput, TMetadata>(invocation, context?): Promise<IIntelligencePromptExecutionResult<TOutput, TMetadata>>;
```

Defined in: [libs/platform-intelligence/src/prompts/IntelligencePromptExecutor.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IntelligencePromptExecutor.ts#L54)

##### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| <a id="type-parameter-tinput-1"></a> `TInput`       |
| <a id="type-parameter-toutput"></a> `TOutput`       |
| <a id="type-parameter-tmetadata-1"></a> `TMetadata` |

##### Parameters

| Parameter    | Type                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `invocation` | [`IIntelligencePromptInvocation`](Interface.IIntelligencePromptInvocation)\<`TInput`, `TOutput`, `"object"`, `TMetadata`\> |
| `context?`   | [`IIntelligencePromptExecutionContext`](Interface.IIntelligencePromptExecutionContext)                                     |

##### Returns

`Promise`\<[`IIntelligencePromptExecutionResult`](Interface.IIntelligencePromptExecutionResult)\<`TOutput`, `TMetadata`\>\>
