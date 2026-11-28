---
title: 'Class: MfaService'
generated: true
editUrl: false
---

# Class: MfaService

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L30)

Orchestrates MFA channels, backup codes, and user preferences.

## Constructors

### Constructor

```ts
new MfaService(
   bcryptService,
   mfaSubject,
   encryptionService,
   channels,
   replay?
): MfaService;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L44)

#### Parameters

| Parameter           | Type                                                         |
| ------------------- | ------------------------------------------------------------ |
| `bcryptService`     | `BcryptService`                                              |
| `mfaSubject`        | [`MfaSubjectBase`](Class.MfaSubjectBase)                     |
| `encryptionService` | [`MfaEncryptionService`](Class.MfaEncryptionService)         |
| `channels`          | `IMfaChannel`[]                                              |
| `replay?`           | [`MfaReplayPersistenceBase`](Class.MfaReplayPersistenceBase) |

#### Returns

`MfaService`

## Accessors

### registeredMethods

#### Get Signature

```ts
get registeredMethods(): string[];
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:279](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L279)

##### Returns

`string`[]

## Methods

### disable()

```ts
disable(userId): Promise<void>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:267](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L267)

Disables MFA for a user and clears channel secrets.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `userId`  | `string` |

#### Returns

`Promise`\<`void`\>

---

### getEnabledMethods()

```ts
getEnabledMethods(userId): Promise<{
  methods: string[];
  preferredMethod?: string;
}>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:170](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L170)

Returns enabled methods and preferred method for a user.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `userId`  | `string` |

#### Returns

`Promise`\<\{
`methods`: `string`[];
`preferredMethod?`: `string`;
\}\>

#### Throws

With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.

---

### initSetup()

```ts
initSetup(
   userId,
   method,
   context?
): Promise<IMfaSetup>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:70](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L70)

Initializes setup for a specific MFA method.

#### Parameters

| Parameter  | Type               |
| ---------- | ------------------ |
| `userId`   | `string`           |
| `method`   | `string`           |
| `context?` | `IMfaSetupContext` |

#### Returns

`Promise`\<[`IMfaSetup`](Interface.IMfaSetup)\>

#### Throws

With `400` and `UNSUPPORTED_MFA_METHOD` when no channel serves the method.

#### Throws

With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.

#### Throws

With `400` and `MFA_METHOD_ALREADY_ENABLED` when the method is already enabled.

---

### issueChallenges()

```ts
issueChallenges(userId, methods): Promise<void>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:207](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L207)

Issues out-of-band challenge codes for login flows for applicable channels.

#### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| `userId`  | `string`            |
| `methods` | readonly `string`[] |

#### Returns

`Promise`\<`void`\>

---

### regenerateBackupCodes()

```ts
regenerateBackupCodes(userId): Promise<readonly string[]>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:249](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L249)

Regenerates backup codes.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `userId`  | `string` |

#### Returns

`Promise`\<readonly `string`[]\>

#### Throws

With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.

#### Throws

With `400` and `MFA_NOT_ENABLED` when the person has not enabled MFA.

---

### setPreferredMethod()

```ts
setPreferredMethod(userId, method): Promise<void>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:226](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L226)

Updates the preferred MFA method.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `userId`  | `string` |
| `method`  | `string` |

#### Returns

`Promise`\<`void`\>

#### Throws

With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.

#### Throws

With `400` and `MFA_METHOD_NOT_ENABLED` when the method is not enabled.

---

### verifyChallenge()

```ts
verifyChallenge(
   userId,
   method,
   code
): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:125](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L125)

Verifies a login challenge using the selected method or backup code.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `userId`  | `string` |
| `method`  | `string` |
| `code`    | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Throws

With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.

#### Throws

With `400` and `MFA_NOT_ENABLED` when the person has not enabled MFA.

#### Throws

With `400` and `UNSUPPORTED_MFA_METHOD` when no channel serves the method.

---

### verifySetup()

```ts
verifySetup(
   userId,
   method,
   code
): Promise<IMfaConfirmation>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L91)

Verifies the initial code for a method and issues backup codes.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `userId`  | `string` |
| `method`  | `string` |
| `code`    | `string` |

#### Returns

`Promise`\<[`IMfaConfirmation`](Interface.IMfaConfirmation)\>

#### Throws

With `400` and `UNSUPPORTED_MFA_METHOD` when no channel serves the method.

#### Throws

With `400` and `MFA_CODE_REQUIRED` when the code is empty.

#### Throws

With `400` and `INVALID_MFA_CODE` when the code does not match. The person is
signed in, so the rejection must not read as an ended session.

#### Throws

With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.
