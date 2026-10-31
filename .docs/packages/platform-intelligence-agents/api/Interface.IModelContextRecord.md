---
title: 'Interface: IModelContextRecord'
generated: true
editUrl: false
---

# Interface: IModelContextRecord

Defined in: [libs/platform-intelligence-agents/src/interfaces/IModelContextRecord.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IModelContextRecord.ts#L8)

Application-persistable memory record; does not contain executable tools.

## Properties

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IModelContextRecord.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IModelContextRecord.ts#L12)

Conversation identity preserved during persistence and restoration.

---

### messages

```ts
readonly messages: readonly IIntelligenceModelMessage[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IModelContextRecord.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IModelContextRecord.ts#L16)

Provider-neutral conversation messages without executable tool definitions.
