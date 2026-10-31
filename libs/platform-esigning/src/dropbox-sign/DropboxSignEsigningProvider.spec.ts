// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SigningProviderError } from '../errors/SigningProviderError.js';
import { WebhookVerificationError } from '../errors/WebhookVerificationError.js';
import type { ICreateSigningRequest } from '../models/ICreateSigningRequest.js';
import type { ICreateSigningSessionRequest } from '../models/ICreateSigningSessionRequest.js';
import { SignerStatuses } from '../models/SignerStatus.js';
import { SigningRequestStatuses } from '../models/SigningRequestStatus.js';
import { WebhookEventTypes } from '../models/WebhookEventType.js';
import { DropboxSignEsigningProvider } from './DropboxSignEsigningProvider.js';
import { DROPBOX_SIGN_API_KEY, DROPBOX_SIGN_CLIENT_ID, DROPBOX_SIGN_WEBHOOK_SECRET } from './env.js';

// #endregion

// #region Helpers

function createMockConfigService(overrides: Record<string, string> = {}): ConfigService {
    const values: Record<string, string> = {
        [DROPBOX_SIGN_API_KEY.key]: 'test-api-key',
        [DROPBOX_SIGN_CLIENT_ID.key]: 'test-client-id',
        [DROPBOX_SIGN_WEBHOOK_SECRET.key]: '',
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
        subject: 'NDA Agreement',
        message: 'Please sign the NDA.',
        documents: [{ name: 'nda.pdf', contentType: 'application/pdf', content: Buffer.from('nda-content'), order: 1 }],
        signers: [{ email: 'alice@example.com', name: 'Alice', role: 'signer', order: 1 }],
    };
}

function createSignatureRequestResponse(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        signatureRequestId: 'sig-req-001',
        title: 'NDA Agreement',
        message: 'Please sign the NDA.',
        isComplete: false,
        isDeclined: false,
        hasError: false,
        createdAt: 1735689600,
        testMode: false,
        signatures: [
            {
                signatureId: 'sig-001',
                signerEmailAddress: 'alice@example.com',
                signerName: 'Alice',
                signerRole: 'signer',
                order: 1,
                statusCode: 'awaiting_signature',
            },
        ],
        ...overrides,
    };
}

function createMockSignatureRequestApi(): Record<string, ReturnType<typeof vi.fn>> {
    return {
        setApiKey: vi.fn(),
        signatureRequestCreateEmbedded: vi.fn(),
        signatureRequestGet: vi.fn(),
        signatureRequestFiles: vi.fn(),
        signatureRequestCancel: vi.fn(),
    };
}

function createMockEmbeddedApi(): Record<string, ReturnType<typeof vi.fn>> {
    return {
        setApiKey: vi.fn(),
        embeddedSignUrl: vi.fn(),
    };
}

// #endregion

