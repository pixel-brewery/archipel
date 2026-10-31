---
title: 'Class: MailService'
generated: true
editUrl: false
---

# Class: MailService

Defined in: [libs/platform-mailing/src/services/MailService.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/MailService.ts#L20)

Represents the `MailService` class.

## Constructors

### Constructor

```ts
new MailService(
   configService,
   mailTemplateEngine,
   deliveryStrategy
): MailService;
```

Defined in: [libs/platform-mailing/src/services/MailService.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/MailService.ts#L37)

Constructs a new instance of the `MailService` class.

#### Parameters

| Parameter            | Type                                                 |
| -------------------- | ---------------------------------------------------- |
| `configService`      | `ConfigService`                                      |
| `mailTemplateEngine` | [`MailTemplateEngine`](Class.MailTemplateEngine)     |
| `deliveryStrategy`   | [`DeliveryStrategyBase`](Class.DeliveryStrategyBase) |

#### Returns

`MailService`

## Methods

### send()

```ts
send(
   mailOptions,
   content,
   isHtml,
   attachments?
): Promise<void>;
```

Defined in: [libs/platform-mailing/src/services/MailService.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/MailService.ts#L67)

Sends an email with either plain text or HTML content.

#### Parameters

| Parameter             | Type                                                          | Description                                                             |
| --------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `mailOptions`         | \{ `from?`: `string`; `subject`: `string`; `to`: `string`; \} | -                                                                       |
| `mailOptions.from?`   | `string`                                                      | Sender's email address (optional, defaults to config)                   |
| `mailOptions.subject` | `string`                                                      | Subject of the email                                                    |
| `mailOptions.to`      | `string`                                                      | Recipient's email address                                               |
| `content`             | `string`                                                      | Email body content (plain text or HTML)                                 |
| `isHtml`              | `boolean`                                                     | Flag to indicate whether the email is HTML (true) or plain text (false) |
| `attachments?`        | [`IMailAttachment`](Interface.IMailAttachment)[]              | -                                                                       |

#### Returns

`Promise`\<`void`\>

---

### sendTemplate()

```ts
sendTemplate(mailOptions, templateOptions): Promise<void>;
```

Defined in: [libs/platform-mailing/src/services/MailService.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/services/MailService.ts#L105)

Sends an email using a predefined template (HTML or text).
Automatically uses the template format (either 'html' or 'txt') based on the environment variable.

When no `subject` is provided in `mailOptions`, the subject is resolved from the
stored template and interpolated with the given `templateParams` (industry-standard
behavior matching Mailchimp/SendGrid/Postmark).

#### Parameters

| Parameter                        | Type                                                                                                                                          | Description                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `mailOptions`                    | \{ `from?`: `string`; `subject?`: `string`; `to`: `string`; \}                                                                                | -                                                                   |
| `mailOptions.from?`              | `string`                                                                                                                                      | Sender's email address (optional, defaults to config)               |
| `mailOptions.subject?`           | `string`                                                                                                                                      | Subject of the email (optional — resolved from template if omitted) |
| `mailOptions.to`                 | `string`                                                                                                                                      | Recipient's email address                                           |
| `templateOptions`                | \{ `templateName`: `string`; `templateParams`: `Record`\<`string`, `string` \| `number` \| `boolean` \| `Date` \| `undefined` \| `null`\>; \} | -                                                                   |
| `templateOptions.templateName`   | `string`                                                                                                                                      | Name of the template to be used                                     |
| `templateOptions.templateParams` | `Record`\<`string`, `string` \| `number` \| `boolean` \| `Date` \| `undefined` \| `null`\>                                                    | Parameters to inject into the template                              |

#### Returns

`Promise`\<`void`\>
