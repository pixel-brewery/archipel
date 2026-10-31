---
title: 'Class: RuntimeState'
generated: true
editUrl: false
---

# Class: RuntimeState

Defined in: [libs/platform-intelligence-agents/src/runtime/RuntimeState.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/RuntimeState.ts#L9)

Maintains bounded participant membership for one explicitly owned runtime.

## Constructors

### Constructor

```ts
new RuntimeState(maxParticipants?): RuntimeState;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/RuntimeState.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/RuntimeState.ts#L22)

Creates an empty participant registry with a fixed capacity.

#### Parameters

| Parameter          | Type     | Default value | Description                                               |
| ------------------ | -------- | ------------- | --------------------------------------------------------- |
| `maxParticipants?` | `number` | `256`         | Maximum distinct participant identities; defaults to 256. |

#### Returns

`RuntimeState`

#### Throws

When capacity is not a positive safe integer.

## Methods

### addParticipant()

```ts
addParticipant(participant): boolean;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/RuntimeState.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/RuntimeState.ts#L41)

Registers once. Returns false for duplicate registration.

#### Parameters

| Parameter     | Type                                       | Description                              |
| ------------- | ------------------------------------------ | ---------------------------------------- |
| `participant` | [`ParticipantBase`](Class.ParticipantBase) | Participant to register in this runtime. |

#### Returns

`boolean`

True only when a new identity was inserted.

#### Throws

When inserting a new identity would exceed participant capacity.

---

### getParticipant()

```ts
getParticipant(id): ParticipantBase | undefined;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/RuntimeState.ts:72](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/RuntimeState.ts#L72)

Returns a participant, or undefined when absent.

#### Parameters

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `id`      | `string` | Stable identity to resolve or remove from the owning registry. |

#### Returns

[`ParticipantBase`](Class.ParticipantBase) \| `undefined`

The currently registered participant for the supplied identity.

---

### getParticipants()

```ts
getParticipants(): readonly ParticipantBase[];
```

Defined in: [libs/platform-intelligence-agents/src/runtime/RuntimeState.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/RuntimeState.ts#L80)

Returns a membership snapshot in registration order.

#### Returns

readonly [`ParticipantBase`](Class.ParticipantBase)[]

A membership snapshot in registration order.

---

### removeParticipant()

```ts
removeParticipant(id): boolean;
```

Defined in: [libs/platform-intelligence-agents/src/runtime/RuntimeState.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/runtime/RuntimeState.ts#L57)

Removes membership without destroying application-owned memory.

#### Parameters

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `id`      | `string` | Stable identity to resolve or remove from the owning registry. |

#### Returns

`boolean`

True only when the identity was registered and removed.
