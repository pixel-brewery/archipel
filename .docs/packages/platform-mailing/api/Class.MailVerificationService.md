---
title: '~~Class: MailVerificationService~~'
generated: true
editUrl: false
---

# ~~Class: MailVerificationService~~

Defined in: [libs/platform-mailing/src/services/MailVerificationService.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/MailVerificationService.ts#L15)

## Deprecated

Use [SmtpConnectionVerifier](Class.SmtpConnectionVerifier) instead. This class will be
removed in a future major release.

## Extends

- [`SmtpConnectionVerifier`](Class.SmtpConnectionVerifier)

## Constructors

### Constructor

```ts
new MailVerificationService(configService): MailVerificationService;
```

Defined in: [libs/platform-mailing/src/services/SmtpConnectionVerifier.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/SmtpConnectionVerifier.ts#L32)

Constructs a new instance of the [SmtpConnectionVerifier](Class.SmtpConnectionVerifier) class.

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`MailVerificationService`

#### Inherited from

[`SmtpConnectionVerifier`](Class.SmtpConnectionVerifier).[`constructor`](Class.SmtpConnectionVerifier#constructor)

## Methods

### ~~sendTestEmail()~~

```ts
sendTestEmail(
   from,
   to,
   subject,
   text
): Promise<void>;
```

Defined in: [libs/platform-mailing/src/services/SmtpConnectionVerifier.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/SmtpConnectionVerifier.ts#L74)

Send an email for testing purposes.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `string` |
| `to`      | `string` |
| `subject` | `string` |
| `text`    | `string` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SmtpConnectionVerifier`](Class.SmtpConnectionVerifier).[`sendTestEmail`](Class.SmtpConnectionVerifier#sendtestemail)

---

### ~~verifyConnection()~~

```ts
verifyConnection(): Promise<boolean>;
```

Defined in: [libs/platform-mailing/src/services/SmtpConnectionVerifier.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/SmtpConnectionVerifier.ts#L54)

Verifies that the configured SMTP server is reachable.

#### Returns

`Promise`\<`boolean`\>

`true` if the SMTP server is reachable, `false` otherwise.

#### Inherited from

[`SmtpConnectionVerifier`](Class.SmtpConnectionVerifier).[`verifyConnection`](Class.SmtpConnectionVerifier#verifyconnection)

---

### ~~verifyEmail()~~

```ts
verifyEmail(_email): Promise<boolean>;
```

Defined in: [libs/platform-mailing/src/services/MailVerificationService.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/MailVerificationService.ts#L27)

Verifies SMTP server connectivity.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `_email`  | `string` | Unused. Kept for backward compatibility. |

#### Returns

`Promise`\<`boolean`\>

#### Deprecated

Use [SmtpConnectionVerifier.verifyConnection](Class.SmtpConnectionVerifier#verifyconnection) instead.
The `email` parameter was never used.
