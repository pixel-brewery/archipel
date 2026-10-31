---
title: 'Class: ModelContext'
generated: true
editUrl: false
---

# Class: ModelContext

Defined in: [libs/platform-intelligence-agents/src/memory/ModelContext.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/memory/ModelContext.ts#L11)

Maintains a bounded conversation with defensive snapshots and independent forks.

## Constructors

### Constructor

```ts
new ModelContext(record?, maxMessages?): ModelContext;
```

Defined in: [libs/platform-intelligence-agents/src/memory/ModelContext.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/memory/ModelContext.ts#L29)

Restores an independent conversation or creates an empty one with a generated identity.

#### Parameters

| Parameter      | Type                                                   | Default value | Description                                                  |
| -------------- | ------------------------------------------------------ | ------------- | ------------------------------------------------------------ |
| `record?`      | [`IModelContextRecord`](Interface.IModelContextRecord) | `...`         | Conversation identity and provider-neutral messages to copy. |
| `maxMessages?` | `number`                                               | `512`         | Maximum retained message count; defaults to 512.             |

#### Returns

`ModelContext`

#### Throws

When identity, capacity or restored message count is invalid.

## Properties

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-intelligence-agents/src/memory/ModelContext.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/memory/ModelContext.ts#L16)

Stable conversation identifier preserved by forks and persistence records.

## Methods

### append()

```ts
append(messages): void;
```

Defined in: [libs/platform-intelligence-agents/src/memory/ModelContext.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/memory/ModelContext.ts#L57)

Appends a defensive message snapshot atomically without truncating tool-call/result pairs.

#### Parameters

| Parameter  | Type                                   | Description                                                  |
| ---------- | -------------------------------------- | ------------------------------------------------------------ |
| `messages` | readonly `IIntelligenceModelMessage`[] | Provider-neutral messages to append in their existing order. |

#### Returns

`void`

#### Throws

When the complete append would exceed conversation capacity.

---

### fork()

```ts
fork(): ModelContext;
```

Defined in: [libs/platform-intelligence-agents/src/memory/ModelContext.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/memory/ModelContext.ts#L68)

Creates an independent context for a concurrent loop.

#### Returns

`ModelContext`

An independent conversation with the same identity and capacity.

---

### getMessages()

```ts
getMessages(): readonly IIntelligenceModelMessage[];
```

Defined in: [libs/platform-intelligence-agents/src/memory/ModelContext.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/memory/ModelContext.ts#L48)

Returns an isolated snapshot so callers cannot mutate another run.

#### Returns

readonly `IIntelligenceModelMessage`[]

An isolated snapshot of the conversation messages.

---

### record()

```ts
record(): IModelContextRecord;
```

Defined in: [libs/platform-intelligence-agents/src/memory/ModelContext.ts:76](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/memory/ModelContext.ts#L76)

Serializes memory for an application-owned persistence adapter.

#### Returns

[`IModelContextRecord`](Interface.IModelContextRecord)

A defensive record suitable for consumer-owned persistence.
