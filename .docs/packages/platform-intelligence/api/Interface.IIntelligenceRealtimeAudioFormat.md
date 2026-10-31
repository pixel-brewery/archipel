---
title: 'Interface: IIntelligenceRealtimeAudioFormat'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeAudioFormat

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeAudioFormat.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeAudioFormat.ts#L6)

Provider-neutral audio format configuration.

## Properties

### rate?

```ts
readonly rate?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeAudioFormat.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeAudioFormat.ts#L13)

Sample rate in Hertz when the format requires one.

---

### type

```ts
readonly type: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeAudioFormat.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeAudioFormat.ts#L10)

MIME-style audio format identifier such as `audio/pcm`.
