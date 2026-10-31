---
title: 'Class: SendGridDeliveryStrategy'
generated: true
editUrl: false
---

# Class: SendGridDeliveryStrategy

Defined in: [libs/platform-mailing/src/delivering/strategies/sendgrid/SendGridDeliveryStrategy.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/sendgrid/SendGridDeliveryStrategy.ts#L18)

Delivers emails via the SendGrid API.

## Extends

- [`DeliveryStrategyBase`](Class.DeliveryStrategyBase)

## Constructors

### Constructor

```ts
new SendGridDeliveryStrategy(configService): SendGridDeliveryStrategy;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/sendgrid/SendGridDeliveryStrategy.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/sendgrid/SendGridDeliveryStrategy.ts#L32)

Constructs a new instance of the `SendGridDeliveryStrategy` class.

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`SendGridDeliveryStrategy`

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

Defined in: [libs/platform-mailing/src/delivering/strategies/sendgrid/SendGridDeliveryStrategy.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/sendgrid/SendGridDeliveryStrategy.ts#L52)

Sends an email using the SendGrid transport.

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
