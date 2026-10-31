// #region Imports

import { Injectable, Logger, Optional } from '@nestjs/common';
import { EsigningClientBase } from '../abstracts/EsigningClientBase.js';
import { EsigningPersistenceBase } from '../abstracts/EsigningPersistenceBase.js';
import type { ICreateSigningRequest } from '../models/ICreateSigningRequest.js';
import type { ICreateSigningSessionRequest } from '../models/ICreateSigningSessionRequest.js';
import type { IEsigningWebhookEvent } from '../models/IEsigningWebhookEvent.js';
import type { ISignedDocument } from '../models/ISignedDocument.js';
import type { ISigningRequest } from '../models/ISigningRequest.js';
import type { ISigningSession } from '../models/ISigningSession.js';

// #endregion

/**
 * Application-level service for e-signing operations.
 * Delegates to the configured {@link EsigningClientBase} and optionally invokes
 * the {@link EsigningPersistenceBase} for state tracking.
 *
 * @public
 */
@Injectable()
export class EsigningService {
    // #region Fields

    private readonly _client: EsigningClientBase;
    private readonly _persistence: EsigningPersistenceBase | null;
    private readonly _logger: Logger = new Logger(EsigningService.name);

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link EsigningService} class.
     *
     * @public
     * @param client - The concrete e-signing provider implementation.
     * @param persistence - Optional abstract base for persisting signing request state.
     */
    public constructor(client: EsigningClientBase, @Optional() persistence: EsigningPersistenceBase | null) {
        this._client = client;
        this._persistence = persistence ?? null;
    }

    // #endregion

    // #region Properties

    /** Identifier of the active provider. */
    public get providerId(): string {
        return this._client.providerId;
    }

    // #endregion

    // #region Methods

    /**
     * Create a new signing request.
     *
     * @public
     * @param request - The signing request creation input.
     * @returns The created signing request.
     */
    public async createSigningRequest(request: ICreateSigningRequest): Promise<ISigningRequest> {
        const signingRequest = await this._client.createSigningRequest(request);

        await this._persistence?.onSigningRequestCreated(signingRequest);

        return signingRequest;
    }

    /**
     * Generate a signing session (signing link) for a specific signer.
     *
     * @public
     * @param request - The session creation input.
     * @returns The signing session.
     */
    public async createSigningSession(request: ICreateSigningSessionRequest): Promise<ISigningSession> {
        return this._client.createSigningSession(request);
    }

    /**
     * Retrieve the current status and details of a signing request.
     *
     * @public
     * @param signingRequestId - The signing request identifier.
     * @returns The signing request with current status.
     */
    public async getSigningRequest(signingRequestId: string): Promise<ISigningRequest> {
        return this._client.getSigningRequest(signingRequestId);
    }

    /**
     * Retrieve the final signed documents for a completed signing request.
     *
     * @public
     * @param signingRequestId - The signing request identifier.
     * @returns Array of signed documents.
     */
    public async getSignedDocuments(signingRequestId: string): Promise<Array<ISignedDocument>> {
        return this._client.getSignedDocuments(signingRequestId);
    }

    /**
     * Cancel an in-progress signing request.
     *
     * @public
     * @param signingRequestId - The signing request identifier.
     * @param reason - Optional reason for cancellation.
     */
    public async cancelSigningRequest(signingRequestId: string, reason?: string): Promise<void> {
        await this._client.cancelSigningRequest(signingRequestId, reason);

        await this._persistence?.onSigningRequestCancelled(signingRequestId);
    }

    /**
     * Verify a webhook payload and return a normalized event.
     * Optionally updates persistence if a state change is detected.
     *
     * @public
     * @param payload - Raw webhook body.
     * @param signature - Webhook signature header value.
     * @param headers - Optional webhook request headers (for timestamp/nonce validation).
     * @returns Normalized webhook event.
     */
    public async verifyWebhook(payload: string | Buffer, signature: string, headers?: Record<string, string>): Promise<IEsigningWebhookEvent> {
        const event = await this._client.verifyWebhook(payload, signature, headers);

        this._logger.log({
            message: 'Webhook verified',
            signingRequestId: event.signingRequestId,
            eventType: event.eventType,
            provider: this._client.providerId,
        });

        if (this._persistence) {
            await this._persistence.onSigningRequestStatusChanged(event.signingRequestId, event.eventType);
        } else {
            this._logger.warn({
                message: 'No persistence configured - webhook state change not persisted',
                signingRequestId: event.signingRequestId,
                eventType: event.eventType,
            });
        }

        return event;
    }

    // #endregion
}
