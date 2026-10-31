---
title: 'Interface: IIntelligenceRealtimeSessionConfiguration'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeSessionConfiguration

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L18)

Provider-neutral configuration for a realtime AI session.

This contract intentionally mirrors the stable Archipel surface instead of
exposing the AI SDK's experimental realtime types to applications.

## Properties

### inputAudioFormat?

```ts
readonly inputAudioFormat?: IIntelligenceRealtimeAudioFormat;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L31)

Input audio format.

---

### inputAudioTranscription?

```ts
readonly inputAudioTranscription?: IIntelligenceRealtimeTranscriptionConfiguration;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L34)

Optional input transcription settings.

---

### instructions?

```ts
readonly instructions?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L22)

System instructions for the model.

---

### outputAudioFormat?

```ts
readonly outputAudioFormat?: IIntelligenceRealtimeAudioFormat;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L40)

Output audio format.

---

### outputAudioTranscription?

```ts
readonly outputAudioTranscription?: IIntelligenceRealtimeTranscriptionConfiguration;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L37)

Optional spoken-output transcription settings.

---

### outputModalities?

```ts
readonly outputModalities?: readonly ("text" | "audio")[];
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L28)

Modalities the model may produce.

---

### providerOptions?

```ts
readonly providerOptions?: Readonly<Record<string, unknown>>;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L49)

Provider-specific escape hatch retained inside the Archipel boundary.

---

### tools?

```ts
readonly tools?: readonly IIntelligenceRealtimeToolDefinition[];
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L46)

Explicit tool definitions. Registered Archipel tools are used when omitted.

---

### turnDetection?

```ts
readonly turnDetection?:
  | IIntelligenceRealtimeTurnDetectionConfiguration
  | null;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L43)

Voice activity detection settings, or `null` for push-to-talk.

---

### voice?

```ts
readonly voice?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeSessionConfiguration.ts#L25)

Provider voice identifier for spoken model output.
