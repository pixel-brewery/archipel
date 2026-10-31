---
title: 'Interface: IIntelligenceToolExecutionEndEvent'
generated: true
editUrl: false
---

# Interface: IIntelligenceToolExecutionEndEvent

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts#L13)

Tool execution completion event.

## Properties

### callId

```ts
readonly callId: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts#L14)

---

### toolCall

```ts
readonly toolCall: IIntelligenceToolCall;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts#L15)

---

### toolExecutionMs

```ts
readonly toolExecutionMs: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts#L17)

---

### toolOutput

```ts
readonly toolOutput: IntelligenceToolOutput;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolExecutionEndEvent.ts#L16)
