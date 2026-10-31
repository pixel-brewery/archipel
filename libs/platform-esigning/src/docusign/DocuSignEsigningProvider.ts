// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import docusign from 'docusign-esign';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { EsigningClientBase } from '../abstracts/EsigningClientBase.js';
import { SigningProviderError } from '../errors/SigningProviderError.js';
import { SigningRequestNotFoundError } from '../errors/SigningRequestNotFoundError.js';
import { WebhookVerificationError } from '../errors/WebhookVerificationError.js';
import type { ICreateSigningRequest } from '../models/ICreateSigningRequest.js';
import type { ICreateSigningSessionRequest } from '../models/ICreateSigningSessionRequest.js';
import type { IEsigningWebhookEvent } from '../models/IEsigningWebhookEvent.js';
import type { ISignedDocument } from '../models/ISignedDocument.js';
import type { ISigner } from '../models/ISigner.js';
import type { ISigningDocument } from '../models/ISigningDocument.js';
import type { ISigningField } from '../models/ISigningField.js';
import type { ISigningRequest } from '../models/ISigningRequest.js';
import type { ISigningSession } from '../models/ISigningSession.js';
import { SignerStatuses, type SignerStatus } from '../models/SignerStatus.js';
import { SigningRequestStatuses, type SigningRequestStatus } from '../models/SigningRequestStatus.js';
import { WebhookEventTypes, type WebhookEventType } from '../models/WebhookEventType.js';
import { DOCUSIGN_ACCOUNT_ID, DOCUSIGN_BASE_URL, DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_WEBHOOK_HMAC_KEY } from './env.js';

// #endregion

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

/** @internal */
const PROVIDER_ID = 'docusign';

// ──────────────────────────────────────────────────────────────
// DocuSign SDK runtime type
// ──────────────────────────────────────────────────────────────

/**
 * The `@types/docusign-esign` package declares every model as an
 * `interface`, but the real SDK exports them as constructable classes.
 * This bridge type lets us call `new sdk.Envelope()` etc. without
 * suppressing the compiler with `any`.
 *
 * @internal
 */
interface IDocuSignSdkRuntime extends Omit<typeof docusign, never> {
    Document: new () => docusign.Document;
    Signer: new () => docusign.Signer;
    CarbonCopy: new () => docusign.CarbonCopy;
    Recipients: new () => docusign.Recipients;
    EnvelopeDefinition: new () => docusign.EnvelopeDefinition;
    Notification: new () => docusign.Notification;
    Expirations: new () => docusign.Expirations;
    Envelope: new () => docusign.Envelope;
    RecipientViewRequest: new () => docusign.RecipientViewRequest;
    SignHere: new () => docusign.SignHere;
    Text: new () => docusign.Text;
    Tabs: new () => docusign.Tabs;
}

// ──────────────────────────────────────────────────────────────
// Webhook payload shape (SDK does not cover webhooks)
// ──────────────────────────────────────────────────────────────

/** @internal */
interface IDocuSignWebhookPayload {
    readonly event: string;
    readonly apiVersion: string;
    readonly uri: string;
    readonly retryCount: number;
    readonly configurationId: string;
    readonly generatedDateTime: string;
    readonly data: {
        readonly accountId: string;
        readonly envelopeId: string;
        readonly recipientId?: string;
        readonly userId?: string;
        readonly envelopeSummary?: {
            readonly status: string;
            readonly emailSubject: string;
        };
    };
}

/**
 * DocuSign eSignature provider.
 * Integrates with the DocuSign eSignature REST API v2.1 via the official
 * `docusign-esign` Node.js SDK.
 *
 * @public
 */
@Injectable()
export class DocuSignEsigningProvider extends EsigningClientBase {
    // #region Fields

    private readonly _config: ConfigService;
    private readonly _logger: Logger = new Logger(DocuSignEsigningProvider.name);
    private readonly _apiClient: docusign.ApiClient;
    private readonly _envelopesApi: docusign.EnvelopesApi;

    // #endregion

    // #region Ctor

    public constructor(config: ConfigService) {
        super();
        this._config = config;

        const ds = this.getSdk();
        const baseUrl = this._config.get<string>(DOCUSIGN_BASE_URL.key);
        const accessToken = this._config.get<string>(DOCUSIGN_INTEGRATION_KEY.key);

        this._apiClient = new ds.ApiClient();
        this._apiClient.setBasePath(`${baseUrl}/restapi`);
        this._apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
        this._envelopesApi = new ds.EnvelopesApi(this._apiClient);
    }

    // #endregion

    // #region Properties

    public get providerId(): string {
        return PROVIDER_ID;
    }

    // #endregion

    // #region Methods

