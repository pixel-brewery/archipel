---
title: 'Class: PostmarkDeliveryStrategy'
generated: true
editUrl: false
---

# Class: PostmarkDeliveryStrategy

Defined in: [libs/platform-mailing/src/delivering/strategies/postmark/PostmarkDeliveryStrategy.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/postmark/PostmarkDeliveryStrategy.ts#L18)

The `PostmarkDeliveryStrategy` class.

## Extends

- [`DeliveryStrategyBase`](Class.DeliveryStrategyBase)

## Constructors

### Constructor

```ts
new PostmarkDeliveryStrategy(configService): PostmarkDeliveryStrategy;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/postmark/PostmarkDeliveryStrategy.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/postmark/PostmarkDeliveryStrategy.ts#L33)

Constructs a new instance of the `PostmarkDeliveryStrategy` class.

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`PostmarkDeliveryStrategy`

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

Defined in: [libs/platform-mailing/src/delivering/strategies/postmark/PostmarkDeliveryStrategy.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/postmark/PostmarkDeliveryStrategy.ts#L53)

Sends an email using the Postmark transport.

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
