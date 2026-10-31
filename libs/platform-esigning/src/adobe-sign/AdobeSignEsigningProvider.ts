// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
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
import { ADOBE_SIGN_BASE_URL, ADOBE_SIGN_INTEGRATION_KEY, ADOBE_SIGN_WEBHOOK_CLIENT_ID } from './env.js';

// #endregion

// ──────────────────────────────────────────────────────────────
// Internal constants
// ──────────────────────────────────────────────────────────────

const PROVIDER_ID = 'adobe-sign';
const HTTP_TIMEOUT_MS = 3000;
const MAX_RETRIES = 2;

// ──────────────────────────────────────────────────────────────
// Adobe Sign API response interfaces
// ──────────────────────────────────────────────────────────────

/** @internal */
interface IAdobeAgreementResponse {
    readonly id: string;
    readonly name: string;
    readonly status: string;
    readonly createdDate: string;
    readonly lastEventDate?: string;
    readonly expirationTime?: string;
    readonly participantSetsInfo?: ReadonlyArray<IAdobeParticipantSet>;
    readonly documentIds?: ReadonlyArray<string>;
}

/** @internal */
interface IAdobeParticipantSet {
    readonly memberInfos: ReadonlyArray<IAdobeParticipantMember>;
    readonly role: string;
    readonly order: number;
    readonly status: string;
    readonly id: string;
}

/** @internal */
interface IAdobeParticipantMember {
    readonly id: string;
    readonly email: string;
    readonly name?: string;
    readonly status: string;
}

/** @internal */
interface IAdobeSigningUrlResponse {
    readonly signingUrlSetInfos: ReadonlyArray<{
        readonly signingUrls: ReadonlyArray<{
            readonly email: string;
            readonly esignUrl: string;
        }>;
    }>;
}

/** @internal */
interface IAdobeDocumentResponse {
    readonly documents: ReadonlyArray<{
        readonly id: string;
        readonly label: string;
        readonly numPages: number;
        readonly mimeType: string;
    }>;
}

/** @internal */
interface IAdobeWebhookPayload {
    readonly webhookId: string;
    readonly webhookNotificationId: string;
    readonly event: string;
    readonly subEvent?: string;
    readonly eventDate: string;
    readonly agreement?: {
        readonly id: string;
        readonly name: string;
        readonly status: string;
    };
    readonly participantUserId?: string;
}

/**
 * Adobe Acrobat Sign e-signing provider.
 * Integrates with the Adobe Sign REST API v6 to manage agreements,
 * signing sessions, and webhook verification.
 *
 * @remarks
 * Adobe Sign does not provide a maintained Node.js SDK.
 * This provider communicates with the REST API directly using the
 * built-in `fetch` API available in Node.js 18+.
 *
 * @public
 */
@Injectable()
export class AdobeSignEsigningProvider extends EsigningClientBase {
    // #region Fields

    private readonly _config: ConfigService;
    private readonly _logger: Logger = new Logger(AdobeSignEsigningProvider.name);

    // #endregion

    // #region Ctor

    public constructor(config: ConfigService) {
        super();
        this._config = config;
    }

    // #endregion

    // #region Properties

    public get providerId(): string {
        return PROVIDER_ID;
    }

    // #endregion

    // #region Methods

