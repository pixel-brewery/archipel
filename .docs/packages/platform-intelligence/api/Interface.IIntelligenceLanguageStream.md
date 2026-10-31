---
title: 'Interface: IIntelligenceLanguageStream'
generated: true
editUrl: false
---

# Interface: IIntelligenceLanguageStream

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts#L13)

Provider-neutral text stream.

## Properties

### finishReason

```ts
readonly finishReason: PromiseLike<string>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts#L20)

---

### fullStream?

```ts
readonly fullStream?: AsyncIterable<IntelligenceLanguageStreamPart, any, any>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts#L17)

Consume either fullStream or textStream for a given response.

---

### stepUsage?

```ts
readonly stepUsage?: PromiseLike<readonly (IIntelligenceUsage | null)[]>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts#L28)

Usage of each provider call in execution order once the stream finished; `usage` is their sum.

A provider that prices every call on its own must be priced per entry rather than on the summed `usage`. Absent
when the underlying SDK stream carries no step details.

---

### text

```ts
readonly text: PromiseLike<string>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts#L19)

---

### textStream

```ts
readonly textStream: AsyncIterable<string>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts#L18)

---

### usage

```ts
readonly usage: PromiseLike<IIntelligenceUsage | null>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageStream.ts#L21)
