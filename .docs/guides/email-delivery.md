---
title: Email Delivery
description: Send transactional emails with multiple providers, template engines, and email verification flows.
order: 8
---

# Email Delivery

This guide covers sending emails with `platform-mailing`: choosing a delivery provider, configuring template rendering, sending transactional emails, and integrating email verification flows.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-mailing
```

---

## Choose a Delivery Strategy

`platform-mailing` supports multiple email providers via **subpath exports**. Each delivery strategy is a separate entry point — only the provider you import is bundled (tree-shakeable).

| Strategy     | Subpath Import                                                 | When to use                             |
| ------------ | -------------------------------------------------------------- | --------------------------------------- |
| **SMTP**     | `@pixel-brewery/archipel-platform-mailing/delivering/smtp`     | Any SMTP server (self-hosted, relay)    |
| **Postmark** | `@pixel-brewery/archipel-platform-mailing/delivering/postmark` | Postmark transactional email            |
| **Resend**   | `@pixel-brewery/archipel-platform-mailing/delivering/resend`   | Resend API                              |
| **SendGrid** | `@pixel-brewery/archipel-platform-mailing/delivering/sendgrid` | Twilio SendGrid                         |
| **Mailgun**  | `@pixel-brewery/archipel-platform-mailing/delivering/mailgun`  | Mailgun API                             |
| **Empty**    | `@pixel-brewery/archipel-platform-mailing/delivering/empty`    | Development only — logs without sending |

The strategy is selected at **compile time** by passing the concrete class to `MailModule.register()`. No environment variable is needed for strategy selection.

---

## Module Registration

`MailModule` requires explicit registration via `MailModule.register()`. You select the delivery strategy and template-fetch strategy at compile time by passing the concrete class:

```typescript
import { Module } from '@nestjs/common';
import { MailModule } from '@pixel-brewery/archipel-platform-mailing';
import { ResendDeliveryStrategy } from '@pixel-brewery/archipel-platform-mailing/delivering/resend';
import { FileTemplateFetchStrategy } from '@pixel-brewery/archipel-platform-mailing/templating/file';

