---
title: 'Type Alias: IntelligenceRealtimeConversationHistoryStatus'
generated: true
editUrl: false
---

# Type Alias: IntelligenceRealtimeConversationHistoryStatus

```ts
type IntelligenceRealtimeConversationHistoryStatus = 'handed-over' | 'unsupported';
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeConversationHistoryStatus.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeConversationHistoryStatus.ts#L13)

Outcome of handing earlier conversation turns to a new browser-owned WebRTC
session.

- `handed-over`: the provider received the turns as quoted context with the
  session setup.
- `unsupported`: the provider or the model's API cannot receive earlier turns
  during WebRTC setup. The session started without them, so its model does
  not know the earlier conversation.
