# @pixel-brewery/archipel-platform-esigning

Provider-agnostic e-signing infrastructure for NestJS applications.

## Features

- **Multi-provider** — DocuSign, Adobe Sign, Dropbox Sign, and built-in internal provider
- **abstract bases and adapters pattern** — Swap providers via `EsigningClientBase` without changing consumer code
- **Normalized models** — Signing requests, signers, documents, fields, and webhook events
- **Webhook verification** — `verifyWebhook()` with timestamp/nonce validation support
- **Persistence abstract base** — Optional state tracking via `EsigningPersistenceBase`
- **Dynamic module** — `EsigningModule.register()` with configurable provider selection
- **Health checks** — `EsigningHealthIndicator` for readiness probes (separate `/health` subpath)

## ⚠️ Environment Variables

Choose one provider and configure its required variables.

### DocuSign

| Variable                    | Required | Default | Description                                          |
| --------------------------- | -------- | ------- | ---------------------------------------------------- |
| `DOCUSIGN_INTEGRATION_KEY`  | yes      | -       | DocuSign integration key (client ID)                 |
| `DOCUSIGN_SECRET_KEY`       | yes      | -       | DocuSign secret key (client secret)                  |
| `DOCUSIGN_ACCOUNT_ID`       | yes      | -       | DocuSign account ID                                  |
| `DOCUSIGN_BASE_URL`         | yes      | -       | DocuSign base URL (e.g. `https://demo.docusign.net`) |
| `DOCUSIGN_WEBHOOK_HMAC_KEY` | no       | -       | DocuSign webhook HMAC key                            |

### Adobe Sign

| Variable                       | Required | Default | Description                                   |
| ------------------------------ | -------- | ------- | --------------------------------------------- |
| `ADOBE_SIGN_INTEGRATION_KEY`   | yes      | -       | Adobe Sign integration key                    |
| `ADOBE_SIGN_CLIENT_SECRET`     | yes      | -       | Adobe Sign client secret                      |
| `ADOBE_SIGN_BASE_URL`          | yes      | -       | Adobe Sign base URL                           |
| `ADOBE_SIGN_WEBHOOK_CLIENT_ID` | yes      | -       | Adobe Sign webhook client ID for verification |

### Dropbox Sign

| Variable                      | Required | Default | Description                 |
| ----------------------------- | -------- | ------- | --------------------------- |
| `DROPBOX_SIGN_API_KEY`        | yes      | -       | Dropbox Sign API key        |
| `DROPBOX_SIGN_CLIENT_ID`      | yes      | -       | Dropbox Sign client ID      |
| `DROPBOX_SIGN_WEBHOOK_SECRET` | no       | -       | Dropbox Sign webhook secret |

## Quick Start

```typescript
import { EsigningModule } from '@pixel-brewery/archipel-platform-esigning';
import { InternalEsigningProvider } from '@pixel-brewery/archipel-platform-esigning';

@Module({
    imports: [
        EsigningModule.register({
            provider: InternalEsigningProvider,
            isGlobal: true,
        }),
    ],
})
export class AppModule {}
```

## Import Options

```typescript
// Main import (module, abstract bases, models)
import { EsigningModule, EsigningClientBase, EsigningService } from '@pixel-brewery/archipel-platform-esigning';
import { InternalEsigningProvider } from '@pixel-brewery/archipel-platform-esigning/internal';

// Provider-specific (tree-shakable sub-exports)
import { DocusignClient, DOCUSIGN_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-esigning/docusign';
import { AdobeSignClient, ADOBE_SIGN_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-esigning/adobe-sign';
import { DropboxSignClient, DROPBOX_SIGN_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-esigning/dropbox-sign';

// Health indicator (optional)
import { EsigningHealthIndicator } from '@pixel-brewery/archipel-platform-esigning/health';
```

## Abstract Bases

| Abstract Base             | Required | Description                             |
| ------------------------- | -------- | --------------------------------------- |
| `EsigningClientBase`      | Yes      | E-signing provider client contract      |
| `EsigningPersistenceBase` | No       | Optional signing request state tracking |

## Error Handling

| Error Class                   | Code                        | When Thrown                         |
| ----------------------------- | --------------------------- | ----------------------------------- |
| `EsigningError`               | `ESIGNING`                  | General e-signing operation failure |
| `SigningRequestNotFoundError` | `SIGNING_REQUEST_NOT_FOUND` | Signing request not found           |
| `SigningProviderError`        | `SIGNING_PROVIDER`          | Provider SDK failure                |
| `WebhookVerificationError`    | `WEBHOOK_VERIFICATION`      | Webhook signature validation failed |

## Resource Limits

| Limit                          | Value     | Description                                               |
| ------------------------------ | --------- | --------------------------------------------------------- |
| Internal provider max requests | 10,000    | `InternalEsigningProvider` max in-memory signing requests |
| Adobe Sign HTTP timeout        | 3 seconds | `AdobeSignClient` aborts requests after 3s                |
| Adobe Sign max retries         | 2         | Failed calls retried up to 2 times                        |

## Peer Dependencies

| Package                                          | Required | Notes                          |
| ------------------------------------------------ | -------- | ------------------------------ |
| `@pixel-brewery/archipel-platform-configuration` | Yes      | Typed config key support       |
| `@nestjs/common`                                 | Yes      | NestJS core                    |
| `docusign-esign`                                 | No       | Required for DocuSign provider |
| `@dropbox/sign`                                  | No       | Required for Dropbox Sign      |
| `@pixel-brewery/archipel-platform-health`        | No       | Required for health indicator  |
| `@nestjs/terminus`                               | No       | Required for health indicator  |

## Documentation

📖 **E-Signing Guide:** [`.docs/guides/esigning-integration.md`](../../.docs/guides/esigning-integration.md)

## Development

```bash
# Build
yarn nx build platform-esigning

# Test
yarn nx test platform-esigning

# Lint
yarn nx lint platform-esigning
```