    public async createSigningRequest(request: ICreateSigningRequest): Promise<ISigningRequest> {
        const transientDocumentIds: Array<string> = [];

        for (const document of request.documents) {
            const transientId = await this.uploadTransientDocument(document.name, document.content, document.contentType);
            transientDocumentIds.push(transientId);
        }

        const participantSetsInfo = request.signers.map((signer, index) => ({
            memberInfos: [{ email: signer.email }],
            role: this.mapSignerRoleToAdobe(signer.role),
            order: signer.order ?? index + 1,
        }));

        const fileInfos = transientDocumentIds.map((transientDocumentId) => ({
            transientDocumentId,
        }));

        const agreementBody: Record<string, unknown> = {
            name: request.subject,
            message: request.message,
            participantSetsInfo,
            fileInfos,
            signatureType: 'ESIGN',
            state: 'IN_PROCESS',
        };

        if (request.expiresInHours) {
            const expiresAt = new Date(Date.now() + request.expiresInHours * 60 * 60 * 1000);
            agreementBody['expirationTime'] = expiresAt.toISOString();
        }

        const agreement = await this.sendRequest<IAdobeAgreementResponse>('POST', '/agreements', agreementBody);

        const fullAgreement = await this.sendRequest<IAdobeAgreementResponse>('GET', `/agreements/${agreement.id}`);

        const signers = this.mapParticipantsToSigners(fullAgreement.participantSetsInfo ?? []);

        const documentsResponse = await this.sendRequest<IAdobeDocumentResponse>('GET', `/agreements/${agreement.id}/documents`);

        const documents: Array<ISigningDocument> = documentsResponse.documents.map((document, index) => ({
            documentId: document.id,
            name: document.label,
            contentType: document.mimeType,
            pageCount: document.numPages,
            sizeInBytes: undefined,
            order: index + 1,
        }));

        const fields: Array<ISigningField> = (request.fields ?? []).map((field, index) => ({
            ...field,
            fieldId: `adobe-field-${index}`,
            value: undefined,
        }));

        const now = new Date();

        return {
            signingRequestId: agreement.id,
            status: this.mapAdobeStatusToSigningRequestStatus(fullAgreement.status),
            subject: request.subject,
            message: request.message,
            signers,
            documents,
            fields,
            createdAt: fullAgreement.createdDate ? new Date(fullAgreement.createdDate) : now,
            updatedAt: fullAgreement.lastEventDate ? new Date(fullAgreement.lastEventDate) : now,
            expiresAt: fullAgreement.expirationTime ? new Date(fullAgreement.expirationTime) : undefined,
            providerMetadata: { provider: PROVIDER_ID, agreementId: agreement.id },
        };
    }

    public async createSigningSession(request: ICreateSigningSessionRequest): Promise<ISigningSession> {
        const signingUrlResponse = await this.sendRequest<IAdobeSigningUrlResponse>('GET', `/agreements/${request.signingRequestId}/signingUrls`);

        const agreement = await this.sendRequest<IAdobeAgreementResponse>('GET', `/agreements/${request.signingRequestId}`);

        const signer = this.findSignerById(agreement.participantSetsInfo ?? [], request.signerId);

        if (!signer) {
            throw new SigningRequestNotFoundError(request.signingRequestId);
        }

        let signingUrl: string | undefined;

        for (const set of signingUrlResponse.signingUrlSetInfos) {
            for (const urlEntry of set.signingUrls) {
                if (urlEntry.email === signer.email) {
                    signingUrl = urlEntry.esignUrl;
                }
            }
        }

        if (!signingUrl) {
            throw new SigningProviderError(PROVIDER_ID, `No signing URL available for signer '${request.signerId}'.`);
        }

        return {
            sessionId: `${request.signingRequestId}:${request.signerId}`,
            signingRequestId: request.signingRequestId,
            signerId: request.signerId,
            signingUrl,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        };
    }

    public async getSigningRequest(signingRequestId: string): Promise<ISigningRequest> {
        const agreement = await this.sendRequest<IAdobeAgreementResponse>('GET', `/agreements/${signingRequestId}`);

        const documentsResponse = await this.sendRequest<IAdobeDocumentResponse>('GET', `/agreements/${signingRequestId}/documents`);

        const signers = this.mapParticipantsToSigners(agreement.participantSetsInfo ?? []);

        const documents: Array<ISigningDocument> = documentsResponse.documents.map((document, index) => ({
            documentId: document.id,
            name: document.label,
            contentType: document.mimeType,
            pageCount: document.numPages,
            sizeInBytes: undefined,
            order: index + 1,
        }));

        return {
            signingRequestId: agreement.id,
            status: this.mapAdobeStatusToSigningRequestStatus(agreement.status),
            subject: agreement.name,
            signers,
            documents,
            fields: [],
            createdAt: agreement.createdDate ? new Date(agreement.createdDate) : new Date(),
            updatedAt: agreement.lastEventDate ? new Date(agreement.lastEventDate) : new Date(),
            expiresAt: agreement.expirationTime ? new Date(agreement.expirationTime) : undefined,
            providerMetadata: { provider: PROVIDER_ID, agreementId: agreement.id },
        };
    }

