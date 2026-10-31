---
title: 'Interface: IIntelligenceTranscriptionResult'
generated: true
editUrl: false
---

# Interface: IIntelligenceTranscriptionResult

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts#L6)

Provider-neutral transcription result.

## Properties

### durationInSeconds?

```ts
readonly durationInSeconds?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts#L16)

---

### language?

```ts
readonly language?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts#L15)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts#L18)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts#L17)

---

### segments

```ts
readonly segments: readonly {
  endSecond: number;
  startSecond: number;
  text: string;
}[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts#L10)

---

### text

```ts
readonly text: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts#L9)

---

### warnings

```ts
readonly warnings: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceTranscriptionResult.ts#L19)
