// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderError } from '../errors/IntelligenceProviderError.js';
import { IntelligenceSpeechGenerator } from './IntelligenceSpeechGenerator.js';

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

describe('IntelligenceSpeechGenerator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map generated speech', async () => {
        // arrange
        sdk.generateSpeech.mockResolvedValue({ audio: { uint8Array: new Uint8Array([1]), mediaType: 'audio/mpeg' }, warnings: [] });
        const generator = new IntelligenceSpeechGenerator(modelResolver as never);

        // act
        const result = await generator.generate({ text: 'Hello.' });

        // assert
        expect(result.audio.mediaType).toBe('audio/mpeg');
    });

    it('should wrap provider failures', async () => {
        // arrange
        sdk.generateSpeech.mockRejectedValue(new Error('provider unavailable'));
        const generator = new IntelligenceSpeechGenerator(modelResolver as never);

        // act
        const result = generator.generate({ text: 'speech' });

        // assert
        await expect(result).rejects.toBeInstanceOf(IntelligenceProviderError);
    });
});

// #endregion
