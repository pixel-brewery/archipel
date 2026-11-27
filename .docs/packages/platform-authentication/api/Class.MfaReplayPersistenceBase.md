---
title: 'Abstract Class: MfaReplayPersistenceBase'
generated: true
editUrl: false
---

# Abstract Class: MfaReplayPersistenceBase

Defined in: [libs/platform-authentication/src/abstracts/MfaReplayPersistenceBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/MfaReplayPersistenceBase.ts#L9)

Optional atomic persistence for one-use MFA evidence across processes.

Consumers opt in by providing this token beside their MFA subject adapter. Each operation must validate that
the subject and credential are still current and commit the consume decision atomically in durable storage.

## Constructors

### Constructor

```ts
new MfaReplayPersistenceBase(): MfaReplayPersistenceBase;
```

#### Returns

`MfaReplayPersistenceBase`

## Methods

### consumeBackupCode()

```ts
abstract consumeBackupCode(subjectId, storedHash): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/abstracts/MfaReplayPersistenceBase.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/MfaReplayPersistenceBase.ts#L40)

Removes exactly one current backup hash while MFA remains enabled.

#### Parameters

| Parameter    | Type     | Description                                                 |
| ------------ | -------- | ----------------------------------------------------------- |
| `subjectId`  | `string` | Subject of the verification.                                |
| `storedHash` | `string` | Stored hash whose plaintext was cryptographically verified. |

#### Returns

`Promise`\<`boolean`\>

Whether this call alone removed the current hash.

---

### consumeTotpStep()

```ts
abstract consumeTotpStep(
   subjectId,
   secretFingerprint,
   timeStep
): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/abstracts/MfaReplayPersistenceBase.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/MfaReplayPersistenceBase.ts#L30)

Consumes a verified TOTP counter only if it is newer than the consumed counter of the current secret.

#### Parameters

| Parameter           | Type     | Description                                                        |
| ------------------- | -------- | ------------------------------------------------------------------ |
| `subjectId`         | `string` | Subject of the verification.                                       |
| `secretFingerprint` | `string` | SHA-256 hex fingerprint of the persisted encrypted channel secret. |
| `timeStep`          | `number` | Exact RFC 6238 counter matched by cryptographic verification.      |

#### Returns

`Promise`\<`boolean`\>

Whether this call alone consumed the current credential's counter.
