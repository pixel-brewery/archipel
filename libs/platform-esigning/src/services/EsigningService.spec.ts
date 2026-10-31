// #region Imports

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EsigningClientBase } from '../abstracts/EsigningClientBase.js';
import { EsigningPersistenceBase } from '../abstracts/EsigningPersistenceBase.js';
import type { ICreateSigningRequest } from '../models/ICreateSigningRequest.js';
import type { ICreateSigningSessionRequest } from '../models/ICreateSigningSessionRequest.js';
import type { IEsigningWebhookEvent } from '../models/IEsigningWebhookEvent.js';
import type { ISignedDocument } from '../models/ISignedDocument.js';
import type { ISigningRequest } from '../models/ISigningRequest.js';
import type { ISigningSession } from '../models/ISigningSession.js';
import { SignerStatuses } from '../models/SignerStatus.js';
import { SigningRequestStatuses } from '../models/SigningRequestStatus.js';
import { WebhookEventTypes } from '../models/WebhookEventType.js';
import { EsigningService } from './EsigningService.js';

// #endregion

// #region Helpers

function createMockClient(): EsigningClientBase {
    return {
        providerId: 'mock-provider',
        createSigningRequest: vi.fn(),
        createSigningSession: vi.fn(),
        getSigningRequest: vi.fn(),
        getSignedDocuments: vi.fn(),
        cancelSigningRequest: vi.fn(),
        verifyWebhook: vi.fn(),
    } as unknown as EsigningClientBase;
}

function createMockPersistence(): EsigningPersistenceBase {
    return {
        onSigningRequestCreated: vi.fn(),
        onSigningRequestStatusChanged: vi.fn(),
        onSigningRequestCancelled: vi.fn(),
    } as unknown as EsigningPersistenceBase;
}

function createSigningRequestFixture(overrides?: Partial<ISigningRequest>): ISigningRequest {
    return {
        signingRequestId: 'sr-001',
        status: SigningRequestStatuses.Sent,
        subject: 'Test Agreement',
        message: 'Please sign this.',
        signers: [
            {
                signerId: 'signer-001',
                email: 'john@example.com',
                name: 'John Doe',
                role: 'signer',
                status: SignerStatuses.Pending,
                order: 1,
            },
        ],
        documents: [
            {
                documentId: 'doc-001',
                name: 'contract.pdf',
                contentType: 'application/pdf',
                sizeInBytes: 1024,
                pageCount: 3,
                order: 1,
            },
        ],
        fields: [],
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
        ...overrides,
    };
}

function createSigningSessionFixture(overrides?: Partial<ISigningSession>): ISigningSession {
    return {
        sessionId: 'session-001',
        signingRequestId: 'sr-001',
        signerId: 'signer-001',
        signingUrl: 'https://sign.example.com/session-001',
        expiresAt: new Date('2026-01-01T01:00:00Z'),
        ...overrides,
    };
}

function createWebhookEventFixture(overrides?: Partial<IEsigningWebhookEvent>): IEsigningWebhookEvent {
    return {
        eventId: 'evt-001',
        eventType: WebhookEventTypes.SignerCompleted,
        signingRequestId: 'sr-001',
        signerId: 'signer-001',
        occurredAt: new Date('2026-01-01T00:30:00Z'),
        rawPayload: { raw: true },
        ...overrides,
    };
}

// #endregion

