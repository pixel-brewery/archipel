// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EsigningClientBase } from '../../abstracts/EsigningClientBase.js';
import { SigningRequestNotFoundError } from '../../errors/SigningRequestNotFoundError.js';
import { WebhookVerificationError } from '../../errors/WebhookVerificationError.js';
import type { ICreateSigningRequest } from '../../models/ICreateSigningRequest.js';
import type { ICreateSigningSessionRequest } from '../../models/ICreateSigningSessionRequest.js';
import type { IEsigningWebhookEvent } from '../../models/IEsigningWebhookEvent.js';
import type { ISignedDocument } from '../../models/ISignedDocument.js';
import type { ISigner } from '../../models/ISigner.js';
import type { ISigningDocument } from '../../models/ISigningDocument.js';
import type { ISigningField } from '../../models/ISigningField.js';
import type { ISigningRequest } from '../../models/ISigningRequest.js';
import type { ISigningSession } from '../../models/ISigningSession.js';
import { SignerStatuses } from '../../models/SignerStatus.js';
import { SigningRequestStatuses, type SigningRequestStatus } from '../../models/SigningRequestStatus.js';

// #endregion

/**
 * In-memory state for a signing request managed by the internal provider.
 *
 * @internal
 */
interface IInternalSigningRequestState {
    signingRequest: ISigningRequest;
    documentContents: ReadonlyMap<string, Buffer>;
    status: SigningRequestStatus;
    signedBySignerIds: Set<string>;
}

/**
 * Built-in e-signing provider that manages signing requests in-memory.
 * This provider fulfills the same contract as external providers and can be used
 * for development, testing, or simple self-managed signing workflows.
 *
 * @public
 */
@Injectable()
export class InternalEsigningProvider extends EsigningClientBase {
    // #region Fields

    private static readonly _MAX_REQUESTS = 10_000;
    private readonly _logger = new Logger(InternalEsigningProvider.name);
    private readonly _requests: Map<string, IInternalSigningRequestState> = new Map();

    // #endregion

    // #region Properties

    public get providerId(): string {
        return 'internal';
    }

    // #endregion

    // #region Methods

    public async createSigningRequest(request: ICreateSigningRequest): Promise<ISigningRequest> {
        if (this._requests.size >= InternalEsigningProvider._MAX_REQUESTS) {
            this._logger.warn(`InternalEsigningProvider reached max capacity of ${InternalEsigningProvider._MAX_REQUESTS} requests`);
            throw new Error(`InternalEsigningProvider exceeded maximum of ${InternalEsigningProvider._MAX_REQUESTS} in-memory requests`);
        }

        const signingRequestId = randomUUID();
        const now = new Date();

        const signers: Array<ISigner> = request.signers.map((signer) => ({
            signerId: randomUUID(),
            email: signer.email,
            name: signer.name,
            role: signer.role,
            status: SignerStatuses.Pending,
            order: signer.order,
        }));

        const documents: Array<ISigningDocument> = request.documents.map((document) => ({
            documentId: randomUUID(),
            name: document.name,
            contentType: document.contentType,
            sizeInBytes: document.content.length,
            pageCount: undefined,
            order: document.order,
        }));

        const documentContents = new Map<string, Buffer>();

        for (let index = 0; index < documents.length; index++) {
            documentContents.set(documents[index].documentId, request.documents[index].content);
        }

        const fields: Array<ISigningField> = (request.fields ?? []).map((field) => ({
            ...field,
            fieldId: randomUUID(),
            value: undefined,
        }));

        const expiresAt = request.expiresInHours ? new Date(now.getTime() + request.expiresInHours * 60 * 60 * 1000) : undefined;

        const signingRequest: ISigningRequest = {
            signingRequestId,
            status: SigningRequestStatuses.Sent,
            subject: request.subject,
            message: request.message,
            signers,
            documents,
            fields,
            createdAt: now,
            updatedAt: now,
            expiresAt,
            providerMetadata: { provider: 'internal' },
        };

        this._requests.set(signingRequestId, {
            signingRequest,
            documentContents,
            status: SigningRequestStatuses.Sent,
            signedBySignerIds: new Set(),
        });

        return signingRequest;
    }

    public async createSigningSession(request: ICreateSigningSessionRequest): Promise<ISigningSession> {
        const state = this._requests.get(request.signingRequestId);

        if (!state) {
            throw new SigningRequestNotFoundError(request.signingRequestId);
        }

        const signer = state.signingRequest.signers.find((signer) => signer.signerId === request.signerId);

        if (!signer) {
            throw new SigningRequestNotFoundError(request.signingRequestId);
        }

        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        const signingUrl = request.returnUrl
            ? `internal://sign/${sessionId}?returnUrl=${encodeURIComponent(request.returnUrl)}`
            : `internal://sign/${sessionId}`;

        return {
            sessionId,
            signingRequestId: request.signingRequestId,
            signerId: request.signerId,
            signingUrl,
            expiresAt,
        };
    }

    public async getSigningRequest(signingRequestId: string): Promise<ISigningRequest> {
        const state = this._requests.get(signingRequestId);

        if (!state) {
            throw new SigningRequestNotFoundError(signingRequestId);
        }

        return {
            ...state.signingRequest,
            status: state.status,
            updatedAt: new Date(),
        };
    }

    public async getSignedDocuments(signingRequestId: string): Promise<Array<ISignedDocument>> {
        const state = this._requests.get(signingRequestId);

        if (!state) {
            throw new SigningRequestNotFoundError(signingRequestId);
        }

        return state.signingRequest.documents.map((document) => ({
            documentId: document.documentId,
            signingRequestId,
            name: document.name,
            contentType: document.contentType,
            content: state.documentContents.get(document.documentId) ?? Buffer.alloc(0),
            sizeInBytes: state.documentContents.get(document.documentId)?.length ?? 0,
        }));
    }

    public async cancelSigningRequest(signingRequestId: string, _reason?: string): Promise<void> {
        const state = this._requests.get(signingRequestId);

        if (!state) {
            throw new SigningRequestNotFoundError(signingRequestId);
        }

        state.status = SigningRequestStatuses.Cancelled;
    }

    public async verifyWebhook(_payload: string | Buffer, _signature: string, _headers?: Record<string, string>): Promise<IEsigningWebhookEvent> {
        throw new WebhookVerificationError('Internal provider does not support external webhooks.');
    }

    /**
     * Marks a signer as having completed their signing.
     * This is specific to the internal provider and allows the consuming
     * application to programmatically complete a signer's step.
     *
     * @public
     * @param signingRequestId - The signing request identifier.
     * @param signerId - The signer identifier.
     */
    public async completeSigner(signingRequestId: string, signerId: string): Promise<void> {
        const state = this._requests.get(signingRequestId);

        if (!state) {
            throw new SigningRequestNotFoundError(signingRequestId);
        }

        state.signedBySignerIds.add(signerId);

        const allSigned = state.signingRequest.signers.every((signer) => state.signedBySignerIds.has(signer.signerId));

        if (allSigned) {
            state.status = SigningRequestStatuses.Completed;
        } else {
            state.status = SigningRequestStatuses.InProgress;
        }
    }

    // #endregion
}
