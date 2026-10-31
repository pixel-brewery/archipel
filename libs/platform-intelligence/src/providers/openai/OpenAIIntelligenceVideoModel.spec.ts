// #region Imports

import type { Experimental_VideoModelV4CallOptions as VideoModelV4CallOptions } from '@ai-sdk/provider';
import { describe, expect, it, vi } from 'vitest';
import { OpenAIIntelligenceVideoModel } from './OpenAIIntelligenceVideoModel.js';

// #endregion

// #region Methods

function createCallOptions(overrides: Partial<VideoModelV4CallOptions> = {}): VideoModelV4CallOptions {
    return {
        prompt: 'A product rotating in a clean studio.',
        n: 1,
        aspectRatio: undefined,
        resolution: '1280x720',
        duration: 8,
        fps: undefined,
        seed: undefined,
        image: undefined,
        frameImages: undefined,
        inputReferences: undefined,
        generateAudio: undefined,
        providerOptions: {
            openai: {
                videoPollIntervalMs: 1,
            },
        },
        ...overrides,
    };
}

function createModel(responses: Array<Response>): { readonly fetch: typeof fetch; readonly model: OpenAIIntelligenceVideoModel } {
    const fetch = vi.fn(async () => {
        const response = responses.shift();

        if (!response) {
            throw new Error('Unexpected OpenAI video request.');
        }

        return response;
    }) as unknown as typeof globalThis.fetch;

    return {
        fetch,
        model: new OpenAIIntelligenceVideoModel({
            apiKey: 'test-key',
            baseUrl: 'https://api.openai.test/v1/',
            fetch,
            modelId: 'sora-2',
        }),
    };
}

// #endregion

describe('OpenAIIntelligenceVideoModel', () => {
    // #region Methods

    it('should create and download a completed OpenAI video job', async () => {
        // arrange
        const { fetch, model } = createModel([
            new Response(JSON.stringify({ id: 'video-1', status: 'completed', model: 'sora-2' }), {
                status: 200,
                headers: { 'x-request-id': 'request-1' },
            }),
            new Response(Uint8Array.from([1, 2, 3]), {
                status: 200,
                headers: { 'content-type': 'video/mp4' },
            }),
        ]);

        // act
        const result = await model.doGenerate(createCallOptions());

        // assert
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(
            1,
            'https://api.openai.test/v1/videos',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    model: 'sora-2',
                    prompt: 'A product rotating in a clean studio.',
                    size: '1280x720',
                    seconds: '8',
                }),
            }),
        );
        expect(fetch).toHaveBeenNthCalledWith(2, 'https://api.openai.test/v1/videos/video-1/content', expect.objectContaining({ method: 'GET' }));
        expect(result.videos).toEqual([{ type: 'binary', data: Uint8Array.from([1, 2, 3]), mediaType: 'video/mp4' }]);
        expect(result.providerMetadata).toEqual({
            openai: {
                videoId: 'video-1',
                status: 'completed',
            },
        });
    });

    it('should poll an asynchronous job and surface a sanitized terminal failure', async () => {
        // arrange
        const { fetch, model } = createModel([
            new Response(JSON.stringify({ id: 'video-2', status: 'queued', model: 'sora-2' }), { status: 200 }),
            new Response(
                JSON.stringify({
                    id: 'video-2',
                    status: 'failed',
                    model: 'sora-2',
                    error: { message: 'The video request was rejected.' },
                }),
                { status: 200 },
            ),
        ]);

        // act
        const action = model.doGenerate(createCallOptions());

        // assert
        await expect(action).rejects.toThrow('The video request was rejected.');
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenLastCalledWith('https://api.openai.test/v1/videos/video-2', expect.objectContaining({ method: 'GET' }));
    });

    // #endregion
});
