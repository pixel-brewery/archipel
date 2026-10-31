// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SigningProviderError } from '../errors/SigningProviderError.js';
import { WebhookVerificationError } from '../errors/WebhookVerificationError.js';
import type { ICreateSigningRequest } from '../models/ICreateSigningRequest.js';
import { SignerStatuses } from '../models/SignerStatus.js';
import { SigningRequestStatuses } from '../models/SigningRequestStatus.js';
import { WebhookEventTypes } from '../models/WebhookEventType.js';
import { DocuSignEsigningProvider } from './DocuSignEsigningProvider.js';
import { DOCUSIGN_ACCOUNT_ID, DOCUSIGN_BASE_URL, DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_WEBHOOK_HMAC_KEY } from './env.js';

// #endregion

// #region SDK mocks

const mockEnvelopesApi = {
    createEnvelope: vi.fn(),
    getEnvelope: vi.fn(),
    createRecipientView: vi.fn(),
    listDocuments: vi.fn(),
    getDocument: vi.fn(),
    update: vi.fn(),
};

// #endregion

// #region Helpers

function createMockConfigService(overrides: Record<string, string> = {}): ConfigService {
    const values: Record<string, string> = {
        [DOCUSIGN_BASE_URL.key]: 'https://demo.docusign.net',
        [DOCUSIGN_INTEGRATION_KEY.key]: 'test-access-token',
        [DOCUSIGN_ACCOUNT_ID.key]: 'account-123',
        [DOCUSIGN_WEBHOOK_HMAC_KEY.key]: '',
        ...overrides,
    };

    return {
        get: vi.fn((key: string) => {
            if (key in values) {
                return values[key];
            }
            throw new Error(`Config key not found: ${key}`);
        }),
        tryGet: vi.fn((key: string, fallback: unknown) => values[key] ?? fallback),
    } as unknown as ConfigService;
}

function createDefaultSigningRequest(): ICreateSigningRequest {
    return {
        subject: 'Contract Agreement',
        message: 'Please sign this contract.',
        documents: [{ name: 'contract.pdf', contentType: 'application/pdf', content: Buffer.from('contract-data'), order: 1 }],
        signers: [
            { email: 'alice@example.com', name: 'Alice', role: 'signer', order: 1 },
            { email: 'bob@example.com', name: 'Bob', role: 'signer', order: 2 },
        ],
    };
}

// #endregion

