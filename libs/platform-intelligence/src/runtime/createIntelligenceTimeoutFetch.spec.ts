// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isRetryableIntelligenceProviderError } from '../providers/isRetryableIntelligenceProviderError.js';
import { createIntelligenceTimeoutFetch } from './createIntelligenceTimeoutFetch.js';

// #endregion

// #region Tests

describe('createIntelligenceTimeoutFetch', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal(
            'fetch',
            vi.fn(
                async (_input: unknown, init?: RequestInit): Promise<Response> =>
                    new Promise<Response>((_resolve, reject) => {
                        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true });
                    }),
            ),
        );
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('should reject a provider request that exceeds its budget with a retryable timeout', async () => {
        // arrange
        const failure = createIntelligenceTimeoutFetch(50)('https://provider.test/v1/responses').catch((error: unknown) => error);

        // act
        await vi.advanceTimersByTimeAsync(50);

        // assert
        const timeout = await failure;
        expect(timeout).toMatchObject({ name: 'TimeoutError', message: 'Provider request timed out after 50ms.' });
        expect(isRetryableIntelligenceProviderError(timeout)).toBe(true);
    });
});

// #endregion