    public async getSignedDocuments(signingRequestId: string): Promise<Array<ISignedDocument>> {
        const documentsResponse = await this.sendRequest<IAdobeDocumentResponse>('GET', `/agreements/${signingRequestId}/documents`);

        const signedDocuments: Array<ISignedDocument> = [];

        for (const document of documentsResponse.documents) {
            const content = await this.downloadDocument(signingRequestId, document.id);

            signedDocuments.push({
                documentId: document.id,
                signingRequestId,
                name: document.label,
                contentType: document.mimeType,
                content,
                sizeInBytes: content.length,
            });
        }

        return signedDocuments;
    }

    public async cancelSigningRequest(signingRequestId: string, reason?: string): Promise<void> {
        await this.sendRequest('PUT', `/agreements/${signingRequestId}/state`, {
            state: 'CANCELLED',
            cancellationInfo: {
                comment: reason ?? 'Cancelled via API.',
                notifyOthers: true,
            },
        });
    }

    public async verifyWebhook(payload: string | Buffer, _signature: string, headers?: Record<string, string>): Promise<IEsigningWebhookEvent> {
        const webhookClientId = this._config.get<string>(ADOBE_SIGN_WEBHOOK_CLIENT_ID.key);

        if (!webhookClientId) {
            throw new WebhookVerificationError('Adobe Sign webhook client ID is not configured. Set ADOBE_SIGN_WEBHOOK_CLIENT_ID.');
        }

        const clientIdHeader = headers?.['x-adobesign-clientid'] ?? headers?.['X-AdobeSign-ClientId'];

        if (clientIdHeader !== webhookClientId) {
            throw new WebhookVerificationError('Adobe Sign webhook client ID mismatch.');
        }

        const body: IAdobeWebhookPayload = JSON.parse(typeof payload === 'string' ? payload : payload.toString('utf-8'));

        if (!body.agreement?.id) {
            throw new WebhookVerificationError('Adobe Sign webhook payload missing agreement ID.');
        }

        return {
            eventId: body.webhookNotificationId,
            eventType: this.mapAdobeEventToWebhookEventType(body.event),
            signingRequestId: body.agreement.id,
            signerId: body.participantUserId,
            occurredAt: new Date(body.eventDate),
            rawPayload: body,
        };
    }

    // ──────────────────────────────────────────────────────────────
    // Private helpers
    // ──────────────────────────────────────────────────────────────

