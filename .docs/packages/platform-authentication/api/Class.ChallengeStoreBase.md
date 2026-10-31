---
title: 'Abstract Class: ChallengeStoreBase'
generated: true
editUrl: false
---

# Abstract Class: ChallengeStoreBase

Defined in: [libs/platform-authentication/src/abstracts/ChallengeStoreBase.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/ChallengeStoreBase.ts#L12)

Abstract base for persisting MFA challenge state.

The default implementation stores challenges in-memory (single instance only).
For multi-instance deployments, provide a Redis-backed implementation
via `IAuthModuleOptions.challengeStore`.

## Constructors

### Constructor

```ts
new ChallengeStoreBase(): ChallengeStoreBase;
```

#### Returns

`ChallengeStoreBase`

## Methods

### delete()

```ts
abstract delete(id): Promise<void>;
```

Defined in: [libs/platform-authentication/src/abstracts/ChallengeStoreBase.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/ChallengeStoreBase.ts#L45)

Remove a challenge by its identifier.

#### Parameters

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| `id`      | `string` | The challenge identifier. |

#### Returns

`Promise`\<`void`\>

---

### get()

```ts
abstract get(id): Promise<IMfaChallengeState | undefined>;
```

Defined in: [libs/platform-authentication/src/abstracts/ChallengeStoreBase.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/ChallengeStoreBase.ts#L38)

Retrieve a challenge by its identifier.

#### Parameters

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| `id`      | `string` | The challenge identifier. |

#### Returns

`Promise`\<[`IMfaChallengeState`](Interface.IMfaChallengeState) \| `undefined`\>

The challenge state, or `undefined` if not found.

---

### set()

```ts
abstract set(id, challenge): Promise<void>;
```

Defined in: [libs/platform-authentication/src/abstracts/ChallengeStoreBase.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/ChallengeStoreBase.ts#L30)

Store a challenge.

#### Parameters

| Parameter   | Type                                                 | Description                     |
| ----------- | ---------------------------------------------------- | ------------------------------- |
| `id`        | `string`                                             | The challenge identifier.       |
| `challenge` | [`IMfaChallengeState`](Interface.IMfaChallengeState) | The challenge state to persist. |

#### Returns

`Promise`\<`void`\>
