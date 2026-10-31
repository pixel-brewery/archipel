---
title: 'Abstract Class: ParticipantBase'
generated: true
editUrl: false
---

# Abstract Class: ParticipantBase

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L10)

Combines a stable participant identity with replaceable situation handlers.

## Extended by

- [`Agent`](Class.Agent)
- [`Human`](Class.Human)

## Constructors

### Constructor

```ts
protected new ParticipantBase(manifest, handlers?): ParticipantBase;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L28)

Initializes a participant identity and its reaction handlers.

#### Parameters

| Parameter   | Type                                                          | Default value | Description                                                               |
| ----------- | ------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------- |
| `manifest`  | [`IParticipantManifest`](Interface.IParticipantManifest)      | `undefined`   | Nonblank identity and display name with descriptive participant metadata. |
| `handlers?` | readonly [`ISituationHandler`](Interface.ISituationHandler)[] | `[]`          | Initial event reactions; at most 128 handlers may be registered.          |

#### Returns

`ParticipantBase`

#### Throws

When identity is blank or the handler capacity is exceeded.

## Accessors

### id

#### Get Signature

```ts
get id(): string;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L46)

Stable participant identifier.

##### Returns

`string`

The immutable identity supplied when the participant was created.

## Methods

### getHandlers()

```ts
getHandlers(): readonly ISituationHandler[];
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L68)

Returns a snapshot of registered handlers.

#### Returns

readonly [`ISituationHandler`](Interface.ISituationHandler)[]

A snapshot of the current handler registrations.

---

### getManifest()

```ts
getManifest(): IParticipantManifest;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L59)

Returns the immutable public manifest.

#### Returns

[`IParticipantManifest`](Interface.IParticipantManifest)

The immutable participant identity and descriptive capabilities.

---

### setHandlers()

```ts
setHandlers(handlers): void;
```

Defined in: [libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts:78](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/abstracts/ParticipantBase.ts#L78)

Atomically replaces handlers; existing dispatches keep their snapshot.

#### Parameters

| Parameter  | Type                                                          | Description                                           |
| ---------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `handlers` | readonly [`ISituationHandler`](Interface.ISituationHandler)[] | Initial or replacement participant reaction handlers. |

#### Returns

`void`

#### Throws

When the handler list exceeds the supported participant capacity.
