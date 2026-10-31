// #region Imports

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SigningRequestNotFoundError } from '../../errors/SigningRequestNotFoundError.js';
import { WebhookVerificationError } from '../../errors/WebhookVerificationError.js';
import type { ICreateSigningRequest } from '../../models/ICreateSigningRequest.js';
import type { ICreateSigningSessionRequest } from '../../models/ICreateSigningSessionRequest.js';
import { SignerStatuses } from '../../models/SignerStatus.js';
import { SigningRequestStatuses } from '../../models/SigningRequestStatus.js';
import { InternalEsigningProvider } from './InternalEsigningProvider.js';

// #endregion

// #region Helpers

function createDefaultSigningRequest(): ICreateSigningRequest {
    return {
        subject: 'NDA Agreement',
        message: 'Please review and sign.',
        documents: [{ name: 'nda.pdf', contentType: 'application/pdf', content: Buffer.from('nda-content'), order: 1 }],
        signers: [
            { email: 'alice@example.com', name: 'Alice', role: 'signer', order: 1 },
            { email: 'bob@example.com', name: 'Bob', role: 'signer', order: 2 },
        ],
    };
}

function createMultiDocumentSigningRequest(): ICreateSigningRequest {
    return {
        subject: 'Multi-Document Package',
        documents: [
            { name: 'contract.pdf', contentType: 'application/pdf', content: Buffer.from('contract'), order: 1 },
            { name: 'appendix.pdf', contentType: 'application/pdf', content: Buffer.from('appendix'), order: 2 },
        ],
        signers: [{ email: 'alice@example.com', name: 'Alice', role: 'signer', order: 1 }],
    };
}

// #endregion

