---
title: 'Interface: IIntelligenceVideoGenerationOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceVideoGenerationOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L12)

Provider-neutral video generation options.

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

### aspectRatio?

```ts
readonly aspectRatio?: `${number}:${number}`;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L24)

---

### count?

```ts
readonly count?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L22)

---

### durationSeconds?

```ts
readonly durationSeconds?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L26)

---

### frameImages?

```ts
readonly frameImages?: readonly {
  frameType: "first_frame" | "last_frame";
  image: string | ArrayBuffer | Uint8Array<ArrayBufferLike>;
}[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L30)

---

### framesPerSecond?

```ts
readonly framesPerSecond?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L27)

---

### generateAudio?

```ts
readonly generateAudio?: boolean;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L29)

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

### inputReferences?

```ts
readonly inputReferences?: readonly (
  | string
  | ArrayBuffer
  | Uint8Array<ArrayBufferLike>
  | {
  data: string | ArrayBuffer | Uint8Array<ArrayBufferLike>;
  mediaType?: string;
})[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L34)

---

### maxRetries?

```ts
readonly maxRetries?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L21)

---

### maxVideosPerCall?

```ts
readonly maxVideosPerCall?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L23)

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

### prompt

```ts
readonly prompt:
  | string
  | {
  image: string | ArrayBuffer | Uint8Array<ArrayBufferLike>;
  text?: string;
};
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L15)

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

### resolution?

```ts
readonly resolution?: `${number}x${number}`;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L25)

---

### seed?

```ts
readonly seed?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceVideoGenerationOptions.ts#L28)

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L30)

Total provider-operation timeout in milliseconds.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`timeoutMs`](Interface.IIntelligenceRequestOptions#timeoutms)