@Module({
    imports: [
        MailModule.register({
            deliveryStrategy: ResendDeliveryStrategy,
            templateFetchStrategy: FileTemplateFetchStrategy,
            templateNames: ['AuthRegister', 'AuthVerify', 'AuthForgotPassword'],
        }),
    ],
})
export class AppModule {}
```

### Options

| Option                       | Type                                  | Default                           | Description                                              |
| ---------------------------- | ------------------------------------- | --------------------------------- | -------------------------------------------------------- |
| `deliveryStrategy`           | `Type<DeliveryStrategyBase>`          | _required_                        | Concrete delivery strategy class                         |
| `templateFetchStrategy`      | `Type<TemplateFetchStrategyBase>`     | _required_                        | Concrete template-fetch strategy class                   |
| `templateNames`              | `ReadonlyArray<string>`               | `[]`                              | Template names to load (for `FileTemplateFetchStrategy`) |
| `configEntries`              | `ReadonlyArray<IConfigRegistryEntry>` | `PLATFORM_MAILING_CONFIG_ENTRIES` | Provider-specific config entries                         |
| `templateRepositoryProvider` | `Provider<IMailTemplateRepository>`   | —                                 | Required when using `DatabaseTemplateFetchStrategy`      |
| `isGlobal`                   | `boolean`                             | `true`                            | Whether to register the module globally                  |

---

## Package Structure & Tree-Shaking

`platform-mailing` uses **multi-entry-point subpath exports**. The main entry point exports only core contracts, services, and base classes. Each provider (delivery strategy or template strategy) is a **separate subpath** that you import independently:

```
@pixel-brewery/archipel-platform-mailing                    → Core (MailService, MailModule, abstract bases, models, errors)
@pixel-brewery/archipel-platform-mailing/delivering/smtp     → SmtpDeliveryStrategy + SMTP_CONFIG_ENTRIES
@pixel-brewery/archipel-platform-mailing/delivering/resend   → ResendDeliveryStrategy + RESEND_CONFIG_ENTRIES
@pixel-brewery/archipel-platform-mailing/delivering/postmark → PostmarkDeliveryStrategy + POSTMARK_CONFIG_ENTRIES
@pixel-brewery/archipel-platform-mailing/delivering/sendgrid → SendGridDeliveryStrategy + SENDGRID_CONFIG_ENTRIES
@pixel-brewery/archipel-platform-mailing/delivering/mailgun  → MailgunDeliveryStrategy + MAILGUN_CONFIG_ENTRIES
@pixel-brewery/archipel-platform-mailing/delivering/empty    → EmptyDeliveryStrategy
@pixel-brewery/archipel-platform-mailing/templating/file     → FileTemplateFetchStrategy
@pixel-brewery/archipel-platform-mailing/templating/blob     → BlobTemplateFetchStrategy
@pixel-brewery/archipel-platform-mailing/templating/database → DatabaseTemplateFetchStrategy
@pixel-brewery/archipel-platform-mailing/health              → MailHealthIndicator
```

This ensures that importing the core package does **not** pull in provider-specific SDKs (e.g., `nodemailer`, `resend`, `@sendgrid/mail`). Only the subpath you import triggers a dependency on the corresponding SDK.

---

## Configuration

### Core Variables

```dotenv
MAIL_TEMPLATE_ENGINE_FORMAT=html
MAIL_SENDER_EMAIL=noreply@yourapp.com
```

::: info Strategy Selection
The delivery strategy and template-fetch strategy are no longer configured via environment variables. They are selected at compile time by passing the class to `MailModule.register()`. The `MAIL_DELIVERY_STRATEGY` and `MAIL_TEMPLATE_STRATEGY` environment variables have been removed.
:::

### Provider-Specific Variables

#### SMTP

```dotenv
MAIL_SMTP_HOST=smtp.example.com
MAIL_SMTP_PORT=587
MAIL_SMTP_USER=user@example.com
MAIL_SMTP_PASS=password
MAIL_SMTP_SECURE=true
```

#### Resend

```dotenv
MAIL_RESEND_API_KEY=re_...
```

#### Postmark

```dotenv
MAIL_POSTMARK_API_KEY=...
```

#### SendGrid

```dotenv
MAIL_SENDGRID_API_KEY=SG...
```

#### Mailgun

```dotenv
MAIL_MAILGUN_API_KEY=key-...
MAIL_MAILGUN_DOMAIN=mg.yourapp.com
```

### Template Strategies

Templates can be loaded from the filesystem, from blob storage, or from a database — each via a dedicated **subpath export**:

| Strategy     | Subpath Import                                                 | Description                                   |
| ------------ | -------------------------------------------------------------- | --------------------------------------------- |
| **File**     | `@pixel-brewery/archipel-platform-mailing/templating/file`     | Load templates from a local directory         |
| **Blob**     | `@pixel-brewery/archipel-platform-mailing/templating/blob`     | Load templates from `platform-blob-storage`   |
| **Database** | `@pixel-brewery/archipel-platform-mailing/templating/database` | Load templates from a database via repository |

Select the strategy by passing the class to `MailModule.register({ templateFetchStrategy: ... })`. For file-based templates, place your `.html` or `.txt` files in the configured template directory.

---

## Sending Emails

Inject `MailService` to send emails with templates:

```typescript
import { Injectable } from '@nestjs/common';
import { MailService } from '@pixel-brewery/archipel-platform-mailing';

@Injectable()
export class NotificationService {
    private readonly _mailService: MailService;

    constructor(mailService: MailService) {
        this._mailService = mailService;
    }

    public async sendWelcomeEmail(email: string, userName: string): Promise<void> {
        await this._mailService.send({
            to: email,
            subject: 'Welcome to YourApp',
            template: 'welcome',
            context: {
                userName,
                dashboardUrl: 'https://yourapp.com/dashboard',
            },
        });
    }
}
```

The `template` field is the template name (without extension). The `context` object is passed to the template engine for variable substitution.

---

## SMTP Connection Verification

`SmtpConnectionVerifier` verifies SMTP server connectivity and optionally sends a test email. It replaces the deprecated `MailVerificationService`.

```typescript
import { Injectable } from '@nestjs/common';
import { SmtpConnectionVerifier } from '@pixel-brewery/archipel-platform-mailing';

