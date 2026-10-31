---
title: 'Interface: IIntelligenceRealtimeConversationTurn'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeConversationTurn

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeConversationTurn.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeConversationTurn.ts#L7)

One earlier turn of a conversation that a new browser-owned WebRTC session
receives as quoted, untrusted context.

## Properties

### speaker

```ts
readonly speaker: "user" | "assistant";
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeConversationTurn.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeConversationTurn.ts#L11)

Who spoke the turn in the earlier session.

---

### text

```ts
readonly text: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeConversationTurn.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeConversationTurn.ts#L17)

Plain text of the turn, such as a final transcript sentence. It must
contain visible characters; line breaks inside it do not start a new turn.
