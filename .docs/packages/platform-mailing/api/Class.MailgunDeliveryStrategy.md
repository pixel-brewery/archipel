---
title: 'Class: MailgunDeliveryStrategy'
generated: true
editUrl: false
---

# Class: MailgunDeliveryStrategy

Defined in: [libs/platform-mailing/src/delivering/strategies/mailgun/MailgunDeliveryStrategy.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/mailgun/MailgunDeliveryStrategy.ts#L20)

Delivers emails via the Mailgun API.

## Extends

- [`DeliveryStrategyBase`](Class.DeliveryStrategyBase)

## Constructors

### Constructor

```ts
new MailgunDeliveryStrategy(configService): MailgunDeliveryStrategy;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/mailgun/MailgunDeliveryStrategy.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/mailgun/MailgunDeliveryStrategy.ts#L36)

Constructs a new instance of the `MailgunDeliveryStrategy` class.

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`MailgunDeliveryStrategy`

#### Overrides

[`DeliveryStrategyBase`](Class.DeliveryStrategyBase).[`constructor`](Class.DeliveryStrategyBase#constructor)

## Methods

### send()

```ts
send(
   from,
   to,
   subject,
   content,
   isHtml,
   _attachments?
): Promise<void>;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/mailgun/MailgunDeliveryStrategy.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/mailgun/MailgunDeliveryStrategy.ts#L61)

Sends an email using the Mailgun transport.

#### Parameters

| Parameter       | Type                                             | Description                                                             |
| --------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `from`          | `string`                                         | Sender's email address                                                  |
| `to`            | `string`                                         | Recipient's email address                                               |
| `subject`       | `string`                                         | Subject of the email                                                    |
| `content`       | `string`                                         | Email body content (plain text or HTML)                                 |
| `isHtml`        | `boolean`                                        | Flag to indicate whether the email is HTML (true) or plain text (false) |
| `_attachments?` | [`IMailAttachment`](Interface.IMailAttachment)[] | -                                                                       |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`DeliveryStrategyBase`](Class.DeliveryStrategyBase).[`send`](Class.DeliveryStrategyBase#send)
