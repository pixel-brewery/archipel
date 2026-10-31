---
title: 'Class: ResendDeliveryStrategy'
generated: true
editUrl: false
---

# Class: ResendDeliveryStrategy

Defined in: [libs/platform-mailing/src/delivering/strategies/resend/ResendDeliveryStrategy.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/resend/ResendDeliveryStrategy.ts#L18)

Delivers emails via the Resend API.

## Extends

- [`DeliveryStrategyBase`](Class.DeliveryStrategyBase)

## Constructors

### Constructor

```ts
new ResendDeliveryStrategy(configService): ResendDeliveryStrategy;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/resend/ResendDeliveryStrategy.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/resend/ResendDeliveryStrategy.ts#L33)

Constructs a new instance of the `ResendDeliveryStrategy` class.

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`ResendDeliveryStrategy`

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

Defined in: [libs/platform-mailing/src/delivering/strategies/resend/ResendDeliveryStrategy.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/resend/ResendDeliveryStrategy.ts#L53)

Sends an email using the Resend transport.

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
