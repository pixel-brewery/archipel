---
title: '@pixel-brewery/archipel-platform-mailing'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-mailing

## Classes

| Class                                                                | Description                                                                                                                                           |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [BlobTemplateFetchStrategy](Class.BlobTemplateFetchStrategy)         | The `BlobTemplateFetchStrategy` class.                                                                                                                |
| [DatabaseTemplateFetchStrategy](Class.DatabaseTemplateFetchStrategy) | Template fetch strategy that loads templates from a database via the [IMailTemplateRepository](Interface.IMailTemplateRepository) abstract base.      |
| [DeliveryStrategyBase](Class.DeliveryStrategyBase)                   | Represents the base class for all email delivery strategies.                                                                                          |
| [EmptyDeliveryStrategy](Class.EmptyDeliveryStrategy)                 | The `EmptyDeliveryStrategy` class.                                                                                                                    |
| [FileTemplateFetchStrategy](Class.FileTemplateFetchStrategy)         | The `FileTemplateFetchStrategy` class.                                                                                                                |
| [MailDeliveryError](Class.MailDeliveryError)                         | Domain error thrown when email delivery fails.                                                                                                        |
| [MailgunDeliveryStrategy](Class.MailgunDeliveryStrategy)             | Delivers emails via the Mailgun API.                                                                                                                  |
| [MailHealthIndicator](Class.MailHealthIndicator)                     | Health indicator for mail service.                                                                                                                    |
| [MailModule](Class.MailModule)                                       | Represents the mail module.                                                                                                                           |
| [MailService](Class.MailService)                                     | Represents the `MailService` class.                                                                                                                   |
| [MailTemplateEngine](Class.MailTemplateEngine)                       | The `MailTemplateEngine` class.                                                                                                                       |
| [~~MailVerificationService~~](Class.MailVerificationService)         | -                                                                                                                                                     |
| [PostmarkDeliveryStrategy](Class.PostmarkDeliveryStrategy)           | The `PostmarkDeliveryStrategy` class.                                                                                                                 |
| [ResendDeliveryStrategy](Class.ResendDeliveryStrategy)               | Delivers emails via the Resend API.                                                                                                                   |
| [SendGridDeliveryStrategy](Class.SendGridDeliveryStrategy)           | Delivers emails via the SendGrid API.                                                                                                                 |
| [SmtpConnectionVerifier](Class.SmtpConnectionVerifier)               | Verifies SMTP server connectivity. Does **not** validate individual email addresses — only checks whether the configured SMTP transport is reachable. |
| [SmtpDeliveryStrategy](Class.SmtpDeliveryStrategy)                   | The `SmtpDeliveryStrategy` class.                                                                                                                     |
| [TemplateFetchStrategyBase](Class.TemplateFetchStrategyBase)         | Represents the base class for template fetch strategies.                                                                                              |

## Interfaces

| Interface                                                    | Description                                                                  |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| [IMailAttachment](Interface.IMailAttachment)                 | Represents an email attachment.                                              |
| [IMailEvents](Interface.IMailEvents)                         | Represents the contract of events emitted by the mail domain.                |
| [IMailModuleOptions](Interface.IMailModuleOptions)           | Options for configuring the [MailModule](Class.MailModule).                  |
| [IMailTemplate](Interface.IMailTemplate)                     | Represents a single mail template record stored in a persistent store.       |
| [IMailTemplateRepository](Interface.IMailTemplateRepository) | Contract for mail template persistence.                                      |
| [IMailTemplateVariants](Interface.IMailTemplateVariants)     | Represents the in-memory structure for a single template (multiple formats). |

## Type Aliases

| Type Alias                                         | Description                                   |
| -------------------------------------------------- | --------------------------------------------- |
| [MailTemplateFormat](TypeAlias.MailTemplateFormat) | Union type of all supported template formats. |

## Variables

