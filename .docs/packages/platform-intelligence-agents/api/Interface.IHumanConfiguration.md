---
title: 'Interface: IHumanConfiguration'
generated: true
editUrl: false
---

# Interface: IHumanConfiguration

Defined in: [libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts#L8)

Human participant definition.

## Properties

### capabilities?

```ts
readonly capabilities?: readonly string[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts#L20)

Descriptive capabilities advertised to other participants.

---

### handlers?

```ts
readonly handlers?: readonly ISituationHandler[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts#L24)

Situation handlers registered for the participant.

---

### id?

```ts
readonly id?: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts#L12)

Participant identity; a UUID is generated when omitted.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IHumanConfiguration.ts#L16)

Nonblank display name published in the participant manifest.
