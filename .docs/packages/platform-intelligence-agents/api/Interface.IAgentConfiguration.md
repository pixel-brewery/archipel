---
title: 'Interface: IAgentConfiguration'
generated: true
editUrl: false
---

# Interface: IAgentConfiguration

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L10)

Provider-neutral virtual participant definition; product identity remains application-owned.

## Properties

### capabilities?

```ts
readonly capabilities?: readonly string[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L26)

Descriptive capabilities advertised to other participants.

---

### handlers?

```ts
readonly handlers?: readonly ISituationHandler[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L30)

Situation handlers registered for the participant.

---

### id?

```ts
readonly id?: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L14)

Participant identity; a UUID is generated when omitted.

---

### instruction

```ts
readonly instruction: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L22)

Instructions applied to every provider request made for this agent.

---

### maxTools?

```ts
readonly maxTools?: number;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L38)

Explicit catalog capacity; defaults to 128 and can be raised by the owning application.

---

### memory?

```ts
readonly memory?: ModelContext;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L42)

Conversation retained between completed runs; a new ModelContext is created when omitted.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L18)

Nonblank display name published in the participant manifest.

---

### tools?

```ts
readonly tools?: Readonly<Record<string, IIntelligenceToolDefinition<unknown, unknown>>>;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentConfiguration.ts#L34)

Application tool declarations and executors copied into the agent's immutable catalog.
