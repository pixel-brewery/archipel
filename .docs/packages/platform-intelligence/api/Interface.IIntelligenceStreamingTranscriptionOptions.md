---
title: 'Interface: IIntelligenceStreamingTranscriptionOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceStreamingTranscriptionOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceStreamingTranscriptionOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceStreamingTranscriptionOptions.ts#L12)

Provider-neutral live transcription options.

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

### audio

```ts
readonly audio: ReadableStream<string | Uint8Array<ArrayBufferLike>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceStreamingTranscriptionOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceStreamingTranscriptionOptions.ts#L15)

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

### includeRawChunks?

```ts
readonly includeRawChunks?: boolean;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceStreamingTranscriptionOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceStreamingTranscriptionOptions.ts#L20)

---

### inputAudioFormat

```ts
readonly inputAudioFormat: {
  rate?: number;
  type: string;
};
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceStreamingTranscriptionOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceStreamingTranscriptionOptions.ts#L16)

#### rate?

```ts
readonly rate?: number;
```

#### type

```ts
readonly type: string;
```

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
