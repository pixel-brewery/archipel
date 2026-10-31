---
title: 'Class: TotpMfaChannel'
generated: true
editUrl: false
---

# Class: TotpMfaChannel

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L18)

## Implements

- `IMfaChannel`

## Constructors

### Constructor

```ts
new TotpMfaChannel(
   mfaSubject,
   configService,
   encryptionService,
   otpService
): TotpMfaChannel;
```

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L33)

#### Parameters

| Parameter           | Type                                     |
| ------------------- | ---------------------------------------- |
| `mfaSubject`        | [`MfaSubjectBase`](Class.MfaSubjectBase) |
| `configService`     | `ConfigService`                          |
| `encryptionService` | `MfaEncryptionService`                   |
| `otpService`        | `IOtpService`                            |

#### Returns

`TotpMfaChannel`

## Properties

### method

```ts
readonly method: "totp" = 'totp';
```

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L21)

Unique identifier of the MFA method (e.g., `totp`, `sms`, `email`).

#### Implementation of

`IMfaChannel.method`

## Methods

### initSetup()

```ts
initSetup(userId, _context?): Promise<IMfaSetup>;
```

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L50)

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

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:109](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L109)

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

Defined in: [libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/channels/TotpMfaChannel.ts#L84)

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
