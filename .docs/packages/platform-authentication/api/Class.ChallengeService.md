---
title: 'Class: ChallengeService'
generated: true
editUrl: false
---

# Class: ChallengeService

Defined in: [libs/platform-authentication/src/services/ChallengeService.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/ChallengeService.ts#L35)

Stores and validates MFA login challenges.

Delegates persistence to [ChallengeStoreBase](Class.ChallengeStoreBase) so the backing store
(in-memory, Redis, etc.) can be swapped without changing business logic.

## Constructors

### Constructor

```ts
new ChallengeService(configService, store): ChallengeService;
```

Defined in: [libs/platform-authentication/src/services/ChallengeService.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/ChallengeService.ts#L46)

#### Parameters

| Parameter       | Type                                             |
| --------------- | ------------------------------------------------ |
| `configService` | `ConfigService`                                  |
| `store`         | [`ChallengeStoreBase`](Class.ChallengeStoreBase) |

#### Returns

`ChallengeService`

## Methods

### create()

```ts
create(
   userId,
   methods,
   preferredMethod?,
   ipAddress?,
   userAgent?,
   location?,
   clientName?
): Promise<IMfaChallengeState>;
```

Defined in: [libs/platform-authentication/src/services/ChallengeService.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/ChallengeService.ts#L59)

Issues a new MFA challenge for a user.

#### Parameters

| Parameter          | Type       |
| ------------------ | ---------- |
| `userId`           | `string`   |
| `methods`          | `string`[] |
| `preferredMethod?` | `string`   |
| `ipAddress?`       | `string`   |
| `userAgent?`       | `string`   |
| `location?`        | `string`   |
| `clientName?`      | `string`   |

#### Returns

`Promise`\<[`IMfaChallengeState`](Interface.IMfaChallengeState)\>

---

### get()

```ts
get(challengeId): Promise<IMfaChallengeState>;
```

Defined in: [libs/platform-authentication/src/services/ChallengeService.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/ChallengeService.ts#L91)

Retrieves an active challenge, throwing if invalid or expired.

#### Parameters

| Parameter     | Type     |
| ------------- | -------- |
| `challengeId` | `string` |

#### Returns

`Promise`\<[`IMfaChallengeState`](Interface.IMfaChallengeState)\>

---

### incrementAttempts()

```ts
incrementAttempts(challengeId): Promise<IMfaChallengeState>;
```

Defined in: [libs/platform-authentication/src/services/ChallengeService.ts:108](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/ChallengeService.ts#L108)

Increments failed attempts and optionally invalidates the challenge.

#### Parameters

| Parameter     | Type     |
| ------------- | -------- |
| `challengeId` | `string` |

#### Returns

`Promise`\<[`IMfaChallengeState`](Interface.IMfaChallengeState)\>

---

### invalidate()

```ts
invalidate(challengeId): Promise<void>;
```

Defined in: [libs/platform-authentication/src/services/ChallengeService.ts:129](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/ChallengeService.ts#L129)

Invalidates a challenge after successful verification.

#### Parameters

| Parameter     | Type     |
| ------------- | -------- |
| `challengeId` | `string` |

#### Returns

`Promise`\<`void`\>
