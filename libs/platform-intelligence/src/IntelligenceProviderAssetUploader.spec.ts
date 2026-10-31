// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderError } from './errors/IntelligenceProviderError.js';
import { IntelligenceProviderAssetUploader } from './IntelligenceProviderAssetUploader.js';

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

describe('IntelligenceProviderAssetUploader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should upload files without exposing provider APIs', async () => {
        // arrange
        sdk.uploadFile.mockResolvedValue({ providerReference: { test: 'file-1' }, mediaType: 'text/plain', filename: 'note.txt', warnings: [] });
        const uploader = new IntelligenceProviderAssetUploader(modelResolver as never);

        // act
        const file = await uploader.uploadFile({ data: 'hello', mediaType: 'text/plain', filename: 'note.txt' });

        // assert
        expect(file.providerReference).toEqual({ test: 'file-1' });
    });

    it('should upload skills without exposing provider APIs', async () => {
        // arrange
        sdk.uploadSkill.mockResolvedValue({ providerReference: { test: 'skill-1' }, name: 'research', latestVersion: '1', warnings: [] });
        const uploader = new IntelligenceProviderAssetUploader(modelResolver as never);

        // act
        const skill = await uploader.uploadSkill({ files: [{ path: 'SKILL.md', data: { type: 'text', text: '# Research' } }] });

        // assert
        expect(skill).toMatchObject({ providerReference: { test: 'skill-1' }, name: 'research' });
    });

    it('should wrap provider failures', async () => {
        // arrange
        sdk.uploadFile.mockRejectedValue(new Error('provider unavailable'));
        sdk.uploadSkill.mockRejectedValue(new Error('provider unavailable'));
        const uploader = new IntelligenceProviderAssetUploader(modelResolver as never);

        // act
        const results = await Promise.allSettled([
            uploader.uploadFile({ data: 'file' }),
            uploader.uploadSkill({ files: [{ path: 'SKILL.md', data: 'skill' }] }),
        ]);

        // assert
        expect(results.every((result) => result.status === 'rejected' && result.reason instanceof IntelligenceProviderError)).toBe(true);
    });
});

// #endregion
