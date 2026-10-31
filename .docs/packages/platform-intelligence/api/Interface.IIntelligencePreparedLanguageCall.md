---
title: 'Interface: IIntelligencePreparedLanguageCall\<TOutput\>'
generated: true
editUrl: false
---

# Interface: IIntelligencePreparedLanguageCall\<TOutput\>

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts#L14)

Single-use language call whose local model, option, prompt, and tool
preparation has already completed.

## Type Parameters

| Type Parameter                                | Default type |
| --------------------------------------------- | ------------ |
| <a id="type-parameter-toutput"></a> `TOutput` | `string`     |

## Properties

### capacity

```ts
readonly capacity: IIntelligenceLanguageCallCapacity;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts#L20)

Standardized initial provider-input facts captured without network access.

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts#L18)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts#L17)

## Methods

### execute()

```ts
execute(): Promise<IIntelligenceLanguageCompletion<TOutput>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligencePreparedLanguageCall.ts#L27)

Executes this prepared call once. A second invocation is rejected.

#### Returns

`Promise`\<[`IIntelligenceLanguageCompletion`](Interface.IIntelligenceLanguageCompletion)\<`TOutput`\>\>
