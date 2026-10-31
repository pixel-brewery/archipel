// #region Imports

import type { LanguageModelV4, LanguageModelV4GenerateResult } from '@ai-sdk/provider';
import { describe, expect, it, vi } from 'vitest';
import { createIntelligenceJsonSchema } from '../contracts/createIntelligenceJsonSchema.js';
import { defineIntelligenceTool } from '../contracts/defineIntelligenceTool.js';
import { IntelligenceModelResolver } from '../IntelligenceModelResolver.js';
import { IntelligenceToolRegistry } from '../IntelligenceToolRegistry.js';
import { IntelligenceLanguageGenerator } from './IntelligenceLanguageGenerator.js';

// #endregion

// #region Tests

describe('IntelligenceLanguageGenerator provider boundary', () => {
    it('should capture standardized input locally without provider or lifecycle side effects', async () => {
        // arrange
        const model = createLanguageModel();
        const generator = createGenerator(model);
        const beforeProviderCall = vi.fn(async () => undefined);
        const onStepStart = vi.fn(async () => undefined);
        const onToolExecutionStart = vi.fn(async () => undefined);
        const onToolExecutionEnd = vi.fn(async () => undefined);
        const executeTool = vi.fn(async () => ({ accepted: true }));

        // act
        const prepared = await generator.prepareText(
            { prompt: 'Dispatch only after the durable fence.' },
            {
                beforeProviderCall,
                includeRegisteredTools: false,
                maxOutputTokens: 64,
                maxRetries: 0,
                tools: {
                    bounded_tool: defineIntelligenceTool({
                        inputSchema: createIntelligenceJsonSchema<Record<string, never>>({
                            type: 'object',
                            properties: {},
                            additionalProperties: false,
                        }),
                        execute: executeTool,
                    }),
                },
                activeToolNames: ['bounded_tool'],
                onStepStart,
                onToolExecutionStart,
                onToolExecutionEnd,
            },
        );

        // assert
        expect(model.doGenerate).not.toHaveBeenCalled();
        expect(beforeProviderCall).not.toHaveBeenCalled();
        expect(onStepStart).not.toHaveBeenCalled();
        expect(onToolExecutionStart).not.toHaveBeenCalled();
        expect(onToolExecutionEnd).not.toHaveBeenCalled();
        expect(executeTool).not.toHaveBeenCalled();
        expect(prepared.capacity).toMatchObject({
            toolCount: 1,
            maximumToolNameUtf8Bytes: 12,
            textOnly: true,
            opaqueToolCount: 0,
        });
    });

    it('should expose standardized input and await the guard before contacting the provider', async () => {
        // arrange
        const model = createLanguageModel();
        const generator = createGenerator(model);
        const beforeProviderCall = vi.fn(async () => undefined);
        const prepared = await generator.prepareText(
            { prompt: 'Dispatch only after the durable fence.' },
            {
                beforeProviderCall,
                includeRegisteredTools: false,
                maxOutputTokens: 64,
                maxRetries: 0,
            },
        );

        // act
        const completion = await prepared.execute();

        // assert
        expect(completion).toMatchObject({ text: 'Done.' });
        expect(beforeProviderCall).toHaveBeenCalledWith({
            provider: 'test-provider',
            modelId: 'test-model',
            providerCallNumber: 1,
            inputUtf8Bytes: expect.any(Number),
            maxOutputTokens: 64,
            textOnly: true,
            providerToolCount: 0,
        });
        expect(beforeProviderCall.mock.calls[0]?.[0].inputUtf8Bytes).toBeGreaterThan(0);
        expect(prepared.capacity.serializedInputUtf8Bytes).toBe(beforeProviderCall.mock.calls[0]?.[0].inputUtf8Bytes);
        expect(model.doGenerate).toHaveBeenCalledTimes(1);
    });

    it('should return a tool-only provider response without requiring structured output', async () => {
        // arrange
        const model = createLanguageModel();
        model.doGenerate.mockResolvedValue({
            content: [{ type: 'tool-call', toolCallId: 'call-1', toolName: 'inspect', input: '{}' }],
            finishReason: { unified: 'tool-calls', raw: 'tool-calls' },
            usage: { inputTokens: { total: 7 }, outputTokens: { total: 2 } },
            warnings: [],
        });
        const generator = createGenerator(model);

        // act
        const result = await generator.generateText(
            { prompt: 'Inspect the record.' },
            {
                includeRegisteredTools: false,
                maxSteps: 1,
                maxRetries: 0,
                tools: { inspect: defineIntelligenceTool({ inputSchema: createIntelligenceJsonSchema({ type: 'object' }) }) },
            },
        );

        // assert
        expect(result.text).toBe('');
        expect(result.output).toBe('');
        expect(result.toolCalls).toEqual([{ toolCallId: 'call-1', toolName: 'inspect', input: {} }]);
        expect(model.doGenerate).toHaveBeenCalledOnce();
    });

    it('should prevent the native provider call when the durable guard rejects', async () => {
        // arrange
        const model = createLanguageModel();
        const generator = createGenerator(model);
        const prepared = await generator.prepareText(
            { prompt: 'This call must remain local.' },
            {
                beforeProviderCall: async () => {
                    throw new Error('durable capacity fence rejected');
                },
                includeRegisteredTools: false,
                maxRetries: 0,
            },
        );

        // act
        const action = prepared.execute();

        // assert
        await expect(action).rejects.toThrow('The intelligence language provider request failed.');
        expect(model.doGenerate).not.toHaveBeenCalled();
    });
});

function createGenerator(model: LanguageModelV4): IntelligenceLanguageGenerator {
    const modelResolver = {
        resolve: vi.fn(async () => ({
            handle: model,
            provider: model.provider,
            model: model.modelId,
            timeoutMs: 30_000,
        })),
    };

    return new IntelligenceLanguageGenerator(modelResolver as unknown as IntelligenceModelResolver, new IntelligenceToolRegistry());
}

function createLanguageModel(): LanguageModelV4 & { readonly doGenerate: ReturnType<typeof vi.fn> } {
    const result: LanguageModelV4GenerateResult = {
        content: [{ type: 'text', text: 'Done.' }],
        finishReason: { unified: 'stop', raw: 'stop' },
        usage: {
            inputTokens: { total: 7, noCache: 7, cacheRead: 0, cacheWrite: 0 },
            outputTokens: { total: 2, text: 2, reasoning: 0 },
        },
        warnings: [],
    };
    const doGenerate = vi.fn(async () => result);

    return {
        specificationVersion: 'v4',
        provider: 'test-provider',
        modelId: 'test-model',
        supportedUrls: {},
        doGenerate,
        doStream: vi.fn(async () => {
            throw new TypeError('Streaming is not part of this provider-boundary test.');
        }),
    };
}

// #endregion
