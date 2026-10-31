// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import type {
    EmbeddedApi,
    RequestDetailedFile,
    SignatureRequestApi,
    SignatureRequestResponse,
    SignatureRequestResponseSignatures,
    SubSignatureRequestSigner,
} from '@dropbox/sign';
import * as dropboxSign from '@dropbox/sign';
import { Injectable, Logger } from '@nestjs/common';
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
import type { ISigningRequest } from '../models/ISigningRequest.js';
import type { ISigningSession } from '../models/ISigningSession.js';
import { SignerStatuses, type SignerStatus } from '../models/SignerStatus.js';
import { SigningRequestStatuses, type SigningRequestStatus } from '../models/SigningRequestStatus.js';
import { WebhookEventTypes, type WebhookEventType } from '../models/WebhookEventType.js';
import { DROPBOX_SIGN_API_KEY, DROPBOX_SIGN_CLIENT_ID, DROPBOX_SIGN_WEBHOOK_SECRET } from './env.js';

// #endregion

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

/** @internal */
const PROVIDER_ID = 'dropbox-sign';

// ──────────────────────────────────────────────────────────────
// Webhook payload shape (SDK does not cover raw JSON parsing)
// ──────────────────────────────────────────────────────────────

/** @internal */
interface IDropboxWebhookPayload {
    readonly event: {
        readonly event_type: string;
        readonly event_time: string;
        readonly event_hash: string;
        readonly event_metadata: {
            readonly related_signature_id?: string;
            readonly reported_for_account_id?: string;
            readonly reported_for_app_id?: string;
        };
    };
    readonly signature_request?: {
        readonly signature_request_id: string;
    };
    readonly account_id?: string;
}

/**
 * Dropbox Sign (HelloSign) e-signing provider.
 * Integrates with the Dropbox Sign API v3 via the official
 * `@dropbox/sign` Node.js SDK.
 *
 * @public
 */
@Injectable()
export class DropboxSignEsigningProvider extends EsigningClientBase {
    // #region Fields

    private readonly _config: ConfigService;
    private readonly _logger: Logger = new Logger(DropboxSignEsigningProvider.name);
    private readonly _signatureRequestApi: SignatureRequestApi;
    private readonly _embeddedApi: EmbeddedApi;

    // #endregion

    // #region Ctor

    public constructor(config: ConfigService) {
        super();
        this._config = config;

        const apiKey = this._config.get<string>(DROPBOX_SIGN_API_KEY.key);

        this._signatureRequestApi = new dropboxSign.SignatureRequestApi();
        this._signatureRequestApi.setApiKey(apiKey);

        this._embeddedApi = new dropboxSign.EmbeddedApi();
        this._embeddedApi.setApiKey(apiKey);
    }

    // #endregion

    // #region Properties

    public get providerId(): string {
        return PROVIDER_ID;
    }

    // #endregion

    // #region Methods