| Variable                                                                              | Description                                                                                                                                                                              |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ALLOWED\_ATTACHMENT\_MIME\_TYPES](Variable.ALLOWED_ATTACHMENT_MIME_TYPES)            | Allowed MIME types for email attachments.                                                                                                                                                |
| [MAIL\_DELIVERY\_STRATEGY\_TOKEN](Variable.MAIL_DELIVERY_STRATEGY_TOKEN)              | -                                                                                                                                                                                        |
| [MAIL\_HOST](Variable.MAIL_HOST)                                                      | Mail host checked by the health indicator.                                                                                                                                               |
| [MAIL\_MAILGUN\_API\_KEY](Variable.MAIL_MAILGUN_API_KEY)                              | API key for the Mailgun delivery service.                                                                                                                                                |
| [MAIL\_MAILGUN\_DOMAIN](Variable.MAIL_MAILGUN_DOMAIN)                                 | Mailgun domain (e.g. `mg.example.com`).                                                                                                                                                  |
| [MAIL\_PORT](Variable.MAIL_PORT)                                                      | Mail port checked by the health indicator.                                                                                                                                               |
| [MAIL\_POSTMARK\_API\_KEY](Variable.MAIL_POSTMARK_API_KEY)                            | API key for the Postmark delivery service.                                                                                                                                               |
| [MAIL\_RESEND\_API\_KEY](Variable.MAIL_RESEND_API_KEY)                                | API key for the Resend delivery service.                                                                                                                                                 |
| [MAIL\_SENDER\_EMAIL](Variable.MAIL_SENDER_EMAIL)                                     | Sender e-mail address shown in the `From` header.                                                                                                                                        |
| [MAIL\_SENDGRID\_API\_KEY](Variable.MAIL_SENDGRID_API_KEY)                            | API key for the SendGrid delivery service.                                                                                                                                               |
| [MAIL\_SMTP\_HOST](Variable.MAIL_SMTP_HOST)                                           | SMTP server host.                                                                                                                                                                        |
| [MAIL\_SMTP\_PASSWORD](Variable.MAIL_SMTP_PASSWORD)                                   | SMTP authentication password.                                                                                                                                                            |
| [MAIL\_SMTP\_PORT](Variable.MAIL_SMTP_PORT)                                           | SMTP server port.                                                                                                                                                                        |
| [MAIL\_SMTP\_SECURE](Variable.MAIL_SMTP_SECURE)                                       | Whether the SMTP connection uses TLS.                                                                                                                                                    |
| [MAIL\_SMTP\_USER](Variable.MAIL_SMTP_USER)                                           | SMTP authentication username.                                                                                                                                                            |
| [MAIL\_TEMPLATE\_ENGINE\_FORMAT](Variable.MAIL_TEMPLATE_ENGINE_FORMAT)                | Template engine format identifier (e.g. `handlebars`).                                                                                                                                   |
| [MAIL\_TEMPLATE\_FETCH\_STRATEGY\_TOKEN](Variable.MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN) | Central definition of injection tokens used by the mail module. Using constants instead of raw string literals prevents accidental typos and enables refactors with compile time safety. |
| [MAIL\_TEMPLATE\_NAMES\_TOKEN](Variable.MAIL_TEMPLATE_NAMES_TOKEN)                    | -                                                                                                                                                                                        |
| [MAIL\_TEMPLATE\_REPOSITORY\_TOKEN](Variable.MAIL_TEMPLATE_REPOSITORY_TOKEN)          | -                                                                                                                                                                                        |
| [MAIL\_USER](Variable.MAIL_USER)                                                      | Mail user checked by the health indicator.                                                                                                                                               |
| [MAILGUN\_API\_KEY](Variable.MAILGUN_API_KEY)                                         | API key for the Mailgun delivery service.                                                                                                                                                |
| [MAILGUN\_CONFIG\_ENTRIES](Variable.MAILGUN_CONFIG_ENTRIES)                           | Configuration entries required by the Mailgun delivery provider.                                                                                                                         |
| [MAILGUN\_DOMAIN](Variable.MAILGUN_DOMAIN)                                            | Mailgun domain (e.g. `mg.example.com`).                                                                                                                                                  |
| [MAX\_ATTACHMENT\_SIZE\_BYTES](Variable.MAX_ATTACHMENT_SIZE_BYTES)                    | Maximum attachment size in bytes (25 MB).                                                                                                                                                |
| [PLATFORM\_MAILING\_CONFIG\_ENTRIES](Variable.PLATFORM_MAILING_CONFIG_ENTRIES)        | All configuration entries required by `platform-mailing`.                                                                                                                                |
| [POSTMARK\_API\_KEY](Variable.POSTMARK_API_KEY)                                       | API key for the Postmark delivery service.                                                                                                                                               |
| [POSTMARK\_CONFIG\_ENTRIES](Variable.POSTMARK_CONFIG_ENTRIES)                         | Configuration entries required by the Postmark delivery provider.                                                                                                                        |
| [RESEND\_API\_KEY](Variable.RESEND_API_KEY)                                           | API key for the Resend delivery service.                                                                                                                                                 |
| [RESEND\_CONFIG\_ENTRIES](Variable.RESEND_CONFIG_ENTRIES)                             | Configuration entries required by the Resend delivery provider.                                                                                                                          |
| [SEND\_MAIL\_EVENT\_KEY](Variable.SEND_MAIL_EVENT_KEY)                                | Event key registry for the mail domain events.                                                                                                                                           |
| [SENDGRID\_API\_KEY](Variable.SENDGRID_API_KEY)                                       | API key for the SendGrid delivery service.                                                                                                                                               |
| [SENDGRID\_CONFIG\_ENTRIES](Variable.SENDGRID_CONFIG_ENTRIES)                         | Configuration entries required by the SendGrid delivery provider.                                                                                                                        |
| [SMTP\_CONFIG\_ENTRIES](Variable.SMTP_CONFIG_ENTRIES)                                 | Configuration entries required by the SMTP delivery provider.                                                                                                                            |
| [SMTP\_HOST](Variable.SMTP_HOST)                                                      | SMTP server host.                                                                                                                                                                        |
| [SMTP\_PASSWORD](Variable.SMTP_PASSWORD)                                              | SMTP authentication password.                                                                                                                                                            |
| [SMTP\_PORT](Variable.SMTP_PORT)                                                      | SMTP server port.                                                                                                                                                                        |
| [SMTP\_SECURE](Variable.SMTP_SECURE)                                                  | Whether the SMTP connection uses TLS.                                                                                                                                                    |
| [SMTP\_USER](Variable.SMTP_USER)                                                      | SMTP authentication username.                                                                                                                                                            |