describe('EsigningService', () => {
    // #region Fields

    let client: EsigningClientBase;
    let persistence: EsigningPersistenceBase;

    // #endregion

    // #region Setup

    beforeEach(() => {
        vi.restoreAllMocks();
        client = createMockClient();
        persistence = createMockPersistence();
    });

    // #endregion

    // #region providerId

    describe('providerId', () => {
        it('should return the provider identifier from the client', () => {
            // arrange
            const service = new EsigningService(client, persistence);

            // act
            const result = service.providerId;

            // assert
            expect(result).toBe('mock-provider');
        });
    });

    // #endregion

    // #region createSigningRequest

    describe('createSigningRequest', () => {
        it('should delegate to the client and return the created signing request', async () => {
            // arrange
            const signingRequest = createSigningRequestFixture();
            vi.mocked(client.createSigningRequest).mockResolvedValue(signingRequest);
            const service = new EsigningService(client, persistence);
            const request: ICreateSigningRequest = {
                subject: 'Test Agreement',
                documents: [{ name: 'contract.pdf', contentType: 'application/pdf', content: Buffer.from('pdf'), order: 1 }],
                signers: [{ email: 'john@example.com', name: 'John Doe', role: 'signer', order: 1 }],
            };

            // act
            const result = await service.createSigningRequest(request);

            // assert
            expect(client.createSigningRequest).toHaveBeenCalledWith(request);
            expect(result).toBe(signingRequest);
        });

        it('should invoke persistence when provided', async () => {
            // arrange
            const signingRequest = createSigningRequestFixture();
            vi.mocked(client.createSigningRequest).mockResolvedValue(signingRequest);
            const service = new EsigningService(client, persistence);
            const request: ICreateSigningRequest = {
                subject: 'Test',
                documents: [{ name: 'doc.pdf', contentType: 'application/pdf', content: Buffer.from('pdf'), order: 1 }],
                signers: [{ email: 'a@b.com', name: 'A', role: 'signer', order: 1 }],
            };

            // act
            await service.createSigningRequest(request);

            // assert
            expect(persistence.onSigningRequestCreated).toHaveBeenCalledWith(signingRequest);
        });

        it('should not fail when persistence is null', async () => {
            // arrange
            const signingRequest = createSigningRequestFixture();
            vi.mocked(client.createSigningRequest).mockResolvedValue(signingRequest);
            const service = new EsigningService(client, null);
            const request: ICreateSigningRequest = {
                subject: 'Test',
                documents: [{ name: 'doc.pdf', contentType: 'application/pdf', content: Buffer.from('pdf'), order: 1 }],
                signers: [{ email: 'a@b.com', name: 'A', role: 'signer', order: 1 }],
            };

            // act
            const result = await service.createSigningRequest(request);

            // assert
            expect(result).toBe(signingRequest);
        });
    });

    // #endregion

    // #region createSigningSession

    describe('createSigningSession', () => {
        it('should delegate to the client and return the session', async () => {
            // arrange
            const session = createSigningSessionFixture();
            vi.mocked(client.createSigningSession).mockResolvedValue(session);
            const service = new EsigningService(client, persistence);
            const request: ICreateSigningSessionRequest = {
                signingRequestId: 'sr-001',
                signerId: 'signer-001',
            };

            // act
            const result = await service.createSigningSession(request);

            // assert
            expect(client.createSigningSession).toHaveBeenCalledWith(request);
            expect(result).toBe(session);
        });

        it('should pass the returnUrl when provided', async () => {
            // arrange
            const session = createSigningSessionFixture();
            vi.mocked(client.createSigningSession).mockResolvedValue(session);
            const service = new EsigningService(client, persistence);
            const request: ICreateSigningSessionRequest = {
                signingRequestId: 'sr-001',
                signerId: 'signer-001',
                returnUrl: 'https://app.example.com/done',
            };

            // act
            await service.createSigningSession(request);

            // assert
            expect(client.createSigningSession).toHaveBeenCalledWith(request);
        });
    });

    // #endregion

    // #region getSigningRequest

    describe('getSigningRequest', () => {
        it('should delegate to the client and return the signing request', async () => {
            // arrange
            const signingRequest = createSigningRequestFixture();
            vi.mocked(client.getSigningRequest).mockResolvedValue(signingRequest);
            const service = new EsigningService(client, persistence);

            // act
            const result = await service.getSigningRequest('sr-001');

            // assert
            expect(client.getSigningRequest).toHaveBeenCalledWith('sr-001');
            expect(result).toBe(signingRequest);
        });
    });

    // #endregion

    // #region getSignedDocuments

    describe('getSignedDocuments', () => {
        it('should delegate to the client and return signed documents', async () => {
            // arrange
            const documents: Array<ISignedDocument> = [
                {
                    documentId: 'doc-001',
                    signingRequestId: 'sr-001',
                    name: 'contract.pdf',
                    contentType: 'application/pdf',
                    content: Buffer.from('signed-pdf'),
                    sizeInBytes: 10,
                },
            ];
            vi.mocked(client.getSignedDocuments).mockResolvedValue(documents);
            const service = new EsigningService(client, persistence);

            // act
            const result = await service.getSignedDocuments('sr-001');

            // assert
            expect(client.getSignedDocuments).toHaveBeenCalledWith('sr-001');
            expect(result).toBe(documents);
        });
    });

    // #endregion

    // #region cancelSigningRequest

    describe('cancelSigningRequest', () => {
        it('should delegate to the client', async () => {
            // arrange
            vi.mocked(client.cancelSigningRequest).mockResolvedValue(undefined);
            const service = new EsigningService(client, persistence);

            // act
            await service.cancelSigningRequest('sr-001', 'Changed mind');

            // assert
            expect(client.cancelSigningRequest).toHaveBeenCalledWith('sr-001', 'Changed mind');
        });

        it('should invoke persistence when provided', async () => {
            // arrange
            vi.mocked(client.cancelSigningRequest).mockResolvedValue(undefined);
            const service = new EsigningService(client, persistence);

            // act
            await service.cancelSigningRequest('sr-001');

            // assert
            expect(persistence.onSigningRequestCancelled).toHaveBeenCalledWith('sr-001');
        });

        it('should not fail when persistence is null', async () => {
            // arrange
            vi.mocked(client.cancelSigningRequest).mockResolvedValue(undefined);
            const service = new EsigningService(client, null);

            // act & assert
            await expect(service.cancelSigningRequest('sr-001')).resolves.toBeUndefined();
        });
    });

    // #endregion

    // #region verifyWebhook

    describe('verifyWebhook', () => {
        it('should delegate to the client and return the normalized event', async () => {
            // arrange
            const event = createWebhookEventFixture();
            vi.mocked(client.verifyWebhook).mockResolvedValue(event);
            const service = new EsigningService(client, persistence);

            // act
            const result = await service.verifyWebhook('raw-body', 'sig-header');

            // assert
            expect(client.verifyWebhook).toHaveBeenCalledWith('raw-body', 'sig-header', undefined);
            expect(result).toBe(event);
        });

        it('should invoke persistence status change when provided', async () => {
            // arrange
            const event = createWebhookEventFixture();
            vi.mocked(client.verifyWebhook).mockResolvedValue(event);
            const service = new EsigningService(client, persistence);

            // act
            await service.verifyWebhook('raw-body', 'sig-header');

            // assert
            expect(persistence.onSigningRequestStatusChanged).toHaveBeenCalledWith('sr-001', WebhookEventTypes.SignerCompleted);
        });

        it('should not fail when persistence is null', async () => {
            // arrange
            const event = createWebhookEventFixture();
            vi.mocked(client.verifyWebhook).mockResolvedValue(event);
            const service = new EsigningService(client, null);

            // act
            const result = await service.verifyWebhook('raw-body', 'sig-header');

            // assert
            expect(result).toBe(event);
        });

        it('should propagate client errors', async () => {
            // arrange
            vi.mocked(client.verifyWebhook).mockRejectedValue(new Error('Verification failed'));
            const service = new EsigningService(client, persistence);

            // act & assert
            await expect(service.verifyWebhook('bad-body', 'bad-sig')).rejects.toThrow('Verification failed');
        });
    });

    // #endregion
});
