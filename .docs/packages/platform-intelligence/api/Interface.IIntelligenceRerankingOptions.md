---
title: 'Interface: IIntelligenceRerankingOptions\<TDocument\>'
generated: true
editUrl: false
---

# Interface: IIntelligenceRerankingOptions\<TDocument\>

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts#L13)

Provider-neutral reranking options.

## Extends

- [`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions)

## Type Parameters

| Type Parameter                                                                                                                                                            | Default type |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| <a id="type-parameter-tdocument"></a> `TDocument` _extends_ \| `string` \| `Readonly`\<`Record`\<`string`, [`IntelligenceJsonValue`](TypeAlias.IntelligenceJsonValue)\>\> | `string`     |

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

### documents

```ts
readonly documents: readonly TDocument[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts#L19)

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

### maxRetries?

```ts
readonly maxRetries?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts#L20)

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

### query

```ts
readonly query: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts#L18)

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

### topN?

```ts
readonly topN?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRerankingOptions.ts#L21)
