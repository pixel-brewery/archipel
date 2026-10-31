// #region Imports

import type { LanguageModelV4, LanguageModelV4CallOptions } from '@ai-sdk/provider';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
import { createIntelligenceJsonSchema } from './contracts/createIntelligenceJsonSchema.js';
import { defineIntelligenceTool } from './contracts/defineIntelligenceTool.js';
import type { IIntelligenceAgentConfiguration } from './contracts/IIntelligenceAgentConfiguration.js';
import type { IntelligenceToolSet } from './contracts/IntelligenceToolSet.js';
import { IntelligenceLanguageGenerator } from './generators/IntelligenceLanguageGenerator.js';
import type { IntelligenceAgent } from './IntelligenceAgent.js';
import { IntelligenceAgentFactory } from './IntelligenceAgentFactory.js';
import { IntelligenceModelResolver } from './IntelligenceModelResolver.js';
import { IntelligenceToolRegistry } from './IntelligenceToolRegistry.js';

// #endregion

// #region Types

interface IRecordingLanguageModel extends LanguageModelV4 {
    readonly doGenerate: Mock<LanguageModelV4['doGenerate']>;
}

// #endregion

// #region Tests

describe('IntelligenceAgent tool exposure', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should apply the configured deferred tool loading to every run', async () => {
        // arrange
        const model = createLanguageModel();
        const agent = createAgent(model, { deferredToolLoading: { initialToolNames: ['alpha'] } });

        // act
        await agent.generate({ prompt: 'Help me.' });

        // assert
        expect(getExposedToolNames(model.doGenerate.mock.calls[0]?.[0])).toEqual(['alpha', 'load_tools']);
    });

    it('should let active tools of a run replace the configured deferred tool loading', async () => {
        // arrange
        const model = createLanguageModel();
        const agent = createAgent(model, { deferredToolLoading: { initialToolNames: ['alpha'] } });

        // act
        await agent.generate({ prompt: 'Help me.' }, { activeToolNames: ['beta'] });

        // assert
        expect(getExposedToolNames(model.doGenerate.mock.calls[0]?.[0])).toEqual(['beta']);
    });

    it('should let deferred tool loading of a run replace the configured active tools', async () => {
        // arrange
        const model = createLanguageModel();
        const agent = createAgent(model, { activeToolNames: ['alpha'] });

        // act
        await agent.generate({ prompt: 'Help me.' }, { deferredToolLoading: {} });

        // assert
        expect(getExposedToolNames(model.doGenerate.mock.calls[0]?.[0])).toEqual(['load_tools']);
    });
});

function createAgent(
    model: LanguageModelV4,
    toolExposure: Pick<IIntelligenceAgentConfiguration, 'activeToolNames' | 'deferredToolLoading'>,
): IntelligenceAgent {
    const modelResolver = {
        resolve: vi.fn(async () => ({
            handle: model,
            provider: model.provider,
            model: model.modelId,
            timeoutMs: 30_000,
        })),
    };
    const languageGenerator = new IntelligenceLanguageGenerator(modelResolver as unknown as IntelligenceModelResolver, new IntelligenceToolRegistry());

    return new IntelligenceAgentFactory(languageGenerator).create({
        instructions: 'Use the approved tools.',
        tools: createToolCatalog(),
        maxSteps: 3,
        ...toolExposure,
    });
}

function createToolCatalog(): IntelligenceToolSet {
    const inputSchema = createIntelligenceJsonSchema<Record<string, never>>({
        type: 'object',
        properties: {},
        additionalProperties: false,
    });

    return {
        alpha: defineIntelligenceTool({ description: 'Finds alpha records.', inputSchema }),
        beta: defineIntelligenceTool({ description: 'Creates beta drafts.', inputSchema }),
    };
}

function createLanguageModel(): IRecordingLanguageModel {
    return {
        specificationVersion: 'v4',
        provider: 'test-provider',
        modelId: 'test-model',
        supportedUrls: {},
        doGenerate: vi.fn<LanguageModelV4['doGenerate']>(async () => ({
            content: [{ type: 'text', text: 'Done.' }],
            finishReason: { unified: 'stop', raw: 'stop' },
            usage: {
                inputTokens: { total: 5, noCache: 5, cacheRead: 0, cacheWrite: 0 },
                outputTokens: { total: 1, text: 1, reasoning: 0 },
            },
            warnings: [],
        })),
        doStream: vi.fn<LanguageModelV4['doStream']>(async () => {
            throw new TypeError('Streaming is not part of this agent test.');
        }),
    };
}

function getExposedToolNames(call: LanguageModelV4CallOptions | undefined): ReadonlyArray<string> {
    return call?.tools?.map((tool) => tool.name) ?? [];
}

// #endregion
