// #region Imports

import { describe, expect, it } from 'vitest';
import { mapIntelligenceImageUsage } from './mapIntelligenceImageUsage.js';

// #endregion

describe('mapIntelligenceImageUsage', () => {
    // #region Methods

    it('should aggregate provider image metadata into exact modality counters', () => {
        // arrange
        const usage = { inputTokens: 120, outputTokens: 4_096, totalTokens: 4_216 };
        const providerMetadata = {
            openai: {
                images: [
                    { textTokens: 50, imageTokens: 20 },
                    { textTokens: 50, imageTokens: 0 },
                ],
            },
        };

        // act
        const result = mapIntelligenceImageUsage(usage, providerMetadata, true);

        // assert
        expect(result).toMatchObject({
            inputTokens: 120,
            outputTokens: 4_096,
            totalTokens: 4_216,
            inputTextTokens: 100,
            inputImageTokens: 20,
            outputImageTokens: 4_096,
        });
    });

    it('should classify all input as text when a text-only image prompt has no provider details', () => {
        // arrange
        const usage = { inputTokens: 25, outputTokens: 1_024, totalTokens: 1_049 };

        // act
        const result = mapIntelligenceImageUsage(usage, {}, false);

        // assert
        expect(result).toMatchObject({
            inputTextTokens: 25,
            inputImageTokens: 0,
            outputImageTokens: 1_024,
        });
    });

    it('should keep mixed input modalities unknown when the provider omits their breakdown', () => {
        // arrange
        const usage = { inputTokens: 25, outputTokens: 1_024, totalTokens: 1_049 };

        // act
        const result = mapIntelligenceImageUsage(usage, {}, true);

        // assert
        expect(result).toMatchObject({
            inputTextTokens: null,
            inputImageTokens: null,
            outputImageTokens: 1_024,
        });
    });

    // #endregion
});
