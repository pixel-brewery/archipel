// #region Imports

import { APICallError } from '@ai-sdk/provider';
import { RetryError } from 'ai';
import { describe, expect, it } from 'vitest';
import { isRetryableIntelligenceProviderError } from './isRetryableIntelligenceProviderError.js';

// #endregion

// #region Tests

describe('isRetryableIntelligenceProviderError', () => {
    function createHttpFailure(statusCode: number, message = 'Provider request failed'): APICallError {
        return new APICallError({ message, url: 'https://provider.test/v1/responses', requestBodyValues: {}, statusCode });
    }

    function createNetworkFailure(code: string): TypeError {
        return new TypeError('fetch failed', { cause: Object.assign(new Error('socket failure'), { code }) });
    }

    it('should treat a timed-out provider request as retryable', () => {
        // arrange
        const timeout = new DOMException('The operation was aborted due to timeout', 'TimeoutError');

        // act
        const retryable = isRetryableIntelligenceProviderError(timeout);

        // assert
        expect(retryable).toBe(true);
    });

    it('should treat an aborted provider request as retryable', () => {
        // arrange
        const abort = new DOMException('Delay was aborted', 'AbortError');

        // act
        const retryable = isRetryableIntelligenceProviderError(abort);

        // assert
        expect(retryable).toBe(true);
    });

    it.each([
        'ETIMEDOUT',
        'ECONNRESET',
        'ECONNREFUSED',
        'ECONNABORTED',
        'EPIPE',
        'EAI_AGAIN',
        'UND_ERR_CONNECT_TIMEOUT',
        'UND_ERR_HEADERS_TIMEOUT',
        'UND_ERR_SOCKET',
    ])('should treat a transport failure with the network code %s as retryable', (code) => {
        // arrange
        const failure = createNetworkFailure(code);

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(true);
    });

    it('should treat a transport failure that the provider SDK wrapped as retryable', () => {
        // arrange
        const networkFailure = Object.assign(new Error('connect ECONNRESET'), { code: 'ECONNRESET' });
        const failure = new APICallError({
            message: 'Cannot connect to API: connect ECONNRESET',
            url: 'https://provider.test/v1/responses',
            requestBodyValues: {},
            cause: networkFailure,
            isRetryable: true,
        });

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(true);
    });

    it.each([408, 429, 500, 502, 503, 504, 529])('should treat a provider response with HTTP %i as retryable', (statusCode) => {
        // arrange
        const failure = createHttpFailure(statusCode);

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(true);
    });

    it('should honor the provider SDK retry decision for a conflict response', () => {
        // arrange
        const failure = createHttpFailure(409);

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(failure.isRetryable).toBe(true);
        expect(retryable).toBe(true);
    });

    it('should honor a provider SDK decision to stop retrying a server response', () => {
        // arrange
        const failure = new APICallError({
            message: 'Do not retry this response',
            url: 'https://provider.test/v1/responses',
            requestBodyValues: {},
            statusCode: 503,
            isRetryable: false,
        });

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(false);
    });

    it('should honor a retryable SDK transport failure without an HTTP status', () => {
        // arrange
        const failure = new APICallError({
            message: 'Provider connection failed',
            url: 'https://provider.test/v1/responses',
            requestBodyValues: {},
            isRetryable: true,
        });

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(true);
    });

    it('should read the HTTP status of provider errors that expose it as status', () => {
        // arrange
        const failure = Object.assign(new Error('Service Unavailable'), { status: 503 });

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(true);
    });

    it.each([400, 401, 403, 404, 422])('should treat a provider response with HTTP %i as permanent', (statusCode) => {
        // arrange
        const failure = createHttpFailure(statusCode);

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(false);
    });

    it('should ignore status numbers in the provider message', () => {
        // arrange
        const failure = createHttpFailure(400, 'max_tokens must not exceed 500; received 503 (429 remaining)');

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(false);
    });

    it('should treat exhausted retries of a transient failure as retryable', () => {
        // arrange
        const failure = new RetryError({
            message: 'Failed after 3 attempts. Last error: Service Unavailable',
            reason: 'maxRetriesExceeded',
            errors: [createHttpFailure(503), createHttpFailure(503), createHttpFailure(503)],
        });

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(true);
    });

    it('should decide a failed retry by its last attempt', () => {
        // arrange
        const failure = new RetryError({
            message: "Failed after 2 attempts with non-retryable error: 'Bad Request'",
            reason: 'errorNotRetryable',
            errors: [createHttpFailure(429), createHttpFailure(400)],
        });

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(false);
    });

    it('should treat a failure without a transient type, code, or status as permanent', () => {
        // arrange
        const failure = new Error('The provider rejected the request.');

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(false);
    });

    it('should stop at a cause chain that refers back to itself', () => {
        // arrange
        const failure = new Error('The provider rejected the request.');
        failure.cause = failure;

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(false);
    });

    it.each([undefined, null, 'timeout', 503])('should treat the non-error value %s as permanent', (value) => {
        // arrange
        const failure: unknown = value;

        // act
        const retryable = isRetryableIntelligenceProviderError(failure);

        // assert
        expect(retryable).toBe(false);
    });
});

// #endregion
