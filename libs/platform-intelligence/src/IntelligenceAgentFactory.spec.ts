// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceAgentFactory } from './IntelligenceAgentFactory.js';
import { IntelligenceLanguageGenerator } from './generators/IntelligenceLanguageGenerator.js';
import { IntelligenceToolRegistry } from './IntelligenceToolRegistry.js';

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

describe('IntelligenceAgentFactory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create reusable agents on top of the language generator', async () => {
        // arrange
        sdk.generateText.mockResolvedValue({
            text: 'Agent answer',
            output: 'Agent answer',
            finalStep: { finishReason: 'stop' },
            sources: [],
            files: [],
            toolCalls: [],
            toolResults: [],
            warnings: [],
            usage: { inputTokens: 2, outputTokens: 1, totalTokens: 3 },
        });
        const language = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());
        const agent = new IntelligenceAgentFactory(language).create({ name: 'researcher', instructions: 'Research carefully.', maxSteps: 4 });

        // act
        const result = await agent.generate({ prompt: 'Question' });

        // assert
        expect(agent.name).toBe('researcher');
        expect(result.text).toBe('Agent answer');
        expect(sdk.generateText).toHaveBeenCalledWith(
            expect.objectContaining({
                instructions: 'Research carefully.',
                prompt: 'Question',
                stopWhen: expect.any(Function),
            }),
        );
    });
});

// #endregion
