// #region Imports

import { describe, expect, it } from 'vitest';
import { mapIntelligenceUsage } from './mapIntelligenceUsage.js';

// #endregion

describe('mapIntelligenceUsage', () => {
    // #region Methods

    it('should preserve cache and reasoning counters from language model usage', () => {
        // arrange
        const usage = {
            inputTokens: 120,
            inputTokenDetails: {
                noCacheTokens: 80,
                cacheReadTokens: 30,
                cacheWriteTokens: 10,
            },
            outputTokens: 40,
            outputTokenDetails: {
                textTokens: 25,
                reasoningTokens: 15,
            },
            totalTokens: 160,
        };

        // act
        const result = mapIntelligenceUsage(usage);

        // assert
        expect(result).toMatchObject({
            inputTokens: 120,
            outputTokens: 40,
            totalTokens: 160,
            cachedInputTokens: 30,
            cacheWriteInputTokens: 10,
            outputTextTokens: 25,
            reasoningTokens: 15,
        });
    });

    it('should preserve a reported zero while rejecting invalid token counters', () => {
        // arrange
        const usage = {
            inputTokens: 0,
            outputTokens: -1,
            totalTokens: Number.NaN,
        };

        // act
        const result = mapIntelligenceUsage(usage);

        // assert
        expect(result).toMatchObject({
            inputTokens: 0,
            outputTokens: null,
            totalTokens: 0,
        });
    });

    it('should return null when no valid usage dimension was reported', () => {
        // arrange
        const usage = { inputTokens: -1, outputTokens: Number.POSITIVE_INFINITY };

        // act
        const result = mapIntelligenceUsage(usage);

        // assert
        expect(result).toBeNull();
    });

    // #endregion
});