describe('InternalEsigningProvider', () => {
    // #region Fields

    let provider: InternalEsigningProvider;

    // #endregion

    // #region Setup

    beforeEach(() => {
        vi.restoreAllMocks();
        provider = new InternalEsigningProvider();
    });

    // #endregion

    // #region providerId

    describe('providerId', () => {
        it('should return internal as the provider identifier', () => {
            // act
            const result = provider.providerId;

            // assert
            expect(result).toBe('internal');
        });
    });

    // #endregion

    // #region createSigningRequest

    describe('createSigningRequest', () => {
        it('should create a signing request with a unique identifier', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.signingRequestId).toBeDefined();
            expect(result.signingRequestId).toMatch(/^[0-9a-f-]{36}$/);
        });

        it('should set the status to sent', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.status).toBe(SigningRequestStatuses.Sent);
        });

        it('should preserve the subject and message', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.subject).toBe('NDA Agreement');
            expect(result.message).toBe('Please review and sign.');
        });

        it('should assign unique signer identifiers and pending status', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.signers).toHaveLength(2);
            expect(result.signers[0].signerId).toBeDefined();
            expect(result.signers[1].signerId).toBeDefined();
            expect(result.signers[0].signerId).not.toBe(result.signers[1].signerId);
            expect(result.signers[0].status).toBe(SignerStatuses.Pending);
            expect(result.signers[1].status).toBe(SignerStatuses.Pending);
        });

        it('should preserve signer details from the request', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.signers[0].email).toBe('alice@example.com');
            expect(result.signers[0].name).toBe('Alice');
            expect(result.signers[0].role).toBe('signer');
            expect(result.signers[0].order).toBe(1);
        });

        it('should assign unique document identifiers', async () => {
            // arrange
            const request = createMultiDocumentSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.documents).toHaveLength(2);
            expect(result.documents[0].documentId).toBeDefined();
            expect(result.documents[1].documentId).toBeDefined();
            expect(result.documents[0].documentId).not.toBe(result.documents[1].documentId);
        });

        it('should calculate document size from buffer content', async () => {
            // arrange
            const content = Buffer.from('nda-content');
            const request: ICreateSigningRequest = {
                subject: 'Test',
                documents: [{ name: 'doc.pdf', contentType: 'application/pdf', content, order: 1 }],
                signers: [{ email: 'a@b.com', name: 'A', role: 'signer', order: 1 }],
            };

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.documents[0].sizeInBytes).toBe(content.length);
        });

        it('should set timestamps on creation', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });

        it('should calculate expiresAt when expiresInHours is provided', async () => {
            // arrange
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
            const request: ICreateSigningRequest = {
                ...createDefaultSigningRequest(),
                expiresInHours: 48,
            };

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.expiresAt).toEqual(new Date('2026-01-03T00:00:00Z'));
            vi.useRealTimers();
        });

        it('should leave expiresAt undefined when expiresInHours is omitted', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.expiresAt).toBeUndefined();
        });

        it('should handle fields when provided', async () => {
            // arrange
            const request: ICreateSigningRequest = {
                ...createDefaultSigningRequest(),
                fields: [
                    {
                        type: 'signature',
                        signerId: 'placeholder',
                        documentId: 'placeholder',
                        pageNumber: 1,
                        positionX: 100,
                        positionY: 200,
                        width: 150,
                        height: 50,
                        required: true,
                    },
                ],
            };

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.fields).toHaveLength(1);
            expect(result.fields[0].fieldId).toBeDefined();
            expect(result.fields[0].type).toBe('signature');
            expect(result.fields[0].required).toBe(true);
        });

        it('should set empty fields array when none are provided', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.fields).toEqual([]);
        });

        it('should include provider metadata', async () => {
            // arrange
            const request = createDefaultSigningRequest();

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(result.providerMetadata).toEqual({ provider: 'internal' });
        });
    });

    // #endregion

    // #region createSigningSession

    describe('createSigningSession', () => {
        it('should create a signing session with a valid URL', async () => {
            // arrange
            const signingRequest = await provider.createSigningRequest(createDefaultSigningRequest());
            const request: ICreateSigningSessionRequest = {
                signingRequestId: signingRequest.signingRequestId,
                signerId: signingRequest.signers[0].signerId,
            };

            // act
            const result = await provider.createSigningSession(request);

            // assert
            expect(result.sessionId).toBeDefined();
            expect(result.signingUrl).toMatch(/^internal:\/\/sign\//);
            expect(result.signingRequestId).toBe(signingRequest.signingRequestId);
            expect(result.signerId).toBe(signingRequest.signers[0].signerId);
        });

        it('should include the returnUrl in the signing URL when provided', async () => {
            // arrange
            const signingRequest = await provider.createSigningRequest(createDefaultSigningRequest());
            const request: ICreateSigningSessionRequest = {
                signingRequestId: signingRequest.signingRequestId,
                signerId: signingRequest.signers[0].signerId,
                returnUrl: 'https://app.example.com/done',
            };

            // act
            const result = await provider.createSigningSession(request);

            // assert
            expect(result.signingUrl).toContain('returnUrl=');
            expect(result.signingUrl).toContain(encodeURIComponent('https://app.example.com/done'));
        });

        it('should set session expiry to 30 minutes', async () => {
            // arrange
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
            const signingRequest = await provider.createSigningRequest(createDefaultSigningRequest());
            const request: ICreateSigningSessionRequest = {
                signingRequestId: signingRequest.signingRequestId,
                signerId: signingRequest.signers[0].signerId,
            };

            // act
            const result = await provider.createSigningSession(request);

            // assert
            expect(result.expiresAt).toEqual(new Date('2026-01-01T12:30:00Z'));
            vi.useRealTimers();
        });

        it('should throw when the signing request does not exist', async () => {
            // arrange
            const request: ICreateSigningSessionRequest = {
                signingRequestId: 'nonexistent-id',
                signerId: 'signer-001',
            };

            // act & assert
            await expect(provider.createSigningSession(request)).rejects.toThrow(SigningRequestNotFoundError);
        });

        it('should throw when the signer does not exist in the signing request', async () => {
            // arrange
            const signingRequest = await provider.createSigningRequest(createDefaultSigningRequest());
            const request: ICreateSigningSessionRequest = {
                signingRequestId: signingRequest.signingRequestId,
                signerId: 'nonexistent-signer',
            };

            // act & assert
            await expect(provider.createSigningSession(request)).rejects.toThrow(SigningRequestNotFoundError);
        });
    });

    // #endregion

    // #region getSigningRequest

    describe('getSigningRequest', () => {
        it('should return the signing request with current status', async () => {
            // arrange
            const created = await provider.createSigningRequest(createDefaultSigningRequest());

            // act
            const result = await provider.getSigningRequest(created.signingRequestId);

            // assert
            expect(result.signingRequestId).toBe(created.signingRequestId);
            expect(result.status).toBe(SigningRequestStatuses.Sent);
            expect(result.subject).toBe('NDA Agreement');
        });

        it('should throw when the signing request does not exist', async () => {
            // act & assert
            await expect(provider.getSigningRequest('nonexistent-id')).rejects.toThrow(SigningRequestNotFoundError);
        });

        it('should reflect a cancelled status after cancellation', async () => {
            // arrange
            const created = await provider.createSigningRequest(createDefaultSigningRequest());
            await provider.cancelSigningRequest(created.signingRequestId);

            // act
            const result = await provider.getSigningRequest(created.signingRequestId);

            // assert
            expect(result.status).toBe(SigningRequestStatuses.Cancelled);
        });
    });

    // #endregion

    // #region getSignedDocuments

    describe('getSignedDocuments', () => {
        it('should return signed documents with content buffers', async () => {
            // arrange
            const created = await provider.createSigningRequest(createMultiDocumentSigningRequest());

            // act
            const result = await provider.getSignedDocuments(created.signingRequestId);

            // assert
            expect(result).toHaveLength(2);
            expect(result[0].documentId).toBe(created.documents[0].documentId);
            expect(result[0].signingRequestId).toBe(created.signingRequestId);
            expect(result[0].name).toBe('contract.pdf');
            expect(result[0].content).toBeInstanceOf(Buffer);
            expect(result[0].content.toString()).toBe('contract');
            expect(result[0].sizeInBytes).toBe(Buffer.from('contract').length);
        });

        it('should throw when the signing request does not exist', async () => {
            // act & assert
            await expect(provider.getSignedDocuments('nonexistent-id')).rejects.toThrow(SigningRequestNotFoundError);
        });
    });

    // #endregion

    // #region cancelSigningRequest

    describe('cancelSigningRequest', () => {
        it('should update the status to cancelled', async () => {
            // arrange
            const created = await provider.createSigningRequest(createDefaultSigningRequest());

            // act
            await provider.cancelSigningRequest(created.signingRequestId, 'No longer needed');

            // assert
            const result = await provider.getSigningRequest(created.signingRequestId);
            expect(result.status).toBe(SigningRequestStatuses.Cancelled);
        });

        it('should throw when the signing request does not exist', async () => {
            // act & assert
            await expect(provider.cancelSigningRequest('nonexistent-id')).rejects.toThrow(SigningRequestNotFoundError);
        });
    });

    // #endregion

    // #region verifyWebhook

    describe('verifyWebhook', () => {
        it('should throw WebhookVerificationError because internal provider does not support webhooks', async () => {
            // act & assert
            await expect(provider.verifyWebhook('payload', 'signature')).rejects.toThrow(WebhookVerificationError);
        });

        it('should include a descriptive error message', async () => {
            // act & assert
            await expect(provider.verifyWebhook('payload', 'signature')).rejects.toThrow('Internal provider does not support external webhooks.');
        });
    });

    // #endregion

    // #region completeSigner

    describe('completeSigner', () => {
        it('should transition the signing request to in-progress when one signer completes', async () => {
            // arrange
            const created = await provider.createSigningRequest(createDefaultSigningRequest());

            // act
            await provider.completeSigner(created.signingRequestId, created.signers[0].signerId);

            // assert
            const result = await provider.getSigningRequest(created.signingRequestId);
            expect(result.status).toBe(SigningRequestStatuses.InProgress);
        });

        it('should transition the signing request to completed when all signers complete', async () => {
            // arrange
            const created = await provider.createSigningRequest(createDefaultSigningRequest());

            // act
            await provider.completeSigner(created.signingRequestId, created.signers[0].signerId);
            await provider.completeSigner(created.signingRequestId, created.signers[1].signerId);

            // assert
            const result = await provider.getSigningRequest(created.signingRequestId);
            expect(result.status).toBe(SigningRequestStatuses.Completed);
        });

        it('should remain in-progress when the same signer completes twice', async () => {
            // arrange
            const created = await provider.createSigningRequest(createDefaultSigningRequest());

            // act
            await provider.completeSigner(created.signingRequestId, created.signers[0].signerId);
            await provider.completeSigner(created.signingRequestId, created.signers[0].signerId);

            // assert
            const result = await provider.getSigningRequest(created.signingRequestId);
            expect(result.status).toBe(SigningRequestStatuses.InProgress);
        });

        it('should throw when the signing request does not exist', async () => {
            // act & assert
            await expect(provider.completeSigner('nonexistent-id', 'signer-001')).rejects.toThrow(SigningRequestNotFoundError);
        });

        it('should complete immediately for a single-signer request', async () => {
            // arrange
            const request: ICreateSigningRequest = {
                subject: 'Solo Sign',
                documents: [{ name: 'doc.pdf', contentType: 'application/pdf', content: Buffer.from('pdf'), order: 1 }],
                signers: [{ email: 'solo@example.com', name: 'Solo', role: 'signer', order: 1 }],
            };
            const created = await provider.createSigningRequest(request);

            // act
            await provider.completeSigner(created.signingRequestId, created.signers[0].signerId);

            // assert
            const result = await provider.getSigningRequest(created.signingRequestId);
            expect(result.status).toBe(SigningRequestStatuses.Completed);
        });
    });

    // #endregion
});