    public async createSigningRequest(request: ICreateSigningRequest): Promise<ISigningRequest> {
        const accountId = this._config.get<string>(DOCUSIGN_ACCOUNT_ID.key);
        const ds = this.getSdk();

        const documents = request.documents.map((document, index) => {
            const doc = new ds.Document();
            doc.documentBase64 = document.content.toString('base64');
            doc.name = document.name;
            doc.fileExtension = this.extractExtension(document.contentType);
            doc.documentId = String(index + 1);
            doc.order = String(document.order);

            return doc;
        });

        const signers = request.signers
            .filter((signer) => signer.role === 'signer' || signer.role === 'in-person-signer' || signer.role === 'witness')
            .map((signer, index) => {
                const recipient = new ds.Signer();
                recipient.email = signer.email;
                recipient.name = signer.name;
                recipient.recipientId = String(index + 1);
                recipient.routingOrder = String(signer.order);
                recipient.tabs = this.buildTabsForSigner(ds, String(index + 1), request.fields ?? [], documents);

                return recipient;
            });

        const carbonCopies = request.signers
            .filter((signer) => signer.role === 'carbon-copy')
            .map((signer, index) => {
                const cc = new ds.CarbonCopy();
                cc.email = signer.email;
                cc.name = signer.name;
                cc.recipientId = String(signers.length + index + 1);
                cc.routingOrder = String(signer.order);

                return cc;
            });

        const recipients = new ds.Recipients();
        recipients.signers = signers;
        recipients.carbonCopies = carbonCopies;

        const envelopeDefinition = new ds.EnvelopeDefinition();
        envelopeDefinition.emailSubject = request.subject;
        envelopeDefinition.emailBlurb = request.message;
        envelopeDefinition.documents = documents;
        envelopeDefinition.recipients = recipients;
        envelopeDefinition.status = 'sent';

        if (request.expiresInHours) {
            const notification = new ds.Notification();
            const expirations = new ds.Expirations();
            expirations.expireEnabled = 'true';
            expirations.expireAfter = String(Math.ceil(request.expiresInHours / 24));
            notification.expirations = expirations;
            envelopeDefinition.notification = notification;
        }

        try {
            const createResult = await this._envelopesApi.createEnvelope(accountId, { envelopeDefinition });
            const envelope = await this._envelopesApi.getEnvelope(accountId, createResult.envelopeId!, {
                include: 'recipients,documents',
            });

            return this.mapEnvelopeToSigningRequest(envelope);
        } catch (error: unknown) {
            this._logger.error('Failed to create signing request', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to create signing request.', error);
        }
    }

    public async createSigningSession(request: ICreateSigningSessionRequest): Promise<ISigningSession> {
        const accountId = this._config.get<string>(DOCUSIGN_ACCOUNT_ID.key);
        const ds = this.getSdk();

        try {
            const envelope = await this._envelopesApi.getEnvelope(accountId, request.signingRequestId, {
                include: 'recipients',
            });

            const recipient = this.findRecipientById(envelope.recipients, request.signerId);

            if (!recipient) {
                throw new SigningRequestNotFoundError(request.signingRequestId);
            }

            const viewRequest = new ds.RecipientViewRequest();
            viewRequest.authenticationMethod = 'none';
            viewRequest.email = recipient.email;
            viewRequest.userName = recipient.name;
            viewRequest.clientUserId = recipient.recipientId;
            viewRequest.returnUrl = request.returnUrl ?? 'https://localhost/signing-complete';

            const viewResult = await this._envelopesApi.createRecipientView(accountId, request.signingRequestId, {
                recipientViewRequest: viewRequest,
            });

            return {
                sessionId: `${request.signingRequestId}:${request.signerId}`,
                signingRequestId: request.signingRequestId,
                signerId: request.signerId,
                signingUrl: viewResult.url!,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            };
        } catch (error: unknown) {
            if (error instanceof SigningRequestNotFoundError) {
                throw error;
            }
            this._logger.error('Failed to create signing session', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to create signing session.', error);
        }
    }

    public async getSigningRequest(signingRequestId: string): Promise<ISigningRequest> {
        const accountId = this._config.get<string>(DOCUSIGN_ACCOUNT_ID.key);

        try {
            const envelope = await this._envelopesApi.getEnvelope(accountId, signingRequestId, {
                include: 'recipients,documents',
            });

            return this.mapEnvelopeToSigningRequest(envelope);
        } catch (error: unknown) {
            this._logger.error('Failed to get signing request', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to get signing request.', error);
        }
    }

    public async getSignedDocuments(signingRequestId: string): Promise<Array<ISignedDocument>> {
        const accountId = this._config.get<string>(DOCUSIGN_ACCOUNT_ID.key);

        try {
            const docsListResponse = await this._envelopesApi.listDocuments(accountId, signingRequestId);
            const signedDocuments: Array<ISignedDocument> = [];

            for (const doc of docsListResponse.envelopeDocuments ?? []) {
                if (doc.type === 'content') {
                    const content = await this.downloadDocument(accountId, signingRequestId, doc.documentId!);

                    signedDocuments.push({
                        documentId: doc.documentId!,
                        signingRequestId,
                        name: doc.name!,
                        contentType: 'application/pdf',
                        content,
                        sizeInBytes: content.length,
                    });
                }
            }

            return signedDocuments;
        } catch (error: unknown) {
            this._logger.error('Failed to get signed documents', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to get signed documents.', error);
        }
    }

    public async cancelSigningRequest(signingRequestId: string, reason?: string): Promise<void> {
        const accountId = this._config.get<string>(DOCUSIGN_ACCOUNT_ID.key);
        const ds = this.getSdk();

        try {
            const envelope = new ds.Envelope();
            envelope.status = 'voided';
            envelope.voidedReason = reason ?? 'Cancelled via API.';

            await this._envelopesApi.update(accountId, signingRequestId, { envelope });
        } catch (error: unknown) {
            this._logger.error('Failed to cancel signing request', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to cancel signing request.', error);
        }
    }

    public async verifyWebhook(payload: string | Buffer, signature: string, _headers?: Record<string, string>): Promise<IEsigningWebhookEvent> {
        const hmacKey = this._config.tryGet<string>(DOCUSIGN_WEBHOOK_HMAC_KEY.key, '');

        if (hmacKey) {
            const payloadString = typeof payload === 'string' ? payload : payload.toString('utf-8');
            const computedSignature = createHmac('sha256', hmacKey).update(payloadString).digest('base64');
            const signatureBuffer = Buffer.from(signature, 'base64');
            const computedBuffer = Buffer.from(computedSignature, 'base64');

            if (signatureBuffer.length !== computedBuffer.length || !timingSafeEqual(signatureBuffer, computedBuffer)) {
                throw new WebhookVerificationError('DocuSign webhook HMAC signature mismatch.');
            }
        }

        const body: IDocuSignWebhookPayload = JSON.parse(typeof payload === 'string' ? payload : payload.toString('utf-8'));

        return {
            eventId: body.configurationId,
            eventType: this.mapDocuSignEventToWebhookType(body.event),
            signingRequestId: body.data.envelopeId,
            signerId: body.data.recipientId,
            occurredAt: new Date(body.generatedDateTime),
            rawPayload: body,
        };
    }

    // ──────────────────────────────────────────────────────────────
    // Private helpers
    // ──────────────────────────────────────────────────────────────

    private getSdk(): IDocuSignSdkRuntime {
        return docusign as IDocuSignSdkRuntime;
    }

    private async downloadDocument(accountId: string, envelopeId: string, documentId: string): Promise<Buffer> {
        const document = await this._envelopesApi.getDocument(accountId, envelopeId, documentId, {});

        return Buffer.isBuffer(document) ? document : Buffer.from(document as unknown as ArrayBuffer);
    }

    private mapEnvelopeToSigningRequest(envelope: docusign.Envelope): ISigningRequest {
        const signers: Array<ISigner> = [];

        for (const recipient of (envelope.recipients as docusign.Recipients)?.signers ?? []) {
            signers.push({
                signerId: recipient.recipientId!,
                email: recipient.email!,
                name: recipient.name!,
                role: 'signer',
                status: this.mapDocuSignRecipientStatusToSignerStatus(recipient.status!),
                order: Number(recipient.routingOrder),
            });
        }

        for (const cc of (envelope.recipients as docusign.Recipients)?.carbonCopies ?? []) {
            signers.push({
                signerId: cc.recipientId!,
                email: cc.email!,
                name: cc.name!,
                role: 'carbon-copy',
                status: this.mapDocuSignRecipientStatusToSignerStatus(cc.status!),
                order: Number(cc.routingOrder),
            });
        }

        const envelopeDocuments = ((envelope as Record<string, unknown>)['envelopeDocuments'] as Array<Record<string, unknown>>) ?? [];
        const documents: Array<ISigningDocument> = envelopeDocuments.map((doc, index) => ({
            documentId: String(doc['documentId']),
            name: String(doc['name']),
            contentType: 'application/pdf',
            pageCount: (doc['pages'] as Array<unknown>)?.length,
            order: Number(doc['order']) || index + 1,
        }));

        return {
            signingRequestId: envelope.envelopeId!,
            status: this.mapDocuSignStatusToRequestStatus(envelope.status!),
            subject: envelope.emailSubject!,
            message: (envelope as Record<string, unknown>)['emailBlurb'] as string | undefined,
            signers,
            documents,
            fields: [],
            createdAt: new Date(envelope.createdDateTime!),
            updatedAt: new Date(envelope.lastModifiedDateTime!),
            expiresAt: (envelope as Record<string, unknown>)['expireDateTime']
                ? new Date((envelope as Record<string, unknown>)['expireDateTime'] as string)
                : undefined,
            providerMetadata: { provider: PROVIDER_ID, envelopeId: envelope.envelopeId! },
        };
    }

    private mapDocuSignStatusToRequestStatus(status: string): SigningRequestStatus {
        switch (status) {
            case 'created':
                return SigningRequestStatuses.Draft;
            case 'sent':
            case 'delivered':
                return SigningRequestStatuses.Sent;
            case 'completed':
                return SigningRequestStatuses.Completed;
            case 'declined':
                return SigningRequestStatuses.Declined;
            case 'voided':
                return SigningRequestStatuses.Voided;
            default:
                return SigningRequestStatuses.InProgress;
        }
    }

    private mapDocuSignRecipientStatusToSignerStatus(status: string): SignerStatus {
        switch (status) {
            case 'created':
                return SignerStatuses.Pending;
            case 'sent':
                return SignerStatuses.Sent;
            case 'delivered':
                return SignerStatuses.Delivered;
            case 'completed':
            case 'signed':
                return SignerStatuses.Signed;
            case 'declined':
                return SignerStatuses.Declined;
            default:
                return SignerStatuses.Pending;
        }
    }

    private mapDocuSignEventToWebhookType(event: string): WebhookEventType {
        switch (event) {
            case 'envelope-completed':
                return WebhookEventTypes.SigningRequestCompleted;
            case 'envelope-declined':
                return WebhookEventTypes.SigningRequestDeclined;
            case 'envelope-voided':
                return WebhookEventTypes.SigningRequestVoided;
            case 'envelope-sent':
                return WebhookEventTypes.SigningRequestSent;
            case 'recipient-completed':
                return WebhookEventTypes.SignerCompleted;
            case 'recipient-declined':
                return WebhookEventTypes.SignerDeclined;
            case 'recipient-sent':
                return WebhookEventTypes.SignerSent;
            case 'recipient-delivered':
                return WebhookEventTypes.SignerDelivered;
            default:
                return WebhookEventTypes.SigningRequestSent;
        }
    }

    private findRecipientById(recipients: docusign.Recipients | undefined, signerId: string): docusign.Signer | docusign.CarbonCopy | undefined {
        const allRecipients = [...(recipients?.signers ?? []), ...(recipients?.carbonCopies ?? [])];

        return allRecipients.find((recipient) => recipient.recipientId === signerId);
    }

    private buildTabsForSigner(
        ds: IDocuSignSdkRuntime,
        recipientId: string,
        fields: ReadonlyArray<Omit<ISigningField, 'fieldId' | 'value'>>,
        documents: ReadonlyArray<docusign.Document>,
    ): docusign.Tabs {
        const signHereTabs: Array<docusign.SignHere> = [];
        const textTabs: Array<docusign.Text> = [];

        for (const field of fields) {
            if (field.signerId !== recipientId) {
                continue;
            }

            const docIndex = Number(field.documentId) - 1;
            const documentId = documents[docIndex]?.documentId ?? field.documentId;

            if (field.type === 'signature' || field.type === 'initials') {
                const tab = new ds.SignHere();
                tab.documentId = documentId;
                tab.pageNumber = String(field.pageNumber);
                tab.xPosition = String(Math.round(field.positionX));
                tab.yPosition = String(Math.round(field.positionY));
                tab.tabLabel = `field-${recipientId}-${field.type}`;
                signHereTabs.push(tab);
            } else {
                const tab = new ds.Text();
                tab.documentId = documentId;
                tab.pageNumber = String(field.pageNumber);
                tab.xPosition = String(Math.round(field.positionX));
                tab.yPosition = String(Math.round(field.positionY));
                tab.tabLabel = `field-${recipientId}-${field.type}`;
                tab.required = field.required ? 'true' : 'false';
                tab.width = String(field.width);
                tab.height = String(field.height);
                textTabs.push(tab);
            }
        }

        const tabs = new ds.Tabs();
        tabs.signHereTabs = signHereTabs;
        tabs.textTabs = textTabs;

        return tabs;
    }

    private extractExtension(contentType: string): string {
        switch (contentType) {
            case 'application/pdf':
                return 'pdf';
            case 'application/msword':
                return 'doc';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'docx';
            default:
                return 'pdf';
        }
    }

    // #endregion
}
