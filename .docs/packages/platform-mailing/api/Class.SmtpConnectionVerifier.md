---
title: 'Class: SmtpConnectionVerifier'
generated: true
editUrl: false
---

# Class: SmtpConnectionVerifier

Defined in: [libs/platform-mailing/src/services/SmtpConnectionVerifier.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/SmtpConnectionVerifier.ts#L17)

Verifies SMTP server connectivity. Does **not** validate individual email
addresses — only checks whether the configured SMTP transport is reachable.

## Extended by

- [`MailVerificationService`](Class.MailVerificationService)

## Constructors

### Constructor

```ts
new SmtpConnectionVerifier(configService): SmtpConnectionVerifier;
```

Defined in: [libs/platform-mailing/src/services/SmtpConnectionVerifier.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/SmtpConnectionVerifier.ts#L32)

Constructs a new instance of the SmtpConnectionVerifier class.

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`SmtpConnectionVerifier`

## Methods

### sendTestEmail()

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

---

### verifyConnection()

```ts
verifyConnection(): Promise<boolean>;
```

Defined in: [libs/platform-mailing/src/services/SmtpConnectionVerifier.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/SmtpConnectionVerifier.ts#L54)

Verifies that the configured SMTP server is reachable.

#### Returns

`Promise`\<`boolean`\>

`true` if the SMTP server is reachable, `false` otherwise.
