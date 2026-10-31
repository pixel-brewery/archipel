// #region Imports

import { describe, expect, it } from 'vitest';
import { mapIntelligenceRealtimeUsage } from './mapIntelligenceRealtimeUsage.js';

// #endregion

describe('mapIntelligenceRealtimeUsage', () => {
    // #region Methods

    it('should normalize OpenAI and xAI realtime usage details', () => {
        // arrange
        const raw = {
            type: 'response.done',
            response: {
                usage: {
                    input_tokens: 120,
                    output_tokens: 30,
                    total_tokens: 150,
                    input_token_details: {
                        cached_tokens: 10,
                        cached_tokens_details: { text_tokens: 4, audio_tokens: 6 },
                        text_tokens: 70,
                        image_tokens: 5,
                        audio_tokens: 45,
                    },
                    output_token_details: { text_tokens: 8, audio_tokens: 20, reasoning_tokens: 2 },
                },
            },
        };

        // act
        const usage = mapIntelligenceRealtimeUsage(raw);

        // assert
        expect(usage).toMatchObject({
            inputTokens: 120,
            outputTokens: 30,
            totalTokens: 150,
            cachedInputTokens: 10,
            cachedInputTextTokens: 4,
            cachedInputAudioTokens: 6,
            inputTextTokens: 70,
            inputImageTokens: 5,
            inputAudioTokens: 45,
            outputTextTokens: 8,
            outputAudioTokens: 20,
            reasoningTokens: 2,
        });
    });

    it('should normalize Google Live usage metadata and modality details', () => {
        // arrange
        const raw = {
            usageMetadata: {
                promptTokenCount: 90,
                candidatesTokenCount: 20,
                totalTokenCount: 110,
                cachedContentTokenCount: 5,
                promptTokensDetails: [
                    { modality: 'TEXT', tokenCount: 40 },
                    { modality: 'AUDIO', tokenCount: 50 },
                ],
                candidatesTokensDetails: [
                    { modality: 'TEXT', tokenCount: 4 },
                    { modality: 'AUDIO', tokenCount: 16 },
                ],
            },
        };

        // act
        const usage = mapIntelligenceRealtimeUsage(raw);

        // assert
        expect(usage).toMatchObject({
            inputTokens: 90,
            outputTokens: 20,
            totalTokens: 110,
            cachedInputTokens: 5,
            inputTextTokens: 40,
            inputAudioTokens: 50,
            outputTextTokens: 4,
            outputAudioTokens: 16,
        });
    });

    it('should return null when a provider event has no token dimensions', () => {
        // arrange
        const raw = { type: 'response.output_audio.delta', delta: 'audio' };

        // act
        const usage = mapIntelligenceRealtimeUsage(raw);

        // assert
        expect(usage).toBeNull();
    });

    // #endregion
});
