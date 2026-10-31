---
title: 'Class: MailDeliveryError'
generated: true
editUrl: false
---

# Class: MailDeliveryError

Defined in: [libs/platform-mailing/src/errors/MailDeliveryError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/errors/MailDeliveryError.ts#L6)

Domain error thrown when email delivery fails.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new MailDeliveryError(
   provider,
   message,
   cause?
): MailDeliveryError;
```

Defined in: [libs/platform-mailing/src/errors/MailDeliveryError.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/errors/MailDeliveryError.ts#L16)

#### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `provider` | `string`  |
| `message`  | `string`  |
| `cause?`   | `unknown` |

#### Returns

`MailDeliveryError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "MAIL_DELIVERY" = 'MAIL_DELIVERY';
```

Defined in: [libs/platform-mailing/src/errors/MailDeliveryError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/errors/MailDeliveryError.ts#L9)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-mailing/src/errors/MailDeliveryError.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/errors/MailDeliveryError.ts#L10)
