---
title: 'Interface: IIntelligenceSkillUploadOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceSkillUploadOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceSkillUploadOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceSkillUploadOptions.ts#L12)

Provider-neutral skill bundle upload options.

## Extends

- [`IIntelligenceModelRequestOptions`](Interface.IIntelligenceModelRequestOptions)

## Properties

### displayTitle?

```ts
readonly displayTitle?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceSkillUploadOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceSkillUploadOptions.ts#L19)

---

### files

```ts
readonly files: readonly {
  data:   | string
     | Uint8Array<ArrayBufferLike>
     | {
     data: string | Uint8Array<ArrayBufferLike>;
     type: "data";
   }
     | {
     text: string;
     type: "text";
   };
  path: string;
}[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceSkillUploadOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceSkillUploadOptions.ts#L15)

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
