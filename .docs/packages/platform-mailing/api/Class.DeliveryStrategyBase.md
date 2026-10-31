---
title: 'Abstract Class: DeliveryStrategyBase'
generated: true
editUrl: false
---

# Abstract Class: DeliveryStrategyBase

Defined in: [libs/platform-mailing/src/delivering/strategies/abstracts/DeliveryStrategyBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/abstracts/DeliveryStrategyBase.ts#L9)

Represents the base class for all email delivery strategies.

## Extended by

- [`EmptyDeliveryStrategy`](Class.EmptyDeliveryStrategy)
- [`SmtpDeliveryStrategy`](Class.SmtpDeliveryStrategy)
- [`PostmarkDeliveryStrategy`](Class.PostmarkDeliveryStrategy)
- [`ResendDeliveryStrategy`](Class.ResendDeliveryStrategy)
- [`SendGridDeliveryStrategy`](Class.SendGridDeliveryStrategy)
- [`MailgunDeliveryStrategy`](Class.MailgunDeliveryStrategy)

## Constructors

### Constructor

```ts
protected new DeliveryStrategyBase(): DeliveryStrategyBase;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/abstracts/DeliveryStrategyBase.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/abstracts/DeliveryStrategyBase.ts#L20)

Initializes a new instance of the `DeliveryStrategyBase` class.

#### Returns

`DeliveryStrategyBase`

## Methods

### send()

```ts
abstract send(
   from,
   to,
   subject,
   content,
   isHtml,
   attachments?
): Promise<void>;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/abstracts/DeliveryStrategyBase.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/abstracts/DeliveryStrategyBase.ts#L43)

Sends an email with either plain text or HTML content.

#### Parameters

| Parameter      | Type                                             | Description                                                             |
| -------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `from`         | `string`                                         | Sender's email address (optional, defaults to config)                   |
| `to`           | `string`                                         | Recipient's email address                                               |
| `subject`      | `string`                                         | Subject of the email                                                    |
| `content`      | `string`                                         | Email body content (plain text or HTML)                                 |
| `isHtml`       | `boolean`                                        | Flag to indicate whether the email is HTML (true) or plain text (false) |
| `attachments?` | [`IMailAttachment`](Interface.IMailAttachment)[] | Optional array of file attachments                                      |

#### Returns

`Promise`\<`void`\>
