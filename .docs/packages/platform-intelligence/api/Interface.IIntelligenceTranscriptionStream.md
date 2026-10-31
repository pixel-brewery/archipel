---
title: 'Interface: IIntelligenceTranscriptionStream'
generated: true
editUrl: false
---

# Interface: IIntelligenceTranscriptionStream

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L15)

Provider-neutral live transcription result.

The full stream has one consumer. Access it before any final-result promise
when both incremental and final output are required.

## Properties

### durationInSeconds

```ts
readonly durationInSeconds: PromiseLike<number | undefined>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L30)

---

### fullStream

```ts
readonly fullStream: AsyncIterable<IntelligenceTranscriptionStreamPart>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L20)

---

### language

```ts
readonly language: PromiseLike<string | undefined>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L29)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L19)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L18)

---

### segments

```ts
readonly segments: PromiseLike<readonly {
  endSecond: number;
  startSecond: number;
  text: string;
}[]>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L22)

---

### text

```ts
readonly text: PromiseLike<string>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L21)

---

### warnings

```ts
readonly warnings: PromiseLike<readonly string[]>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionStream.ts#L31)
