---
title: 'Interface: IIntelligenceRealtimeTurnDetectionConfiguration'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeTurnDetectionConfiguration

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts#L6)

Provider-neutral voice activity detection configuration.

## Properties

### prefixPaddingMs?

```ts
readonly prefixPaddingMs?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts#L19)

Audio retained before detected speech starts.

---

### silenceDurationMs?

```ts
readonly silenceDurationMs?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts#L16)

Silence duration that closes a turn.

---

### threshold?

```ts
readonly threshold?: number;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts#L13)

Activation threshold between zero and one.

---

### type

```ts
readonly type: "server-vad" | "semantic-vad" | "disabled";
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeTurnDetectionConfiguration.ts#L10)

Voice activity detection strategy.
