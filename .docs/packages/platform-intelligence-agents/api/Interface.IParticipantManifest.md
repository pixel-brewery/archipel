---
title: 'Interface: IParticipantManifest'
generated: true
editUrl: false
---

# Interface: IParticipantManifest

Defined in: [libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts#L6)

Stable identity visible within one explicitly owned runtime.

## Properties

### capabilities?

```ts
readonly capabilities?: readonly string[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts#L22)

Descriptive capabilities advertised to other participants.

---

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts#L10)

Stable participant identity within the owning runtime.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts#L14)

Display name visible to other runtime participants.

---

### role

```ts
readonly role: "agent" | "human";
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IParticipantManifest.ts#L18)

Participant category; descriptive metadata does not grant permissions.
