// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderError } from '../errors/IntelligenceProviderError.js';
import { IntelligenceVideoGenerator } from './IntelligenceVideoGenerator.js';

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

describe('IntelligenceVideoGenerator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map generated videos', async () => {
        // arrange
        sdk.experimental_generateVideo.mockResolvedValue({ videos: [{ uint8Array: new Uint8Array([1]), mediaType: 'video/mp4' }], warnings: [] });
        const generator = new IntelligenceVideoGenerator(modelResolver as never);

        // act
        const result = await generator.generate({ prompt: 'Ocean waves.' });

        // assert
        expect(result.videos[0]?.mediaType).toBe('video/mp4');
    });

    it('should wrap provider failures', async () => {
        // arrange
        sdk.experimental_generateVideo.mockRejectedValue(new Error('provider unavailable'));
        const generator = new IntelligenceVideoGenerator(modelResolver as never);

        // act
        const result = generator.generate({ prompt: 'video' });

        // assert
        await expect(result).rejects.toBeInstanceOf(IntelligenceProviderError);
    });
});

// #endregion
