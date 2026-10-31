---
title: 'Class: EmptyDeliveryStrategy'
generated: true
editUrl: false
---

# Class: EmptyDeliveryStrategy

Defined in: [libs/platform-mailing/src/delivering/strategies/empty/EmptyDeliveryStrategy.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/empty/EmptyDeliveryStrategy.ts#L15)

The `EmptyDeliveryStrategy` class.

## Extends

- [`DeliveryStrategyBase`](Class.DeliveryStrategyBase)

## Constructors

### Constructor

```ts
new EmptyDeliveryStrategy(): EmptyDeliveryStrategy;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/empty/EmptyDeliveryStrategy.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/empty/EmptyDeliveryStrategy.ts#L29)

Constructs a new instance of the `EmptyDeliveryStrategy` class.

#### Returns

`EmptyDeliveryStrategy`

#### Overrides

[`DeliveryStrategyBase`](Class.DeliveryStrategyBase).[`constructor`](Class.DeliveryStrategyBase#constructor)

## Methods

### send()

```ts
abstract send(
   from,
   to,
   subject,
   content,
   isHtml,
   _attachments?
): Promise<void>;
```

Defined in: [libs/platform-mailing/src/delivering/strategies/empty/EmptyDeliveryStrategy.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/delivering/strategies/empty/EmptyDeliveryStrategy.ts#L37)

Sends an email with either plain text or HTML content.

#### Parameters

| Parameter       | Type                                             | Description                                                             |
| --------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `from`          | `string`                                         | Sender's email address (optional, defaults to config)                   |
| `to`            | `string`                                         | Recipient's email address                                               |
| `subject`       | `string`                                         | Subject of the email                                                    |
| `content`       | `string`                                         | Email body content (plain text or HTML)                                 |
| `isHtml`        | `boolean`                                        | Flag to indicate whether the email is HTML (true) or plain text (false) |
| `_attachments?` | [`IMailAttachment`](Interface.IMailAttachment)[] | -                                                                       |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`DeliveryStrategyBase`](Class.DeliveryStrategyBase).[`send`](Class.DeliveryStrategyBase#send)