    private async uploadTransientDocument(fileName: string, content: Buffer, contentType: string): Promise<string> {
        const baseUrl = this._config.get<string>(ADOBE_SIGN_BASE_URL.key);
        const token = this._config.get<string>(ADOBE_SIGN_INTEGRATION_KEY.key);

        const formData = new FormData();
        formData.append('File-Name', fileName);
        formData.append('File', new Blob([new Uint8Array(content)], { type: contentType }), fileName);

        const response = await this.fetchWithRetry(`${baseUrl}/api/rest/v6/transientDocuments`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = (await response.json()) as { transientDocumentId: string };

        return result.transientDocumentId;
    }

    private async downloadDocument(agreementId: string, documentId: string): Promise<Buffer> {
        const baseUrl = this._config.get<string>(ADOBE_SIGN_BASE_URL.key);
        const token = this._config.get<string>(ADOBE_SIGN_INTEGRATION_KEY.key);

        const response = await this.fetchWithRetry(`${baseUrl}/api/rest/v6/agreements/${agreementId}/documents/${documentId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const arrayBuffer = await response.arrayBuffer();

        return Buffer.from(arrayBuffer);
    }

    private async sendRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
        const baseUrl = this._config.get<string>(ADOBE_SIGN_BASE_URL.key);
        const token = this._config.get<string>(ADOBE_SIGN_INTEGRATION_KEY.key);

        const options: RequestInit = {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await this.fetchWithRetry(`${baseUrl}/api/rest/v6${path}`, options);

        if (!response.ok) {
            const errorBody = await response.text().catch(() => 'Unknown error');

            throw new SigningProviderError(PROVIDER_ID, `HTTP ${response.status} on ${method} ${path}: ${errorBody}`);
        }

        return (await response.json()) as T;
    }

    private async fetchWithRetry(url: string, options: RequestInit, attempt = 0): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

        try {
            const response = await fetch(url, { ...options, signal: controller.signal });

            if (!response.ok && response.status >= 500 && attempt < MAX_RETRIES) {
                this._logger.warn(`Adobe Sign API returned ${response.status}, retrying (${attempt + 1}/${MAX_RETRIES})...`);

                return this.fetchWithRetry(url, options, attempt + 1);
            }

            return response;
        } catch (error: unknown) {
            if (attempt < MAX_RETRIES) {
                this._logger.warn(`Adobe Sign API request failed, retrying (${attempt + 1}/${MAX_RETRIES})...`);

                return this.fetchWithRetry(url, options, attempt + 1);
            }

            throw new SigningProviderError(PROVIDER_ID, 'Request failed after retries.', error);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    private mapSignerRoleToAdobe(role: string): string {
        switch (role) {
            case 'signer':
                return 'SIGNER';
            case 'approver':
                return 'APPROVER';
            case 'carbon-copy':
                return 'CC';
            case 'in-person-signer':
                return 'SIGNER';
            case 'witness':
                return 'SIGNER';
            default:
                return 'SIGNER';
        }
    }

    private mapAdobeStatusToSigningRequestStatus(status: string): SigningRequestStatus {
        switch (status) {
            case 'DRAFT':
                return SigningRequestStatuses.Draft;
            case 'OUT_FOR_SIGNATURE':
            case 'OUT_FOR_APPROVAL':
            case 'AUTHORING':
                return SigningRequestStatuses.Sent;
            case 'SIGNED':
                return SigningRequestStatuses.Completed;
            case 'CANCELLED':
            case 'RECALLED':
                return SigningRequestStatuses.Cancelled;
            case 'EXPIRED':
                return SigningRequestStatuses.Expired;
            case 'DECLINED':
            case 'REJECTED':
                return SigningRequestStatuses.Declined;
            default:
                return SigningRequestStatuses.InProgress;
        }
    }

    private mapAdobeEventToWebhookEventType(event: string): WebhookEventType {
        switch (event) {
            case 'AGREEMENT_ALL_SIGNED':
                return WebhookEventTypes.SigningRequestCompleted;
            case 'AGREEMENT_RECALLED':
            case 'AGREEMENT_CANCELLED':
                return WebhookEventTypes.SigningRequestVoided;
            case 'AGREEMENT_EXPIRED':
                return WebhookEventTypes.SigningRequestExpired;
            case 'AGREEMENT_ACTION_COMPLETED':
                return WebhookEventTypes.SignerCompleted;
            case 'AGREEMENT_ACTION_DECLINED':
                return WebhookEventTypes.SignerDeclined;
            case 'AGREEMENT_ACTION_REQUESTED':
                return WebhookEventTypes.SignerSent;
            case 'AGREEMENT_ACTION_DELEGATED':
                return WebhookEventTypes.SignerDelivered;
            case 'AGREEMENT_CREATED':
                return WebhookEventTypes.SigningRequestSent;
            default:
                return WebhookEventTypes.SigningRequestSent;
        }
    }

    private mapAdobeParticipantStatusToSignerStatus(status: string): SignerStatus {
        switch (status) {
            case 'COMPLETED':
                return SignerStatuses.Signed;
            case 'WAITING_FOR_MY_SIGNATURE':
            case 'WAITING_FOR_MY_APPROVAL':
                return SignerStatuses.Delivered;
            case 'NOT_YET_VISIBLE':
                return SignerStatuses.Pending;
            case 'WAITING_FOR_OTHERS':
                return SignerStatuses.Sent;
            case 'RECALLED':
            case 'CANCELLED':
                return SignerStatuses.Expired;
            case 'REJECTED':
                return SignerStatuses.Declined;
            default:
                return SignerStatuses.Pending;
        }
    }

    private mapParticipantsToSigners(participantSets: ReadonlyArray<IAdobeParticipantSet>): Array<ISigner> {
        const signers: Array<ISigner> = [];

        for (const set of participantSets) {
            for (const member of set.memberInfos) {
                signers.push({
                    signerId: member.id,
                    email: member.email,
                    name: member.name ?? member.email,
                    role: set.role === 'CC' ? 'carbon-copy' : 'signer',
                    status: this.mapAdobeParticipantStatusToSignerStatus(member.status),
                    order: set.order,
                });
            }
        }

        return signers;
    }

    private findSignerById(participantSets: ReadonlyArray<IAdobeParticipantSet>, signerId: string): IAdobeParticipantMember | undefined {
        for (const set of participantSets) {
            for (const member of set.memberInfos) {
                if (member.id === signerId) {
                    return member;
                }
            }
        }

        return undefined;
    }

    // #endregion
}
