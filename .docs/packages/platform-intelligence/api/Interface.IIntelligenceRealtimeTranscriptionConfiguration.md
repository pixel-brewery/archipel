---
title: 'Interface: IIntelligenceRealtimeTranscriptionConfiguration'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeTranscriptionConfiguration

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTranscriptionConfiguration.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTranscriptionConfiguration.ts#L6)

Provider-neutral transcription configuration.

## Properties

### language?

```ts
readonly language?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTranscriptionConfiguration.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTranscriptionConfiguration.ts#L13)

Optional BCP 47 language hint.

---

### model?

```ts
readonly model?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTranscriptionConfiguration.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTranscriptionConfiguration.ts#L10)

Provider-specific transcription model.

---

### prompt?

```ts
readonly prompt?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTranscriptionConfiguration.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTranscriptionConfiguration.ts#L16)

Optional prompt used to guide the transcription.
