---
title: 'Interface: IIntelligenceRealtimeToolDefinition'
generated: true
editUrl: false
---

# Interface: IIntelligenceRealtimeToolDefinition

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts#L6)

Provider-neutral function definition exposed to a realtime model.

## Properties

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts#L16)

Optional model-facing description.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts#L13)

Unique tool name within the session.

---

### parameters

```ts
readonly parameters: Record<string, unknown>;
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts#L19)

JSON Schema describing the function parameters.

---

### type

```ts
readonly type: "function";
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IIntelligenceRealtimeToolDefinition.ts#L10)

Tool kind.
