---
title: E-Signing Integration
description: Integrate electronic signature workflows with DocuSign, Adobe Sign, Dropbox Sign, or an internal provider.
order: 12
---

# E-Signing Integration

This guide covers electronic signature workflows with `platform-esigning`: provider setup, creating signing requests, tracking signer status, and handling webhook notifications.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-esigning
```

---

## Choose a Provider

`platform-esigning` abstracts e-signing operations behind a `EsigningClientBase`. Supported providers:

| Provider         | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| **DocuSign**     | Industry-standard e-signature platform                      |
| **Adobe Sign**   | Adobe Acrobat Sign integration                              |
| **Dropbox Sign** | Dropbox (formerly HelloSign) integration                    |
| **Internal**     | Custom/self-managed signing (max 10,000 in-memory requests) |

---

## Module Registration

```typescript
import { Module } from '@nestjs/common';
import { EsigningModule } from '@pixel-brewery/archipel-platform-esigning';
import { DocuSignClient } from './adapters/DocuSignClient.js';
import { PrismaSigningRequestAdapter } from './adapters/PrismaSigningRequestAdapter.js';
import { DOCUSIGN_CONFIG_ENTRIES } from './env.js';

@Module({
    imports: [
        EsigningModule.register({
            provider: DocuSignClient,
            persistence: PrismaSigningRequestAdapter,
            configEntries: [...DOCUSIGN_CONFIG_ENTRIES],
        }),
    ],
})
export class AppModule {}
```

---

## Configuration

Each provider requires its own set of environment variables. See the [platform-esigning API reference](/packages/platform-esigning/api/) for the complete exported configuration surface.

### Provider Environment Variables (Summary)

| Provider         | Key Variables                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **DocuSign**     | `DOCUSIGN_INTEGRATION_KEY`, `DOCUSIGN_SECRET_KEY`, `DOCUSIGN_ACCOUNT_ID`, `DOCUSIGN_BASE_URL`                              |
| **Adobe Sign**   | `ADOBE_SIGN_INTEGRATION_KEY`, `ADOBE_SIGN_CLIENT_SECRET`, `ADOBE_SIGN_BASE_URL`, `ADOBE_SIGN_WEBHOOK_CLIENT_ID` (required) |
| **Dropbox Sign** | `DROPBOX_SIGN_API_KEY`, `DROPBOX_SIGN_CLIENT_ID`                                                                           |

> **Breaking change:** `ADOBE_SIGN_WEBHOOK_CLIENT_ID` is now **required** for Adobe Sign webhook verification.

---

## Webhook Verification

`EsigningService.verifyWebhook()` validates webhook payloads and normalizes the event. It accepts an optional `headers` parameter for providers that require timestamp or nonce validation:

```typescript
const event = await esigningService.verifyWebhook(
    request.rawBody, // Raw request body
    signatureHeader, // Signature header value
    request.headers, // Optional: full headers for timestamp/nonce validation
);
```

When persistence is configured, the service automatically updates the signing request status in your database.

---

## Implementing the Client Abstract Base

```typescript
import { Injectable } from '@nestjs/common';
import { EsigningClientBase, type ISigningRequest, type ISigningSession, type ISignedDocument } from '@pixel-brewery/archipel-platform-esigning';

@Injectable()
export class DocuSignClient extends EsigningClientBase {
    public async createSigningSession(request: ISigningRequest): Promise<ISigningSession> {
        // Call DocuSign API to create an envelope
        // Return normalized signing session with redirect URLs
    }

    public async getSigningStatus(sessionId: string): Promise<ISigningSession> {
        // Fetch signing status from DocuSign
    }

    public async downloadSignedDocument(sessionId: string): Promise<ISignedDocument> {
        // Download the completed document from DocuSign
    }

    public async cancelSigningSession(sessionId: string): Promise<void> {
        // Void the envelope in DocuSign
    }
}
```

---

## Implementing the Persistence Abstract Base

Track signing request state in your database:

```typescript
import { Injectable } from '@nestjs/common';
import { EsigningPersistenceBase, type ISigningRequest } from '@pixel-brewery/archipel-platform-esigning';
import { PrismaService } from '@pixel-brewery/archipel-platform-database';

@Injectable()
export class PrismaSigningRequestAdapter extends EsigningPersistenceBase {
    private readonly _prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this._prisma = prisma;
    }

    public async save(request: ISigningRequest): Promise<void> {
        await this._prisma.signingRequest.upsert({
            where: { id: request.id },
            create: {
                id: request.id,
                userId: request.userId,
                documentId: request.documentId,
                status: request.status,
                providerSessionId: request.providerSessionId,
            },
            update: {
                status: request.status,
                providerSessionId: request.providerSessionId,
            },
        });
    }

    public async findById(id: string): Promise<ISigningRequest | null> {
        return this._prisma.signingRequest.findUnique({ where: { id } });
    }

    public async findByUserId(userId: string): Promise<ReadonlyArray<ISigningRequest>> {
        return this._prisma.signingRequest.findMany({ where: { userId } });
    }
}
```

---

## Creating a Signing Request

Use `EsigningService` to orchestrate the signing workflow:

```typescript
import { Injectable } from '@nestjs/common';
import { EsigningService } from '@pixel-brewery/archipel-platform-esigning';

@Injectable()
export class ContractService {
    private readonly _esigningService: EsigningService;

    constructor(esigningService: EsigningService) {
        this._esigningService = esigningService;
    }

    public async sendForSigning(userId: string, documentUrl: string, signerEmail: string): Promise<string> {
        const session = await this._esigningService.createSession({
            userId,
            documentUrl,
            signers: [
                {
                    email: signerEmail,
                    name: 'Signer',
                    order: 1,
                },
            ],
            callbackUrl: 'https://yourapp.com/webhooks/esigning',
        });

        return session.signingUrl; // Redirect the user to this URL
    }
}
```

---

## Handling Webhooks

E-signing providers send webhook events when documents are signed, declined, or expired:

```typescript
import { Controller, Post, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { EsigningService } from '@pixel-brewery/archipel-platform-esigning';
import { Request } from 'express';

@Controller('webhooks/esigning')
export class EsigningWebhookController {
    private readonly _esigningService: EsigningService;

    constructor(esigningService: EsigningService) {
        this._esigningService = esigningService;
    }

    @Post()
    public async handleWebhook(@Req() request: RawBodyRequest<Request>, @Headers('x-webhook-signature') signature: string): Promise<void> {
        await this._esigningService.handleWebhook(request.rawBody!, signature);
        // The service verifies the signature, updates the signing request status,
        // and emits domain events for your application to react to.
    }
}
```

---

## Best Practices

1. **Always verify webhook signatures.** Never trust webhook payloads without signature validation.
2. **Use the persistence abstract base.** Track signing request state to handle retries, status queries, and auditing.
3. **Implement idempotent webhook handlers.** Providers may deliver the same event multiple times.
4. **Store signed documents.** Use `platform-blob-storage` to archive completed signed documents.
5. **Handle expiration.** Set up a scheduled job to check for expired signing sessions and notify users.

---

## Next Steps

- See the [Document Generation](/guides/document-generation) guide for creating documents to send for signing
- See the [Blob Storage](/guides/blob-storage) guide for storing signed documents
- Browse the [platform-esigning API reference](/packages/platform-esigning/api/) for complete method signatures