describe('DropboxSignEsigningProvider', () => {
    // #region Fields

    let provider: DropboxSignEsigningProvider;
    let configService: ConfigService;
    let mockSignatureRequestApi: Record<string, ReturnType<typeof vi.fn>>;
    let mockEmbeddedApi: Record<string, ReturnType<typeof vi.fn>>;

    // #endregion

    // #region Setup

    beforeEach(() => {
        vi.restoreAllMocks();
        configService = createMockConfigService();
        provider = new DropboxSignEsigningProvider(configService);

        mockSignatureRequestApi = createMockSignatureRequestApi();
        mockEmbeddedApi = createMockEmbeddedApi();

        Object.defineProperty(provider, '_signatureRequestApi', { value: mockSignatureRequestApi, writable: true });
        Object.defineProperty(provider, '_embeddedApi', { value: mockEmbeddedApi, writable: true });
    });

    // #endregion

    // #region providerId

    describe('providerId', () => {
        it('should return dropbox-sign as the provider identifier', () => {
            // act
            const result = provider.providerId;

            // assert
            expect(result).toBe('dropbox-sign');
        });
    });

    // #endregion

    // #region createSigningRequest

    describe('createSigningRequest', () => {
        it('should create an embedded signature request via SDK', async () => {
            // arrange
            const request = createDefaultSigningRequest();
            mockSignatureRequestApi.signatureRequestCreateEmbedded.mockResolvedValueOnce({
                body: { signatureRequest: createSignatureRequestResponse() },
            });

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(mockSignatureRequestApi.signatureRequestCreateEmbedded).toHaveBeenCalledTimes(1);
            expect(result.signingRequestId).toBe('sig-req-001');
            expect(result.status).toBe(SigningRequestStatuses.Sent);
            expect(result.subject).toBe('NDA Agreement');
            expect(result.signers).toHaveLength(1);
            expect(result.signers[0].email).toBe('alice@example.com');
            expect(result.signers[0].status).toBe(SignerStatuses.Delivered);
        });

        it('should throw a provider error when the SDK throws', async () => {
            // arrange
            const request = createDefaultSigningRequest();
            mockSignatureRequestApi.signatureRequestCreateEmbedded.mockRejectedValueOnce(new Error('SDK error'));

            // act & assert
            await expect(provider.createSigningRequest(request)).rejects.toThrow(SigningProviderError);
        });
    });

    // #endregion

    // #region getSigningRequest

    describe('getSigningRequest', () => {
        it('should return a completed request when all signers have signed', async () => {
            // arrange
            mockSignatureRequestApi.signatureRequestGet.mockResolvedValueOnce({
                body: {
                    signatureRequest: createSignatureRequestResponse({
                        isComplete: true,
                        signatures: [
                            {
                                signatureId: 'sig-001',
                                signerEmailAddress: 'alice@example.com',
                                signerName: 'Alice',
                                order: 1,
                                statusCode: 'signed',
                            },
                        ],
                    }),
                },
            });

            // act
            const result = await provider.getSigningRequest('sig-req-001');

            // assert
            expect(result.status).toBe(SigningRequestStatuses.Completed);
            expect(result.signers[0].status).toBe(SignerStatuses.Signed);
        });

        it('should return a declined request when a signer has declined', async () => {
            // arrange
            mockSignatureRequestApi.signatureRequestGet.mockResolvedValueOnce({
                body: {
                    signatureRequest: createSignatureRequestResponse({
                        isDeclined: true,
                        signatures: [
                            {
                                signatureId: 'sig-001',
                                signerEmailAddress: 'alice@example.com',
                                signerName: 'Alice',
                                order: 1,
                                statusCode: 'declined',
                            },
                        ],
                    }),
                },
            });

            // act
            const result = await provider.getSigningRequest('sig-req-001');

            // assert
            expect(result.status).toBe(SigningRequestStatuses.Declined);
            expect(result.signers[0].status).toBe(SignerStatuses.Declined);
        });
    });

    // #endregion

    // #region createSigningSession

    describe('createSigningSession', () => {
        it('should return a signing session with an embedded URL', async () => {
            // arrange
            mockSignatureRequestApi.signatureRequestGet.mockResolvedValueOnce({
                body: { signatureRequest: createSignatureRequestResponse() },
            });
            mockEmbeddedApi.embeddedSignUrl.mockResolvedValueOnce({
                body: {
                    embedded: {
                        signUrl: 'https://app.hellosign.com/editor/embeddedSign?signature_id=sig-001',
                        expiresAt: 1735693200,
                    },
                },
            });

            const request: ICreateSigningSessionRequest = {
                signingRequestId: 'sig-req-001',
                signerId: 'sig-001',
            };

            // act
            const result = await provider.createSigningSession(request);

            // assert
            expect(result.signingUrl).toContain('embeddedSign');
            expect(result.signingRequestId).toBe('sig-req-001');
            expect(result.signerId).toBe('sig-001');
        });
    });

    // #endregion

    // #region verifyWebhook

    describe('verifyWebhook', () => {
        it('should parse a valid webhook event without verification', async () => {
            // arrange
            const payload = JSON.stringify({
                event: {
                    event_type: 'signature_request_all_signed',
                    event_time: '2026-01-01T00:00:00Z',
                    event_hash: 'dummy-hash',
                    event_metadata: { related_signature_id: 'sig-001' },
                },
                signature_request: { signature_request_id: 'sig-req-001' },
            });

            // act
            const result = await provider.verifyWebhook(payload, '');

            // assert
            expect(result.eventType).toBe(WebhookEventTypes.SigningRequestCompleted);
            expect(result.signingRequestId).toBe('sig-req-001');
        });

        it('should throw when webhook hash verification fails', async () => {
            // arrange
            const config = createMockConfigService({
                [DROPBOX_SIGN_WEBHOOK_SECRET.key]: 'webhook-secret',
            });
            const webhookProvider = new DropboxSignEsigningProvider(config);
            const payload = JSON.stringify({
                event: {
                    event_type: 'signature_request_all_signed',
                    event_time: '2026-01-01T00:00:00Z',
                    event_hash: 'invalid-hash',
                    event_metadata: {},
                },
            });

            // act & assert
            await expect(webhookProvider.verifyWebhook(payload, '')).rejects.toThrow(WebhookVerificationError);
        });

        it('should verify webhook hash when secret is configured', async () => {
            // arrange
            const apiKey = 'test-api-key';
            const eventTime = '2026-01-01T00:00:00Z';
            const eventType = 'signature_request_sent';
            const expectedHash = createHmac('sha256', apiKey).update(`${eventTime}${eventType}`).digest('hex');

            const config = createMockConfigService({
                [DROPBOX_SIGN_WEBHOOK_SECRET.key]: 'webhook-secret',
            });
            const webhookProvider = new DropboxSignEsigningProvider(config);
            const payload = JSON.stringify({
                event: {
                    event_type: eventType,
                    event_time: eventTime,
                    event_hash: expectedHash,
                    event_metadata: {},
                },
                signature_request: { signature_request_id: 'sig-req-002' },
            });

            // act
            const result = await webhookProvider.verifyWebhook(payload, '');

            // assert
            expect(result.eventType).toBe(WebhookEventTypes.SigningRequestSent);
            expect(result.signingRequestId).toBe('sig-req-002');
        });
    });

    // #endregion

    // #region cancelSigningRequest

    describe('cancelSigningRequest', () => {
        it('should cancel the signature request via SDK', async () => {
            // arrange
            mockSignatureRequestApi.signatureRequestCancel.mockResolvedValueOnce({ response: {}, body: undefined });

            // act
            await provider.cancelSigningRequest('sig-req-001');

            // assert
            expect(mockSignatureRequestApi.signatureRequestCancel).toHaveBeenCalledTimes(1);
            expect(mockSignatureRequestApi.signatureRequestCancel).toHaveBeenCalledWith('sig-req-001');
        });
    });

    // #endregion

    // #region getSignedDocuments

    describe('getSignedDocuments', () => {
        it('should return signed documents from SDK', async () => {
            // arrange
            const pdfBuffer = Buffer.from('fake-pdf-content');
            mockSignatureRequestApi.signatureRequestFiles.mockResolvedValueOnce({
                body: pdfBuffer,
            });

            // act
            const result = await provider.getSignedDocuments('sig-req-001');

            // assert
            expect(result).toHaveLength(1);
            expect(result[0].documentId).toBe('sig-req-001-combined');
            expect(result[0].name).toBe('signed-documents.pdf');
            expect(result[0].contentType).toBe('application/pdf');
            expect(result[0].content).toEqual(pdfBuffer);
        });
    });

    // #endregion
});