describe('DocuSignEsigningProvider', () => {
    // #region Fields

    let provider: DocuSignEsigningProvider;
    let configService: ConfigService;

    // #endregion

    // #region Setup

    beforeEach(() => {
        vi.restoreAllMocks();
        mockEnvelopesApi.createEnvelope.mockReset();
        mockEnvelopesApi.getEnvelope.mockReset();
        mockEnvelopesApi.createRecipientView.mockReset();
        mockEnvelopesApi.listDocuments.mockReset();
        mockEnvelopesApi.getDocument.mockReset();
        mockEnvelopesApi.update.mockReset();
        configService = createMockConfigService();
        provider = new DocuSignEsigningProvider(configService);
        Object.defineProperty(provider, '_envelopesApi', { value: mockEnvelopesApi, writable: true });
    });

    // #endregion

    // #region providerId

    describe('providerId', () => {
        it('should return docusign as the provider identifier', () => {
            // act
            const result = provider.providerId;

            // assert
            expect(result).toBe('docusign');
        });
    });

    // #endregion

    // #region createSigningRequest

    describe('createSigningRequest', () => {
        it('should create an envelope and return a normalized signing request', async () => {
            // arrange
            const request = createDefaultSigningRequest();
            mockEnvelopesApi.createEnvelope.mockResolvedValueOnce({ envelopeId: 'env-001' });
            mockEnvelopesApi.getEnvelope.mockResolvedValueOnce({
                envelopeId: 'env-001',
                emailSubject: 'Contract Agreement',
                status: 'sent',
                createdDateTime: '2026-01-01T00:00:00Z',
                lastModifiedDateTime: '2026-01-01T00:00:00Z',
                recipients: {
                    signers: [
                        { recipientId: 'r-1', email: 'alice@example.com', name: 'Alice', status: 'sent', routingOrder: '1' },
                        { recipientId: 'r-2', email: 'bob@example.com', name: 'Bob', status: 'sent', routingOrder: '2' },
                    ],
                    carbonCopies: [],
                },
                envelopeDocuments: [{ documentId: 'doc-1', name: 'contract.pdf', type: 'content', pages: [{ pageId: '1' }] }],
            });

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(mockEnvelopesApi.createEnvelope).toHaveBeenCalledTimes(1);
            expect(mockEnvelopesApi.getEnvelope).toHaveBeenCalledTimes(1);
            expect(result.signingRequestId).toBe('env-001');
            expect(result.status).toBe(SigningRequestStatuses.Sent);
            expect(result.signers).toHaveLength(2);
            expect(result.signers[0].email).toBe('alice@example.com');
            expect(result.signers[0].status).toBe(SignerStatuses.Sent);
        });

        it('should throw a provider error when envelope creation fails', async () => {
            // arrange
            const request = createDefaultSigningRequest();
            mockEnvelopesApi.createEnvelope.mockRejectedValueOnce(new Error('Forbidden'));

            // act & assert
            await expect(provider.createSigningRequest(request)).rejects.toThrow(SigningProviderError);
        });
    });

    // #endregion

    // #region getSigningRequest

    describe('getSigningRequest', () => {
        it('should return a completed signing request when status is completed', async () => {
            // arrange
            mockEnvelopesApi.getEnvelope.mockResolvedValueOnce({
                envelopeId: 'env-002',
                emailSubject: 'Completed Contract',
                status: 'completed',
                createdDateTime: '2026-01-01T00:00:00Z',
                lastModifiedDateTime: '2026-01-02T00:00:00Z',
                recipients: { signers: [], carbonCopies: [] },
                envelopeDocuments: [],
            });

            // act
            const result = await provider.getSigningRequest('env-002');

            // assert
            expect(result.signingRequestId).toBe('env-002');
            expect(result.status).toBe(SigningRequestStatuses.Completed);
        });
    });

    // #endregion

    // #region verifyWebhook

    describe('verifyWebhook', () => {
        it('should parse a valid webhook without HMAC verification', async () => {
            // arrange
            const payload = JSON.stringify({
                event: 'envelope-completed',
                apiVersion: 'v2.1',
                uri: '/restapi/v2.1/accounts/account-123/envelopes/env-001',
                retryCount: 0,
                configurationId: 0,
                generatedDateTime: '2026-01-01T00:00:00Z',
                data: {
                    envelopeId: 'env-001',
                    accountId: 'account-123',
                    recipientId: 'r-1',
                },
            });

            // act
            const result = await provider.verifyWebhook(payload, '');

            // assert
            expect(result.eventType).toBe(WebhookEventTypes.SigningRequestCompleted);
            expect(result.signingRequestId).toBe('env-001');
        });

        it('should throw when HMAC verification fails', async () => {
            // arrange
            const config = createMockConfigService({
                [DOCUSIGN_WEBHOOK_HMAC_KEY.key]: 'super-secret-key',
            });
            const webhookProvider = new DocuSignEsigningProvider(config);
            const payload = JSON.stringify({
                event: 'envelope-completed',
                data: { envelopeId: 'env-001' },
            });

            // act & assert
            await expect(
                webhookProvider.verifyWebhook(payload, 'invalid-signature', {
                    'x-docusign-signature-1': 'invalid-signature',
                }),
            ).rejects.toThrow(WebhookVerificationError);
        });
    });

    // #endregion

    // #region cancelSigningRequest

    describe('cancelSigningRequest', () => {
        it('should void the envelope via SDK', async () => {
            // arrange
            mockEnvelopesApi.update.mockResolvedValueOnce({});

            // act
            await provider.cancelSigningRequest('env-003', 'Cancelled by user');

            // assert
            expect(mockEnvelopesApi.update).toHaveBeenCalledTimes(1);
            expect(mockEnvelopesApi.update).toHaveBeenCalledWith('account-123', 'env-003', expect.objectContaining({ envelope: expect.any(Object) }));
        });
    });

    // #endregion

    // #region getSignedDocuments

    describe('getSignedDocuments', () => {
        it('should download documents from the envelope', async () => {
            // arrange
            mockEnvelopesApi.listDocuments.mockResolvedValueOnce({
                envelopeDocuments: [{ documentId: 'doc-1', name: 'contract.pdf', type: 'content' }],
            });
            mockEnvelopesApi.getDocument.mockResolvedValueOnce(Buffer.from('pdf-content'));

            // act
            const result = await provider.getSignedDocuments('env-004');

            // assert
            expect(result).toHaveLength(1);
            expect(result[0].documentId).toBe('doc-1');
            expect(result[0].name).toBe('contract.pdf');
            expect(result[0].contentType).toBe('application/pdf');
        });
    });

    // #endregion

    // #region createSigningSession

    describe('createSigningSession', () => {
        it('should create a recipient view and return a signing session', async () => {
            // arrange
            mockEnvelopesApi.getEnvelope.mockResolvedValueOnce({
                recipients: {
                    signers: [{ recipientId: 'r-1', email: 'alice@example.com', name: 'Alice', status: 'sent', routingOrder: '1' }],
                    carbonCopies: [],
                },
            });
            mockEnvelopesApi.createRecipientView.mockResolvedValueOnce({
                url: 'https://docusign.com/sign/env-001',
            });

            // act
            const result = await provider.createSigningSession({
                signingRequestId: 'env-001',
                signerId: 'r-1',
                returnUrl: 'https://myapp.com/done',
            });

            // assert
            expect(result.signingUrl).toBe('https://docusign.com/sign/env-001');
            expect(result.signingRequestId).toBe('env-001');
            expect(result.signerId).toBe('r-1');
        });
    });

    // #endregion
});
