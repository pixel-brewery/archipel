// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderError } from '../errors/IntelligenceProviderError.js';
import { IntelligenceTranscriptionGenerator } from './IntelligenceTranscriptionGenerator.js';

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

describe('IntelligenceTranscriptionGenerator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map transcription results', async () => {
        // arrange
        sdk.transcribe.mockResolvedValue({ text: 'hello', segments: [{ text: 'hello', startSecond: 0, endSecond: 1 }], language: 'en', warnings: [] });
        const generator = new IntelligenceTranscriptionGenerator(modelResolver as never);

        // act
        const result = await generator.transcribe({ audio: new Uint8Array([1]) });

        // assert
        expect(result.text).toBe('hello');
    });

    it('should expose streamed transcription parts', async () => {
        // arrange
        sdk.experimental_streamTranscribe.mockReturnValue({
            fullStream: {
                async *[Symbol.asyncIterator]() {
                    yield { type: 'transcript-delta', delta: 'hel' };
                    yield { type: 'transcript-final', text: 'hello', startSecond: 0, endSecond: 1 };
                },
            },
            text: Promise.resolve('hello'),
            segments: Promise.resolve([{ text: 'hello', startSecond: 0, endSecond: 1 }]),
            language: Promise.resolve('en'),
            durationInSeconds: Promise.resolve(1),
            warnings: Promise.resolve([]),
        });
        const generator = new IntelligenceTranscriptionGenerator(modelResolver as never);
        const stream = await generator.stream({ audio: new ReadableStream<Uint8Array>(), inputAudioFormat: { type: 'audio/pcm', rate: 24_000 } });

        // act
        const parts = [];
        for await (const part of stream.fullStream) parts.push(part);

        // assert
        expect(parts).toEqual([
            { type: 'transcript-delta', delta: 'hel' },
            { type: 'transcript-final', text: 'hello', startSecond: 0, endSecond: 1 },
        ]);
    });

    it('should wrap provider failures', async () => {
        // arrange
        sdk.transcribe.mockRejectedValue(new Error('provider unavailable'));
        const generator = new IntelligenceTranscriptionGenerator(modelResolver as never);

        // act
        const result = generator.transcribe({ audio: new Uint8Array([1]) });

        // assert
        await expect(result).rejects.toBeInstanceOf(IntelligenceProviderError);
    });

    it('should wrap streaming provider failures', async () => {
        // arrange
        sdk.experimental_streamTranscribe.mockImplementation(() => {
            throw new Error('provider unavailable');
        });
        const generator = new IntelligenceTranscriptionGenerator(modelResolver as never);

        // act
        const result = generator.stream({ audio: new ReadableStream<Uint8Array>(), inputAudioFormat: { type: 'audio/pcm' } });

        // assert
        await expect(result).rejects.toBeInstanceOf(IntelligenceProviderError);
    });
});

// #endregion
