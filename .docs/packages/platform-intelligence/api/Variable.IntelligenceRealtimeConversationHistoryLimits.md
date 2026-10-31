---
title: 'Variable: IntelligenceRealtimeConversationHistoryLimits'
generated: true
editUrl: false
---

# Variable: IntelligenceRealtimeConversationHistoryLimits

```ts
const IntelligenceRealtimeConversationHistoryLimits: {
    maxTextBytes: 6144;
    maxTurns: 32;
};
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeConversationHistoryLimits.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeConversationHistoryLimits.ts#L15)

Provider-neutral bounds of the conversation history that a new
browser-owned WebRTC session can receive.

A history within these bounds fits the limits of every provider that
supports the handover, including the quoting that Archipel adds. Select the
most recent turns that fit: Archipel rejects a larger history with an
`IntelligenceValidationError` instead of shortening it.

- `maxTurns`: most turns in one handover.
- `maxTextBytes`: most UTF-8 bytes of all turn texts combined.

## Type Declaration

| Name                                              | Type   | Default value | Defined in                                                                                                                                                                                                                                                          |
| ------------------------------------------------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-maxtextbytes"></a> `maxTextBytes` | `6144` | `6_144`       | [libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeConversationHistoryLimits.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeConversationHistoryLimits.ts#L17) |
| <a id="property-maxturns"></a> `maxTurns`         | `32`   | `32`          | [libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeConversationHistoryLimits.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeConversationHistoryLimits.ts#L16) |