@Injectable()
export class HealthService {
    constructor(private readonly _smtpVerifier: SmtpConnectionVerifier) {}

    public async checkSmtpConnectivity(): Promise<boolean> {
        return this._smtpVerifier.verifyConnection();
    }

    public async sendTestEmail(to: string): Promise<boolean> {
        return this._smtpVerifier.sendTestEmail(to);
    }
}
```

## Email Verification (Deprecated)

::: warning Deprecated
`MailVerificationService` is deprecated. Use `SmtpConnectionVerifier` for SMTP connectivity checks.
:::

`MailVerificationService` provides a complete email verification flow:

```typescript
import { Injectable } from '@nestjs/common';
import { MailVerificationService } from '@pixel-brewery/archipel-platform-mailing';
import { VerificationService } from '@pixel-brewery/archipel-platform-authentication';

@Injectable()
export class RegistrationService {
    private readonly _mailVerification: MailVerificationService;
    private readonly _verification: VerificationService;

    constructor(mailVerification: MailVerificationService, verification: VerificationService) {
        this._mailVerification = mailVerification;
        this._verification = verification;
    }

    public async sendVerificationEmail(userId: string, email: string): Promise<void> {
        const token = await this._verification.exhibitToken({ userId, email });

        await this._mailVerification.sendVerification(email, token);
    }
}
```

---

## Sending Attachments

`MailService.send()` accepts an optional `attachments` parameter for attaching files to outgoing emails:

```typescript
import type { IMailAttachment } from '@pixel-brewery/archipel-platform-mailing';

const invoice: IMailAttachment = {
    filename: 'invoice-2024-001.pdf',
    content: pdfBuffer,
    contentType: 'application/pdf',
};

await this._mailService.send({ to: 'user@example.com', subject: 'Your Invoice' }, '<p>Please find your invoice attached.</p>', true, [invoice]);
```

### Constraints

| Rule           | Detail                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **MIME types** | Only allowed types are accepted: PDF, Word, Excel, ZIP, PNG, JPEG, GIF, WebP, plain text, and CSV                         |
| **Max size**   | Each attachment must not exceed **25 MB**                                                                                 |
| **Validation** | `MailService` validates MIME type and size before passing to the delivery strategy. Invalid attachments throw immediately |

---

## Error Handling

All delivery strategies throw a `MailDeliveryError` when email sending fails. The error wraps the underlying provider error and identifies which provider failed:

```typescript
import { MailDeliveryError } from '@pixel-brewery/archipel-platform-mailing';

try {
    await this._mail.send(options, content, true);
} catch (error) {
    if (error instanceof MailDeliveryError) {
        // error.provider → 'postmark', 'smtp', 'resend', 'sendgrid', 'mailgun'
        // error.code     → 'MAIL_DELIVERY'
        // error.cause    → Original provider SDK error
    }
}
```

Map `MailDeliveryError` to an appropriate HTTP response in your global exception filter. The `provider` property helps with targeted alerting and retry decisions.

---

## Security

`MailService` applies automatic sanitization to the email subject to prevent SMTP header injection attacks. Any carriage-return (`\r`) or line-feed (`\n`) characters found in the subject string are replaced with a space before the message is handed to the delivery strategy. This protection runs transparently on every `send` call.

---

## Health Checks

`MailHealthIndicator` is registered automatically and verifies connectivity to the configured mail provider. It appears in your `/health` endpoint alongside other health indicators.

---

## Development Tips

- Use `EmptyDeliveryStrategy` during local development to see email content in the console without sending real emails.
- Use the **blob** or **database** template strategy when templates are shared across multiple services or managed by a CMS.
- Template variables use the format defined by the template engine. Place templates in a well-organized directory structure (e.g., `templates/mail/welcome.html`).
- Only import the delivery/templating subpath you actually need — this keeps your bundle lean and avoids unnecessary peer dependency requirements.

---

## Next Steps

- See the [Email Templates](/guides/email-templates) guide for creating, registering, and overriding email templates with ResourceManager
- See the [Authentication & Authorization](/guides/authentication-and-authorization) guide for integrating email verification into the login flow
- Browse the [platform-mailing API reference](/packages/platform-mailing/api/) for complete method signatures
