---
title: 'Class: VerificationService'
generated: true
editUrl: false
---

# Class: VerificationService

Defined in: [libs/platform-authentication/src/services/VerificationService.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/VerificationService.ts#L20)

Manages email / PIN verification tokens via the [VerificationSubjectBase](Class.VerificationSubjectBase).

## Constructors

### Constructor

```ts
new VerificationService(
   jwtService,
   hostService,
   verificationSubject,
   configService
): VerificationService;
```

Defined in: [libs/platform-authentication/src/services/VerificationService.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/VerificationService.ts#L41)

Constructs a new instance of the `VerificationService` class.

#### Parameters

| Parameter             | Type                                                       | Description                         |
| --------------------- | ---------------------------------------------------------- | ----------------------------------- |
| `jwtService`          | `JwtService`                                               | JWT service instance.               |
| `hostService`         | `HostService`                                              | Host service instance.              |
| `verificationSubject` | [`VerificationSubjectBase`](Class.VerificationSubjectBase) | Verification subject abstract base. |
| `configService`       | `ConfigService`                                            | Configuration service instance.     |

#### Returns

`VerificationService`

## Methods

### buildVerificationLink()

```ts
buildVerificationLink(token): string;
```

Defined in: [libs/platform-authentication/src/services/VerificationService.ts:155](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/VerificationService.ts#L155)

Constructs the verification link.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `token`   | `string` | The verification token. |

#### Returns

`string`

The URL to verify the email.

---

### exhibitToken()

```ts
exhibitToken(data): Promise<string>;
```

Defined in: [libs/platform-authentication/src/services/VerificationService.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/VerificationService.ts#L59)

Exhibits a new verification token.

#### Parameters

| Parameter | Type                           | Description          |
| --------- | ------------------------------ | -------------------- |
| `data`    | `Record`\<`string`, `string`\> | The data to exhibit. |

#### Returns

`Promise`\<`string`\>

The verification token.

---

### redeemToken()

```ts
redeemToken(token): Promise<Record<string, string>>;
```

Defined in: [libs/platform-authentication/src/services/VerificationService.ts:76](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/VerificationService.ts#L76)

Redeems the user's token.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `token`   | `string` | The token to redeem. |

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

The token data.

---

### verifyPin()

```ts
verifyPin(pin, login): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/services/VerificationService.ts:111](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/VerificationService.ts#L111)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `pin`     | `string` |
| `login`   | `string` |

#### Returns

`Promise`\<`boolean`\>

---

### verifyToken()

```ts
verifyToken(token): Promise<boolean>;
```

Defined in: [libs/platform-authentication/src/services/VerificationService.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/services/VerificationService.ts#L86)

Verifies the user's token.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `token`   | `string` | The verification token. |

#### Returns

`Promise`\<`boolean`\>
