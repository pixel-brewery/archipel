// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderError } from './errors/IntelligenceProviderError.js';
import { IntelligenceReranker } from './IntelligenceReranker.js';

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

describe('IntelligenceReranker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map reranking results', async () => {
        // arrange
        sdk.rerank.mockResolvedValue({ ranking: [{ originalIndex: 1, score: 0.9, document: 'second' }] });
        const reranker = new IntelligenceReranker(modelResolver as never);

        // act
        const result = await reranker.rerank({ query: 'best', documents: ['first', 'second'] });

        // assert
        expect(result.ranking).toEqual([{ originalIndex: 1, score: 0.9, document: 'second' }]);
    });

    it('should wrap provider failures', async () => {
        // arrange
        sdk.rerank.mockRejectedValue(new Error('provider unavailable'));
        const reranker = new IntelligenceReranker(modelResolver as never);

        // act
        const result = reranker.rerank({ query: 'best', documents: ['one'] });

        // assert
        await expect(result).rejects.toBeInstanceOf(IntelligenceProviderError);
    });
});

// #endregion
