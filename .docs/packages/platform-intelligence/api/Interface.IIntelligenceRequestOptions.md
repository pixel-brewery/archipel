---
title: 'Interface: IIntelligenceRequestOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceRequestOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts#L12)

Shared execution controls for bounded intelligence requests.

## Extends

- [`IIntelligenceModelRequestOptions`](Interface.IIntelligenceModelRequestOptions)

## Extended by

- [`IIntelligenceEmbeddingBatchOptions`](Interface.IIntelligenceEmbeddingBatchOptions)
- [`IIntelligenceEmbeddingOptions`](Interface.IIntelligenceEmbeddingOptions)
- [`IIntelligenceImageGenerationOptions`](Interface.IIntelligenceImageGenerationOptions)
- [`IIntelligenceLanguageGenerationOptions`](Interface.IIntelligenceLanguageGenerationOptions)
- [`IIntelligenceRerankingOptions`](Interface.IIntelligenceRerankingOptions)
- [`IIntelligenceSpeechGenerationOptions`](Interface.IIntelligenceSpeechGenerationOptions)
- [`IIntelligenceStreamingTranscriptionOptions`](Interface.IIntelligenceStreamingTranscriptionOptions)
- [`IIntelligenceTranscriptionOptions`](Interface.IIntelligenceTranscriptionOptions)
- [`IIntelligenceVideoGenerationOptions`](Interface.IIntelligenceVideoGenerationOptions)

## Properties

### abortSignal?

```ts
readonly abortSignal?: AbortSignal;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts#L16)

Caller-driven cancellation signal.

---

### headers?

```ts
readonly headers?: Readonly<Record<string, string>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts#L19)

Additional outbound request headers.

---

### model?

```ts
readonly model?: IIntelligenceModelReference;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L24)

Optional provider/model override.

#### Inherited from

[`IIntelligenceModelRequestOptions`](Interface.IIntelligenceModelRequestOptions).[`model`](Interface.IIntelligenceModelRequestOptions#model)

---

### providerOptions?

```ts
readonly providerOptions?: Readonly<Record<string, Readonly<Record<string, IntelligenceJsonValue>>>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L33)

Optional provider-specific settings.

#### Inherited from

[`IIntelligenceModelRequestOptions`](Interface.IIntelligenceModelRequestOptions).[`providerOptions`](Interface.IIntelligenceModelRequestOptions#provideroptions)

---

### requestId?

```ts
readonly requestId?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L27)

Correlation identifier included in structured Archipel logs.

#### Inherited from

[`IIntelligenceModelRequestOptions`](Interface.IIntelligenceModelRequestOptions).[`requestId`](Interface.IIntelligenceModelRequestOptions#requestid)

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L30)

Total provider-operation timeout in milliseconds.

#### Inherited from

[`IIntelligenceModelRequestOptions`](Interface.IIntelligenceModelRequestOptions).[`timeoutMs`](Interface.IIntelligenceModelRequestOptions#timeoutms)
