---
title: 'Interface: IIntelligenceFileUploadOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceFileUploadOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceFileUploadOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceFileUploadOptions.ts#L12)

Provider-neutral file upload options.

## Extends

- [`IIntelligenceModelRequestOptions`](Interface.IIntelligenceModelRequestOptions)

## Properties

### data

```ts
readonly data:
  | string
  | Uint8Array<ArrayBufferLike>
  | {
  data: string | Uint8Array<ArrayBufferLike>;
  type: "data";
}
  | {
  text: string;
  type: "text";
};
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceFileUploadOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceFileUploadOptions.ts#L15)

---

### filename?

```ts
readonly filename?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceFileUploadOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceFileUploadOptions.ts#L17)

---

### mediaType?

```ts
readonly mediaType?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceFileUploadOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceFileUploadOptions.ts#L16)

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
