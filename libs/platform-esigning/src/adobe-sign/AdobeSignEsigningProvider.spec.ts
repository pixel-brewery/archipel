// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SigningProviderError } from '../errors/SigningProviderError.js';
import { WebhookVerificationError } from '../errors/WebhookVerificationError.js';
import type { ICreateSigningRequest } from '../models/ICreateSigningRequest.js';
import { SigningRequestStatuses } from '../models/SigningRequestStatus.js';
import { WebhookEventTypes } from '../models/WebhookEventType.js';
import { AdobeSignEsigningProvider } from './AdobeSignEsigningProvider.js';
import { ADOBE_SIGN_BASE_URL, ADOBE_SIGN_INTEGRATION_KEY, ADOBE_SIGN_WEBHOOK_CLIENT_ID } from './env.js';

// #endregion

// #region Helpers

function createMockConfigService(overrides: Record<string, string> = {}): ConfigService {
    const values: Record<string, string> = {
        [ADOBE_SIGN_BASE_URL.key]: 'https://api.adobesign.com',
        [ADOBE_SIGN_INTEGRATION_KEY.key]: 'test-integration-key',
        [ADOBE_SIGN_WEBHOOK_CLIENT_ID.key]: '',
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
        message: 'Please review and sign.',
        documents: [{ name: 'nda.pdf', contentType: 'application/pdf', content: Buffer.from('nda-content'), order: 1 }],
        signers: [{ email: 'alice@example.com', name: 'Alice', role: 'signer', order: 1 }],
    };
}

function createFetchResponse(body: unknown, status = 200): Response {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(JSON.stringify(body)),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    } as unknown as Response;
}

// #endregion

describe('AdobeSignEsigningProvider', () => {
    // #region Fields

    let provider: AdobeSignEsigningProvider;
    let configService: ConfigService;

    // #endregion

    // #region Setup

    beforeEach(() => {
        configService = createMockConfigService();
        provider = new AdobeSignEsigningProvider(configService);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // #endregion

    // #region providerId

    describe('providerId', () => {
        it('should return adobe-sign as the provider identifier', () => {
            // act
            const result = provider.providerId;

            // assert
            expect(result).toBe('adobe-sign');
        });
    });

    // #endregion

    // #region createSigningRequest

    describe('createSigningRequest', () => {
        it('should upload transient document and create agreement', async () => {
            // arrange
            const request = createDefaultSigningRequest();
            const transientDocResponse = createFetchResponse({ transientDocumentId: 'trans-doc-123' });
            const agreementResponse = createFetchResponse({ id: 'agreement-456' });
            const getAgreementResponse = createFetchResponse({
                id: 'agreement-456',
                name: 'NDA Agreement',
                message: 'Please review and sign.',
                status: 'OUT_FOR_SIGNATURE',
                createdDate: '2026-01-01T00:00:00Z',
                modifiedDate: '2026-01-01T00:00:00Z',
                participantSetsInfo: [
                    {
                        memberInfos: [{ id: 'signer-1', email: 'alice@example.com', name: 'Alice', status: 'WAITING_FOR_MY_SIGNATURE' }],
                        role: 'SIGNER',
                        order: 1,
                    },
                ],
            });
            const documentsResponse = createFetchResponse({
                documents: [{ id: 'doc-1', label: 'nda.pdf', mimeType: 'application/pdf', numPages: 1 }],
            });
            const fetchSpy = vi
                .spyOn(globalThis, 'fetch')
                .mockResolvedValueOnce(transientDocResponse)
                .mockResolvedValueOnce(agreementResponse)
                .mockResolvedValueOnce(getAgreementResponse)
                .mockResolvedValueOnce(documentsResponse);

            // act
            const result = await provider.createSigningRequest(request);

            // assert
            expect(fetchSpy).toHaveBeenCalledTimes(4);
            expect(result.signingRequestId).toBe('agreement-456');
            expect(result.status).toBe(SigningRequestStatuses.Sent);
            expect(result.subject).toBe('NDA Agreement');
        });

        it('should throw a provider error when the upload fails', async () => {
            // arrange
            const request = createDefaultSigningRequest();
            const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createFetchResponse({ message: 'Bad Request' }, 400));

            // act & assert
            await expect(provider.createSigningRequest(request)).rejects.toThrow(SigningProviderError);
            expect(fetchSpy).toHaveBeenCalledTimes(1);
        });
    });

    // #endregion

    // #region getSigningRequest

    describe('getSigningRequest', () => {
        it('should return a normalized signing request', async () => {
            // arrange
            const getAgreementResponse = createFetchResponse({
                id: 'agreement-789',
                name: 'Contract',
                status: 'SIGNED',
                createdDate: '2026-01-01T00:00:00Z',
                modifiedDate: '2026-01-02T00:00:00Z',
                participantSetsInfo: [],
            });
            const documentsResponse = createFetchResponse({
                documents: [],
            });
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(getAgreementResponse).mockResolvedValueOnce(documentsResponse);

            // act
            const result = await provider.getSigningRequest('agreement-789');

            // assert
            expect(result.signingRequestId).toBe('agreement-789');
            expect(result.status).toBe(SigningRequestStatuses.Completed);
        });
    });

    // #endregion

    // #region verifyWebhook

    describe('verifyWebhook', () => {
        it('should verify webhook when client ID matches', async () => {
            // arrange
            const config = createMockConfigService({
                [ADOBE_SIGN_WEBHOOK_CLIENT_ID.key]: 'my-client-id',
            });
            const webhookProvider = new AdobeSignEsigningProvider(config);
            const payload = JSON.stringify({
                webhookId: 'wh-1',
                webhookUrlInfo: { url: 'https://hook.example.com' },
                event: 'AGREEMENT_ALL_SIGNED',
                eventDate: '2026-01-01T00:00:00Z',
                agreement: { id: 'agreement-001' },
            });
            const headers = { 'x-adobesign-clientid': 'my-client-id' };

            // act
            const result = await webhookProvider.verifyWebhook(payload, '', headers);

            // assert
            expect(result.eventType).toBe(WebhookEventTypes.SigningRequestCompleted);
            expect(result.signingRequestId).toBe('agreement-001');
        });

        it('should throw when client ID does not match', async () => {
            // arrange
            const config = createMockConfigService({
                [ADOBE_SIGN_WEBHOOK_CLIENT_ID.key]: 'my-client-id',
            });
            const webhookProvider = new AdobeSignEsigningProvider(config);
            const payload = JSON.stringify({
                webhookId: 'wh-1',
                event: 'AGREEMENT_ALL_SIGNED',
                eventDate: '2026-01-01T00:00:00Z',
                agreement: { id: 'agreement-001' },
            });
            const headers = { 'x-adobesign-clientid': 'wrong-id' };

            // act & assert
            await expect(webhookProvider.verifyWebhook(payload, '', headers)).rejects.toThrow(WebhookVerificationError);
        });
    });

    // #endregion
});
