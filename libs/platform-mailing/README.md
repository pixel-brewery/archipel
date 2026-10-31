# @pixel-brewery/archipel-platform-mailing

Multi-strategy email delivery for NestJS with support for SMTP, Postmark, Resend, SendGrid, and Mailgun.

## Features

- **Multi-provider** — Select SMTP, Postmark, Resend, SendGrid, Mailgun, or the built-in empty strategy during module registration
- **Subpath imports** — Each provider lives in its own subpath — install only the SDK you need
- **Template engines** — File-based or blob-based template fetching with variable substitution
- **Health checks** — `MailHealthIndicator` for readiness probes (separate `/health` subpath)
- **SMTP connection verification** — `SmtpConnectionVerifier` for verifying SMTP server reachability and sending test emails
- **Attachment support** — Send file attachments with MIME-type validation and size limits (25 MB max)
- **Header injection prevention** — Subject lines are automatically sanitized against SMTP header injection

> **Deprecation notice:** `MailVerificationService` is deprecated. Use `SmtpConnectionVerifier` instead — it provides `verifyConnection()` and `sendTestEmail()` methods.

## ⚠️ Environment Variables

### Core mailing configuration

| Variable                      | Required | Default | Description                          |
| ----------------------------- | -------- | ------- | ------------------------------------ |
| `MAIL_SENDER_EMAIL`           | yes      | -       | Sender address for the `From` header |
| `MAIL_TEMPLATE_ENGINE_FORMAT` | yes      | -       | Template engine format identifier    |

### Postmark provider

| Variable                | Required                                  | Default | Description      |
| ----------------------- | ----------------------------------------- | ------- | ---------------- |
| `MAIL_POSTMARK_API_KEY` | yes when using `PostmarkDeliveryStrategy` | -       | Postmark API key |

### SMTP provider

| Variable             | Required | Default     | Description           |
| -------------------- | -------- | ----------- | --------------------- |
| `MAIL_SMTP_HOST`     | no       | `localhost` | SMTP host             |
| `MAIL_SMTP_PORT`     | no       | `587`       | SMTP port             |
| `MAIL_SMTP_SECURE`   | no       | `false`     | Use secure SMTP (TLS) |
| `MAIL_SMTP_USER`     | no       | `''`        | SMTP username         |
| `MAIL_SMTP_PASSWORD` | no       | `''`        | SMTP password         |

### Health indicator

| Variable    | Required | Default | Description            |
| ----------- | -------- | ------- | ---------------------- |
| `MAIL_HOST` | no       | `''`    | Health-check mail host |
| `MAIL_USER` | no       | `''`    | Health-check mail user |
| `MAIL_PORT` | no       | `0`     | Health-check mail port |

## Quick Start

```typescript
import { Module } from '@nestjs/common';
import { MailModule } from '@pixel-brewery/archipel-platform-mailing';
import { EmptyDeliveryStrategy } from '@pixel-brewery/archipel-platform-mailing/delivering/empty';
import { FileTemplateFetchStrategy } from '@pixel-brewery/archipel-platform-mailing/templating/file';

@Module({
    imports: [
        MailModule.register({
            deliveryStrategy: EmptyDeliveryStrategy,
            templateFetchStrategy: FileTemplateFetchStrategy,
        }),
    ],
})
export class AppModule {}
```

Delivery and template strategies are selected explicitly through `MailModule.register()`.

## Supported Providers

| Subpath                                                        | Class                      | SDK              |
| -------------------------------------------------------------- | -------------------------- | ---------------- |
| `@pixel-brewery/archipel-platform-mailing/delivering/empty`    | `EmptyDeliveryStrategy`    | —                |
| `@pixel-brewery/archipel-platform-mailing/delivering/smtp`     | `SmtpDeliveryStrategy`     | `nodemailer`     |
| `@pixel-brewery/archipel-platform-mailing/delivering/postmark` | `PostmarkDeliveryStrategy` | `postmark`       |
| `@pixel-brewery/archipel-platform-mailing/delivering/resend`   | `ResendDeliveryStrategy`   | `resend`         |
| `@pixel-brewery/archipel-platform-mailing/delivering/sendgrid` | `SendGridDeliveryStrategy` | `@sendgrid/mail` |
| `@pixel-brewery/archipel-platform-mailing/delivering/mailgun`  | `MailgunDeliveryStrategy`  | `mailgun.js`     |

The empty strategy logs the rendered message without sending it and requires no external SDK.

## Import Options

```typescript
// Main import (module, service)
import { MailModule, MailService } from '@pixel-brewery/archipel-platform-mailing';

// Built-in strategies
import { SmtpDeliveryStrategy } from '@pixel-brewery/archipel-platform-mailing/delivering/smtp';
import { EmptyDeliveryStrategy } from '@pixel-brewery/archipel-platform-mailing/delivering/empty';

// Provider-specific (tree-shakable sub-exports)
import { PostmarkDeliveryStrategy, POSTMARK_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-mailing/delivering/postmark';
import { ResendDeliveryStrategy } from '@pixel-brewery/archipel-platform-mailing/delivering/resend';
import { SendGridDeliveryStrategy } from '@pixel-brewery/archipel-platform-mailing/delivering/sendgrid';
import { MailgunDeliveryStrategy } from '@pixel-brewery/archipel-platform-mailing/delivering/mailgun';

// Health indicator (optional)
import { MailHealthIndicator } from '@pixel-brewery/archipel-platform-mailing/health';
```

## Error Handling

| Error Class         | Code            | When Thrown                         |
| ------------------- | --------------- | ----------------------------------- |
| `MailDeliveryError` | `MAIL_DELIVERY` | Provider SDK failure during sending |

## Lifecycle

- **Startup (`OnModuleInit`):** `MailTemplateEngine` preloads and compiles templates.
- **Shutdown (`OnModuleDestroy`):** `MailEventSubscriber` unsubscribes from event streams.

## Peer Dependencies

| Package                                          | Required | Notes                          |
| ------------------------------------------------ | -------- | ------------------------------ |
| `@pixel-brewery/archipel-platform-configuration` | Yes      | Typed config key support       |
| `@nestjs/common`                                 | Yes      | NestJS core                    |
| `nodemailer`                                     | No       | Required for SMTP strategy     |
| `postmark`                                       | No       | Required for Postmark provider |
| `resend`                                         | No       | Required for Resend provider   |
| `@sendgrid/mail`                                 | No       | Required for SendGrid provider |
| `mailgun.js`                                     | No       | Required for Mailgun provider  |
| `@pixel-brewery/archipel-platform-health`        | No       | Required for health indicator  |
| `@nestjs/terminus`                               | No       | Required for health indicator  |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-mailing/index.md`](../../.docs/packages/platform-mailing/index.md)

## Development

```bash
# Build
yarn nx build platform-mailing

# Test
yarn nx test platform-mailing

# Lint
yarn nx lint platform-mailing
```
