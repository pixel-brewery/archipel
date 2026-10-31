---
title: 'Interface: IIntelligenceEmbeddingBatchOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceEmbeddingBatchOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchOptions.ts#L12)

Provider-neutral batch embedding options.

## Extends

- [`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions)

## Properties

### abortSignal?

```ts
readonly abortSignal?: AbortSignal;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts#L16)

Caller-driven cancellation signal.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`abortSignal`](Interface.IIntelligenceRequestOptions#abortsignal)

---

### headers?

```ts
readonly headers?: Readonly<Record<string, string>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts#L19)

Additional outbound request headers.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`headers`](Interface.IIntelligenceRequestOptions#headers)

---

### maxParallelCalls?

```ts
readonly maxParallelCalls?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchOptions.ts#L17)

---

### maxRetries?

```ts
readonly maxRetries?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchOptions.ts#L16)

---

### model?

```ts
readonly model?: IIntelligenceModelReference;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L24)

Optional provider/model override.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`model`](Interface.IIntelligenceRequestOptions#model)

---

### providerOptions?

```ts
readonly providerOptions?: Readonly<Record<string, Readonly<Record<string, IntelligenceJsonValue>>>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L33)

Optional provider-specific settings.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`providerOptions`](Interface.IIntelligenceRequestOptions#provideroptions)

---

### requestId?

```ts
readonly requestId?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L27)

Correlation identifier included in structured Archipel logs.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`requestId`](Interface.IIntelligenceRequestOptions#requestid)

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L30)

Total provider-operation timeout in milliseconds.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`timeoutMs`](Interface.IIntelligenceRequestOptions#timeoutms)

---

### values

```ts
readonly values: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceEmbeddingBatchOptions.ts#L15)
