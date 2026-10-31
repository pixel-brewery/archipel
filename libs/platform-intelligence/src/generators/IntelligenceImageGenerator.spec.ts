// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderError } from '../errors/IntelligenceProviderError.js';
import { IntelligenceImageGenerator } from './IntelligenceImageGenerator.js';

// #endregion

const sdk = vi.hoisted(() => ({
    Output: { object: vi.fn(({ schema }) => ({ name: 'object', schema })) },
    generateText: vi.fn(),
    streamText: vi.fn(),
    wrapLanguageModel: vi.fn((configuration: Readonly<Record<string, unknown>>) => configuration['model']),
    jsonSchema: vi.fn((schema: unknown) => schema),
    tool: vi.fn((definition: unknown) => definition),
    embed: vi.fn(),
    embedMany: vi.fn(),
    generateImage: vi.fn(),
    generateSpeech: vi.fn(),
    transcribe: vi.fn(),
    experimental_streamTranscribe: vi.fn(),
    experimental_generateVideo: vi.fn(),
    rerank: vi.fn(),
    uploadFile: vi.fn(),
    uploadSkill: vi.fn(),
}));

vi.mock('ai', () => sdk);

const modelResolver = {
    resolve: vi.fn(async (capability: string) => ({
        handle: { capability },
        provider: 'test',
        model: `${capability}-model`,
        timeoutMs: 30_000,
    })),
    getDefaultConfiguration: vi.fn(() => ({ provider: 'test', model: 'language-model' })),
};

// #region Tests

describe('IntelligenceImageGenerator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map generated images and token usage', async () => {
        // arrange
        sdk.generateImage.mockResolvedValue({
            images: [{ uint8Array: new Uint8Array([1, 2]), mediaType: 'image/png' }],
            warnings: [],
            usage: { inputTokens: 11, outputTokens: 100, totalTokens: 111 },
            providerMetadata: { openai: { images: [{ textTokens: 7, imageTokens: 4 }] } },
        });
        const generator = new IntelligenceImageGenerator(modelResolver as never);

        // act
        const image = await generator.generate({ prompt: 'A lighthouse.' });

        // assert
        expect(image.images[0]?.mediaType).toBe('image/png');
        expect(image.usage).toMatchObject({
            inputTokens: 11,
            outputTokens: 100,
            totalTokens: 111,
            inputTextTokens: 7,
            inputImageTokens: 4,
            outputImageTokens: 100,
        });
    });

    it('should wrap provider failures', async () => {
        // arrange
        sdk.generateImage.mockRejectedValue(new Error('provider unavailable'));
        const generator = new IntelligenceImageGenerator(modelResolver as never);

        // act
        const result = generator.generate({ prompt: 'image' });

        // assert
        await expect(result).rejects.toBeInstanceOf(IntelligenceProviderError);
    });
});

// #endregion
