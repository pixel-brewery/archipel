---
title: 'Interface: IIntelligenceAgentConfiguration'
generated: true
editUrl: false
---

# Interface: IIntelligenceAgentConfiguration

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts#L14)

Reusable provider-neutral tool-loop agent configuration.

## Properties

### activeToolNames?

```ts
readonly activeToolNames?: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts#L27)

Default tool subset of every run.

A run that supplies its own `activeToolNames` or `deferredToolLoading`
replaces this agent-level tool exposure as a whole.

---

### deferredToolLoading?

```ts
readonly deferredToolLoading?: IIntelligenceDeferredToolLoadingOptions;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts#L35)

Default on-demand tool exposure of every run.

A run that supplies its own `activeToolNames` or `deferredToolLoading`
replaces this agent-level tool exposure as a whole. Requires `maxSteps`
of at least `2`.

---

### instructions

```ts
readonly instructions: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts#L18)

---

### maxSteps?

```ts
readonly maxSteps?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts#L36)

---

### model?

```ts
readonly model?: IIntelligenceModelReference;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts#L19)

---

### name?

```ts
readonly name?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts#L17)

---

### tools?

```ts
readonly tools?: Readonly<Record<string, IIntelligenceToolDefinition<unknown, unknown>>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceAgentConfiguration.ts#L20)