    public async createSigningRequest(request: ICreateSigningRequest): Promise<ISigningRequest> {
        const clientId = this._config.get<string>(DROPBOX_SIGN_CLIENT_ID.key);

        const signers: Array<SubSignatureRequestSigner> = request.signers.map((signer) => {
            const sdkSigner = new dropboxSign.SubSignatureRequestSigner();
            sdkSigner.emailAddress = signer.email;
            sdkSigner.name = signer.name;
            sdkSigner.order = signer.order;

            return sdkSigner;
        });

        const files: Array<RequestDetailedFile> = request.documents.map((document) => ({
            value: Buffer.from(document.content),
            options: {
                filename: document.name,
                contentType: document.contentType,
            },
        }));

        const createRequest = new dropboxSign.SignatureRequestCreateEmbeddedRequest();
        createRequest.clientId = clientId;
        createRequest.title = request.subject;
        createRequest.subject = request.subject;
        createRequest.message = request.message;
        createRequest.signers = signers;
        createRequest.files = files;

        if (request.expiresInHours) {
            createRequest.expiresAt = Math.floor(Date.now() / 1000) + request.expiresInHours * 60 * 60;
        }

        try {
            const result = await this._signatureRequestApi.signatureRequestCreateEmbedded(createRequest);
            const signatureRequest = result.body.signatureRequest;

            return this.mapSignatureRequestToSigningRequest(signatureRequest, request.message);
        } catch (error: unknown) {
            this._logger.error('Failed to create signing request', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to create signing request.', error);
        }
    }

    public async createSigningSession(request: ICreateSigningSessionRequest): Promise<ISigningSession> {
        try {
            const getResult = await this._signatureRequestApi.signatureRequestGet(request.signingRequestId);
            const signatureRequest = getResult.body.signatureRequest;

            const signature = signatureRequest.signatures?.find((sig: SignatureRequestResponseSignatures) => sig.signatureId === request.signerId);

            if (!signature) {
                throw new SigningRequestNotFoundError(request.signingRequestId);
            }

            const embeddedResult = await this._embeddedApi.embeddedSignUrl(request.signerId);
            const embedded = embeddedResult.body.embedded;

            return {
                sessionId: `${request.signingRequestId}:${request.signerId}`,
                signingRequestId: request.signingRequestId,
                signerId: request.signerId,
                signingUrl: embedded.signUrl!,
                expiresAt: new Date(embedded.expiresAt! * 1000),
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
        try {
            const result = await this._signatureRequestApi.signatureRequestGet(signingRequestId);
            const signatureRequest = result.body.signatureRequest;

            return this.mapSignatureRequestToSigningRequest(signatureRequest);
        } catch (error: unknown) {
            this._logger.error('Failed to get signing request', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to get signing request.', error);
        }
    }

    public async getSignedDocuments(signingRequestId: string): Promise<Array<ISignedDocument>> {
        try {
            const result = await this._signatureRequestApi.signatureRequestFiles(signingRequestId, 'pdf');
            const content = Buffer.isBuffer(result.body) ? result.body : Buffer.from(result.body as unknown as ArrayBuffer);

            return [
                {
                    documentId: `${signingRequestId}-combined`,
                    signingRequestId,
                    name: 'signed-documents.pdf',
                    contentType: 'application/pdf',
                    content,
                    sizeInBytes: content.length,
                },
            ];
        } catch (error: unknown) {
            this._logger.error('Failed to get signed documents', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to get signed documents.', error);
        }
    }

    public async cancelSigningRequest(signingRequestId: string, _reason?: string): Promise<void> {
        try {
            await this._signatureRequestApi.signatureRequestCancel(signingRequestId);
        } catch (error: unknown) {
            this._logger.error('Failed to cancel signing request', error);
            throw new SigningProviderError(PROVIDER_ID, 'Failed to cancel signing request.', error);
        }
    }

    public async verifyWebhook(payload: string | Buffer, _signature: string, _headers?: Record<string, string>): Promise<IEsigningWebhookEvent> {
        const payloadString = typeof payload === 'string' ? payload : payload.toString('utf-8');
        const body: IDropboxWebhookPayload = JSON.parse(payloadString);

        const webhookSecret = this._config.tryGet<string>(DROPBOX_SIGN_WEBHOOK_SECRET.key, '');

        if (webhookSecret) {
            const apiKey = this._config.get<string>(DROPBOX_SIGN_API_KEY.key);
            const expectedHash = createHmac('sha256', apiKey).update(`${body.event.event_time}${body.event.event_type}`).digest('hex');

            const actualHash = body.event.event_hash;

            if (expectedHash.length !== actualHash.length || !timingSafeEqual(Buffer.from(expectedHash), Buffer.from(actualHash))) {
                throw new WebhookVerificationError('Dropbox Sign webhook hash mismatch.');
            }
        }

        const signingRequestId = body.signature_request?.signature_request_id ?? '';

        return {
            eventId: `${body.event.event_type}-${body.event.event_time}`,
            eventType: this.mapDropboxEventToWebhookType(body.event.event_type),
            signingRequestId,
            signerId: body.event.event_metadata.related_signature_id,
            occurredAt: new Date(body.event.event_time),
            rawPayload: body,
        };
    }

    // ──────────────────────────────────────────────────────────────
    // Private helpers
    // ──────────────────────────────────────────────────────────────

    private mapSignatureRequestToSigningRequest(signatureRequest: SignatureRequestResponse, message?: string): ISigningRequest {
        const signers: Array<ISigner> = (signatureRequest.signatures ?? []).map((sig: SignatureRequestResponseSignatures) => ({
            signerId: sig.signatureId!,
            email: sig.signerEmailAddress!,
            name: sig.signerName!,
            role: sig.signerRole === 'cc' ? 'carbon-copy' : 'signer',
            status: this.mapDropboxSignerStatusToSignerStatus(sig.statusCode!),
            order: sig.order!,
        }));

        const documents: Array<ISigningDocument> = [
            {
                documentId: `${signatureRequest.signatureRequestId}-doc`,
                name: signatureRequest.title!,
                contentType: 'application/pdf',
                order: 1,
            },
        ];

        const createdAt = new Date((signatureRequest.createdAt ?? 0) * 1000);
        const expiresAt = signatureRequest.expiresAt ? new Date(signatureRequest.expiresAt * 1000) : undefined;

        let status: SigningRequestStatus;

        if (signatureRequest.isDeclined) {
            status = SigningRequestStatuses.Declined;
        } else if (signatureRequest.isComplete) {
            status = SigningRequestStatuses.Completed;
        } else if (signatureRequest.hasError) {
            status = SigningRequestStatuses.Voided;
        } else {
            status = SigningRequestStatuses.Sent;
        }

        return {
            signingRequestId: signatureRequest.signatureRequestId!,
            status,
            subject: signatureRequest.title!,
            message: message ?? signatureRequest.message ?? undefined,
            signers,
            documents,
            fields: [],
            createdAt,
            updatedAt: createdAt,
            expiresAt,
            providerMetadata: { provider: PROVIDER_ID, signatureRequestId: signatureRequest.signatureRequestId! },
        };
    }

    private mapDropboxSignerStatusToSignerStatus(statusCode: string): SignerStatus {
        switch (statusCode) {
            case 'awaiting_signature':
                return SignerStatuses.Delivered;
            case 'signed':
                return SignerStatuses.Signed;
            case 'declined':
                return SignerStatuses.Declined;
            default:
                return SignerStatuses.Pending;
        }
    }

    private mapDropboxEventToWebhookType(eventType: string): WebhookEventType {
        switch (eventType) {
            case 'signature_request_all_signed':
                return WebhookEventTypes.SigningRequestCompleted;
            case 'signature_request_declined':
                return WebhookEventTypes.SigningRequestDeclined;
            case 'signature_request_canceled':
                return WebhookEventTypes.SigningRequestVoided;
            case 'signature_request_expired':
                return WebhookEventTypes.SigningRequestExpired;
            case 'signature_request_sent':
                return WebhookEventTypes.SigningRequestSent;
            case 'signature_request_signed':
                return WebhookEventTypes.SignerCompleted;
            case 'signature_request_viewed':
                return WebhookEventTypes.SignerDelivered;
            default:
                return WebhookEventTypes.SigningRequestSent;
        }
    }

    // #endregion
}
