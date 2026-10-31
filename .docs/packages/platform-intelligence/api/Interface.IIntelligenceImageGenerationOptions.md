---
title: 'Interface: IIntelligenceImageGenerationOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceImageGenerationOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts#L12)

Provider-neutral image generation options.

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

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts#L26)

---

### count?

```ts
readonly count?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts#L23)

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

### maxImagesPerCall?

```ts
readonly maxImagesPerCall?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts#L24)

---

### maxRetries?

```ts
readonly maxRetries?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts#L22)

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
  images: readonly (string | ArrayBuffer | Uint8Array<ArrayBufferLike>)[];
  mask?: string | ArrayBuffer | Uint8Array<ArrayBufferLike>;
  text?: string;
};
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts#L15)

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

### seed?

```ts
readonly seed?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts#L27)

---

### size?

```ts
readonly size?: `${number}x${number}`;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceImageGenerationOptions.ts#L25)

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L30)

Total provider-operation timeout in milliseconds.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`timeoutMs`](Interface.IIntelligenceRequestOptions#timeoutms)
