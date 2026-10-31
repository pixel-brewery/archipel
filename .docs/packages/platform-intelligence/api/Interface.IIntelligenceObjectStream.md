---
title: 'Interface: IIntelligenceObjectStream\<T\>'
generated: true
editUrl: false
---

# Interface: IIntelligenceObjectStream\<T\>

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts#L12)

Provider-neutral structured-output stream.

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Properties

### finishReason

```ts
readonly finishReason: PromiseLike<string>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts#L17)

---

### output

```ts
readonly output: PromiseLike<T>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts#L16)

---

### partialOutputStream

```ts
readonly partialOutputStream: AsyncIterable<Partial<T>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts#L15)

---

### stepUsage?

```ts
readonly stepUsage?: PromiseLike<readonly (IIntelligenceUsage | null)[]>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts#L25)

Usage of each provider call in execution order once the stream finished; `usage` is their sum.

A provider that prices every call on its own must be priced per entry rather than on the summed `usage`. Absent
when the underlying SDK stream carries no step details.

---

### usage

```ts
readonly usage: PromiseLike<IIntelligenceUsage | null>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceObjectStream.ts#L18)
