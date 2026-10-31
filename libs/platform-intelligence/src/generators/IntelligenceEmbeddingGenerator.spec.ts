// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderError } from '../errors/IntelligenceProviderError.js';
import { IntelligenceEmbeddingGenerator } from './IntelligenceEmbeddingGenerator.js';

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

describe('IntelligenceEmbeddingGenerator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map one embedding', async () => {
        // arrange
        sdk.embed.mockResolvedValue({ value: 'one', embedding: [0.1, 0.2], warnings: [], usage: { tokens: 1 } });
        const generator = new IntelligenceEmbeddingGenerator(modelResolver as never);

        // act
        const result = await generator.embed({ value: 'one' });

        // assert
        expect(result.embedding).toEqual([0.1, 0.2]);
    });

    it('should map multiple embeddings', async () => {
        // arrange
        sdk.embedMany.mockResolvedValue({ values: ['one', 'two'], embeddings: [[0.1], [0.2]], warnings: [], usage: { tokens: 2 } });
        const generator = new IntelligenceEmbeddingGenerator(modelResolver as never);

        // act
        const result = await generator.embedMany({ values: ['one', 'two'] });

        // assert
        expect(result.embeddings).toEqual([[0.1], [0.2]]);
    });

    it('should wrap provider failures', async () => {
        // arrange
        sdk.embed.mockRejectedValue(new Error('provider unavailable'));
        sdk.embedMany.mockRejectedValue(new Error('provider unavailable'));
        const generator = new IntelligenceEmbeddingGenerator(modelResolver as never);

        // act
        const results = await Promise.allSettled([generator.embed({ value: 'one' }), generator.embedMany({ values: ['one'] })]);

        // assert
        expect(results.every((result) => result.status === 'rejected' && result.reason instanceof IntelligenceProviderError)).toBe(true);
    });
});

// #endregion
