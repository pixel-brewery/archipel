---
title: 'Class: MfaService'
generated: true
editUrl: false
---

# Class: MfaService

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L29)

Orchestrates MFA channels, backup codes, and user preferences.

## Constructors

### Constructor

```ts
new MfaService(
   bcryptService,
   mfaSubject,
   encryptionService,
   channels
): MfaService;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L42)

#### Parameters

| Parameter           | Type                                     |
| ------------------- | ---------------------------------------- |
| `bcryptService`     | `BcryptService`                          |
| `mfaSubject`        | [`MfaSubjectBase`](Class.MfaSubjectBase) |
| `encryptionService` | `MfaEncryptionService`                   |
| `channels`          | `IMfaChannel`[]                          |

#### Returns

`MfaService`

## Accessors

### registeredMethods

#### Get Signature

```ts
get registeredMethods(): string[];
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:275](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L275)

##### Returns

`string`[]

## Methods

### disable()

```ts
disable(userId): Promise<void>;
```

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:263](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L263)

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

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:166](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L166)

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

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L66)

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

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:203](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L203)

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

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:245](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L245)

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

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:222](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L222)

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

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:121](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L121)

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

Defined in: [libs/platform-authentication/src/mfa/MfaService.ts:87](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaService.ts#L87)

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
