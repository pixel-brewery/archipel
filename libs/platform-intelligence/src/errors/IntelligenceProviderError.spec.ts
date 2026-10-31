// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderError } from './IntelligenceProviderError.js';

// #endregion

// #region Tests

describe('IntelligenceProviderError', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should set name to IntelligenceProviderError', () => {
        // arrange / act
        const error = new IntelligenceProviderError('call failed', 'openai', 'gpt-4', false);

        // assert
        expect(error.name).toBe('IntelligenceProviderError');
    });

    it('should expose a machine-readable provider error code', () => {
        // arrange / act
        const error = new IntelligenceProviderError('call failed', 'openai', 'gpt-4', false);

        // assert
        expect(error.code).toBe('INTELLIGENCE_PROVIDER');
    });

    it('should store provider and model', () => {
        // arrange / act
        const error = new IntelligenceProviderError('call failed', 'anthropic', 'claude-3', true);

        // assert
        expect(error.provider).toBe('anthropic');
        expect(error.model).toBe('claude-3');
    });

    it('should store isRetryable flag', () => {
        // arrange / act
        const retryable = new IntelligenceProviderError('rate limit', 'openai', 'gpt-4', true);
        const nonRetryable = new IntelligenceProviderError('bad key', 'openai', 'gpt-4', false);

        // assert
        expect(retryable.isRetryable).toBe(true);
        expect(nonRetryable.isRetryable).toBe(false);
    });

    it('should set cause when provided', () => {
        // arrange
        const cause = new Error('upstream');

        // act
        const error = new IntelligenceProviderError('call failed', 'openai', 'gpt-4', false, cause);

        // assert
        expect(error.cause).toBe(cause);
    });

    it('should not set cause when not provided', () => {
        // arrange / act
        const error = new IntelligenceProviderError('call failed', 'openai', 'gpt-4', false);

        // assert
        expect(error.cause).toBeUndefined();
    });

    it('should be an instance of Error', () => {
        // arrange / act
        const error = new IntelligenceProviderError('test', 'openai', 'gpt-4', false);

        // assert
        expect(error).toBeInstanceOf(Error);
    });
});

// #endregion
