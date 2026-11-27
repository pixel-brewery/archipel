---
title: 'Class: TotpMfaChannel'
generated: true
editUrl: false
---

# Class: TotpMfaChannel

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L21)

## Implements

- `IMfaChannel`

## Constructors

### Constructor

```ts
new TotpMfaChannel(
   mfaSubject,
   configService,
   encryptionService,
   otpService,
   replay?
): TotpMfaChannel;
```

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L37)

#### Parameters

| Parameter           | Type                                                         |
| ------------------- | ------------------------------------------------------------ |
| `mfaSubject`        | [`MfaSubjectBase`](Class.MfaSubjectBase)                     |
| `configService`     | `ConfigService`                                              |
| `encryptionService` | [`MfaEncryptionService`](Class.MfaEncryptionService)         |
| `otpService`        | `IOtpService`                                                |
| `replay?`           | [`MfaReplayPersistenceBase`](Class.MfaReplayPersistenceBase) |

#### Returns

`TotpMfaChannel`

## Properties

### method

```ts
readonly method: "totp" = 'totp';
```

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L24)

Unique identifier of the MFA method (e.g., `totp`, `sms`, `email`).

#### Implementation of

`IMfaChannel.method`

## Methods

### initSetup()

```ts
initSetup(userId, _context?): Promise<IMfaSetup>;
```

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L56)

Initializes the setup flow for the channel and persists any channel-specific bootstrap state.

#### Parameters

| Parameter   | Type               | Description                            |
| ----------- | ------------------ | -------------------------------------- |
| `userId`    | `string`           | Identifier of the user starting setup. |
| `_context?` | `IMfaSetupContext` | -                                      |

#### Returns

`Promise`\<[`IMfaSetup`](Interface.IMfaSetup)\>

#### Implementation of

`IMfaChannel.initSetup`

---

### verifyChallenge()

```ts
verifyChallenge(userId, code): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:115](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L115)

Verifies a challenge code during login.

#### Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `userId`  | `string` | Identifier of the challenged user. |
| `code`    | `string` | User supplied challenge code.      |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`IMfaChannel.verifyChallenge`

---

### verifySetup()

```ts
verifySetup(userId, code): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:90](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L90)

Verifies the first setup code and marks the channel as ready for challenges.

The person is already signed in, so a failed setup rejects with a `400`
error such as `MfaSetupNotInitializedError`; only challenge failures answer `401`.

#### Parameters

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `userId`  | `string` | Identifier of the user finishing setup. |
| `code`    | `string` | User supplied setup code.               |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`IMfaChannel.verifySetup`
