// #region Imports

import type {
    LanguageModelV4,
    LanguageModelV4CallOptions,
    LanguageModelV4FinishReason,
    LanguageModelV4GenerateResult,
    LanguageModelV4StreamPart,
    LanguageModelV4Text,
    LanguageModelV4ToolCall,
    LanguageModelV4ToolResultOutput,
    LanguageModelV4Usage,
} from '@ai-sdk/provider';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
import { z } from 'zod';
import { createIntelligenceJsonSchema } from '../contracts/createIntelligenceJsonSchema.js';
import { defineIntelligenceTool } from '../contracts/defineIntelligenceTool.js';
import type { IIntelligenceLanguageGenerationOptions } from '../contracts/IIntelligenceLanguageGenerationOptions.js';
import type { IIntelligenceToolDefinition } from '../contracts/IIntelligenceToolDefinition.js';
import type { IIntelligenceToolExecutionEndEvent } from '../contracts/IIntelligenceToolExecutionEndEvent.js';
import type { IIntelligenceToolExecutionStartEvent } from '../contracts/IIntelligenceToolExecutionStartEvent.js';
import type { IntelligenceToolSet } from '../contracts/IntelligenceToolSet.js';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import { IntelligenceModelResolver } from '../IntelligenceModelResolver.js';
import { IntelligenceToolRegistry } from '../IntelligenceToolRegistry.js';
import { createIntelligenceProviderTool } from '../providers/createIntelligenceProviderTool.js';
import { IntelligenceLanguageGenerator } from './IntelligenceLanguageGenerator.js';

// #endregion

// #region Types

type ScriptedContent = LanguageModelV4Text | LanguageModelV4ToolCall;

interface IScriptedLanguageModel extends LanguageModelV4 {
    readonly doGenerate: Mock<LanguageModelV4['doGenerate']>;
    readonly doStream: Mock<LanguageModelV4['doStream']>;
}

// #endregion

// #region Tests

describe('IntelligenceLanguageGenerator deferred tool loading', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should expose only the loader and the initial tools in the first step', async () => {
        // arrange
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const registry = new IntelligenceToolRegistry();
        registry.register({ name: 'registered', tool: createToolDefinition('Reads registered data.') });
        const generator = createGenerator(model, registry);

        // act
        await generator.generateText(
            { prompt: 'Help me.' },
            { tools: createToolCatalog(), deferredToolLoading: { initialToolNames: ['alpha', 'registered'] }, maxSteps: 4 },
        );

        // assert
        expect(getExposedToolNames(model.doGenerate.mock.calls[0]?.[0])).toEqual(['registered', 'alpha', 'load_tools']);
    });

    it('should list every deferred tool with its normalized first sentence in the loader description', async () => {
        // arrange
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        await generator.generateText({ prompt: 'Help me.' }, createDeferredOptions({ initialToolNames: ['alpha'] }));

        // assert
        expect(getLoaderDescription(model.doGenerate.mock.calls[0]?.[0])).toMatch(/\n\nDeferred tools:\n- beta: Creates beta drafts\.\n- gamma$/);
    });

    it('should shorten long tool summaries to a bounded first sentence', async () => {
        // arrange
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        await generator.generateText(
            { prompt: 'Help me.' },
            {
                includeRegisteredTools: false,
                tools: { verbose_export: createToolDefinition(`Exports ${'records '.repeat(40).trim()}. Supports filters.`) },
                deferredToolLoading: {},
                maxSteps: 4,
            },
        );

        // assert
        expect(getLoaderDescription(model.doGenerate.mock.calls[0]?.[0])).toMatch(new RegExp(`\\n- verbose_export: Exports ${'records '.repeat(19).trim()}…$`));
    });

    it('should list provider-owned tools by name only', async () => {
        // arrange
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const registry = new IntelligenceToolRegistry();
        registry.register(createIntelligenceProviderTool('web_search', { type: 'provider', id: 'test.web_search', args: {} }));
        const generator = createGenerator(model, registry);

        // act
        await generator.generateText({ prompt: 'Help me.' }, { deferredToolLoading: {}, maxSteps: 4 });

        // assert
        expect(getLoaderDescription(model.doGenerate.mock.calls[0]?.[0])).toMatch(/\n- web_search$/);
    });

    it('should keep loaded tools active and callable for every later step of the same call', async () => {
        // arrange
        const executeBeta = vi.fn(async () => ({ created: true }));
        const model = createScriptedLanguageModel([
            [callTool('load-1', 'load_tools', { names: ['beta'] })],
            [callTool('beta-1', 'beta', {})],
            [answer('Created.')],
        ]);
        const generator = createGenerator(model);

        // act
        await generator.generateText(
            { prompt: 'Create a beta draft.' },
            { ...createDeferredOptions(), tools: { ...createToolCatalog(), beta: createToolDefinition('Creates beta drafts.', executeBeta) } },
        );

        // assert
        expect(model.doGenerate.mock.calls.map(([call]) => getExposedToolNames(call))).toEqual([
            ['load_tools'],
            ['beta', 'load_tools'],
            ['beta', 'load_tools'],
        ]);
        expect(executeBeta).toHaveBeenCalledTimes(1);
    });

    it('should remove loaded tools from the loader description in later steps', async () => {
        // arrange
        const model = createScriptedLanguageModel([[callTool('load-1', 'load_tools', { names: ['beta'] })], [answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        await generator.generateText({ prompt: 'Help me.' }, createDeferredOptions());

        // assert
        expect(getLoaderDescription(model.doGenerate.mock.calls[1]?.[0])).toMatch(/\n\nDeferred tools:\n- alpha: Finds alpha records\.\n- gamma$/);
    });

    it('should report unknown and already active names without activating them', async () => {
        // arrange
        const model = createScriptedLanguageModel([
            [callTool('load-1', 'load_tools', { names: ['alpha', 'missing', 'beta', 'beta', 'load_tools'] })],
            [answer('Done.')],
        ]);
        const generator = createGenerator(model);

        // act
        await generator.generateText({ prompt: 'Help me.' }, createDeferredOptions({ initialToolNames: ['alpha'] }));

        // assert
        const secondStep = model.doGenerate.mock.calls[1]?.[0];
        expect(getToolOutput(secondStep, 'load-1')).toEqual({
            type: 'json',
            value: { loaded: ['beta'], alreadyActive: ['alpha', 'load_tools'], unknown: ['missing'] },
        });
        expect(getExposedToolNames(secondStep)).toEqual(['alpha', 'beta', 'load_tools']);
    });

    it('should reject loader calls that request more tools than allowed per load', async () => {
        // arrange
        const model = createScriptedLanguageModel([[callTool('load-1', 'load_tools', { names: ['alpha', 'beta'] })], [answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        await generator.generateText({ prompt: 'Help me.' }, createDeferredOptions({ maxToolsPerLoad: 1 }));

        // assert
        const secondStep = model.doGenerate.mock.calls[1]?.[0];
        expect(getToolOutput(secondStep, 'load-1')).toMatchObject({ type: 'error-text', value: expect.stringContaining('between 1 and 1 tools') });
        expect(getExposedToolNames(secondStep)).toEqual(['load_tools']);
    });

    it('should refuse to execute a deferred tool before it is loaded', async () => {
        // arrange
        const executeBeta = vi.fn(async () => ({ created: true }));
        const model = createScriptedLanguageModel([[callTool('beta-1', 'beta', {})], [answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        await generator.generateText(
            { prompt: 'Create a beta draft.' },
            { ...createDeferredOptions(), tools: { ...createToolCatalog(), beta: createToolDefinition('Creates beta drafts.', executeBeta) } },
        );

        // assert
        expect(executeBeta).not.toHaveBeenCalled();
        expect(getToolOutput(model.doGenerate.mock.calls[1]?.[0], 'beta-1')).toMatchObject({ type: 'error-text' });
    });

    it('should report loader executions through the tool execution events', async () => {
        // arrange
        const onToolExecutionStart = vi.fn<(event: IIntelligenceToolExecutionStartEvent) => void>();
        const onToolExecutionEnd = vi.fn<(event: IIntelligenceToolExecutionEndEvent) => void>();
        const model = createScriptedLanguageModel([[callTool('load-1', 'load_tools', { names: ['beta'] })], [answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        await generator.generateText({ prompt: 'Help me.' }, { ...createDeferredOptions(), onToolExecutionStart, onToolExecutionEnd });

        // assert
        expect(onToolExecutionStart).toHaveBeenCalledWith({
            callId: expect.any(String),
            toolCall: { toolCallId: 'load-1', toolName: 'load_tools', input: { names: ['beta'] } },
        });
        expect(onToolExecutionEnd).toHaveBeenCalledWith({
            callId: expect.any(String),
            toolCall: { toolCallId: 'load-1', toolName: 'load_tools', input: { names: ['beta'] } },
            toolOutput: { type: 'tool-result', output: { loaded: ['beta'], alreadyActive: [], unknown: [] } },
            toolExecutionMs: expect.any(Number),
        });
    });

    it('should use the configured loader tool name', async () => {
        // arrange
        const model = createScriptedLanguageModel([[callTool('load-1', 'activate_tools', { names: ['gamma'] })], [answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        await generator.generateText({ prompt: 'Help me.' }, createDeferredOptions({ loaderToolName: 'activate_tools' }));

        // assert
        expect(getExposedToolNames(model.doGenerate.mock.calls[1]?.[0])).toEqual(['gamma', 'activate_tools']);
    });

    it('should start every call without the tools loaded by an earlier call', async () => {
        // arrange
        const model = createScriptedLanguageModel([[callTool('load-1', 'load_tools', { names: ['beta'] })], [answer('First.')], [answer('Second.')]]);
        const generator = createGenerator(model);
        const options = createDeferredOptions();
        await generator.generateText({ prompt: 'First request.' }, options);

        // act
        await generator.generateText({ prompt: 'Second request.' }, options);

        // assert
        expect(getExposedToolNames(model.doGenerate.mock.calls[2]?.[0])).toEqual(['load_tools']);
    });

    it('should expose every composed tool in every step when deferred loading is absent', async () => {
        // arrange
        const model = createScriptedLanguageModel([[callTool('alpha-1', 'alpha', {})], [answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        await generator.generateText({ prompt: 'Help me.' }, { includeRegisteredTools: false, tools: createToolCatalog(), maxSteps: 4 });

        // assert
        expect(model.doGenerate.mock.calls.map(([call]) => getExposedToolNames(call))).toEqual([
            ['alpha', 'beta', 'gamma'],
            ['alpha', 'beta', 'gamma'],
        ]);
    });

    it('should load deferred tools while streaming text', async () => {
        // arrange
        const model = createScriptedLanguageModel([
            [callTool('load-1', 'load_tools', { names: ['beta'] })],
            [callTool('beta-1', 'beta', {})],
            [answer('Streamed.')],
        ]);
        const generator = createGenerator(model);
        const stream = await generator.streamText({ prompt: 'Stream a beta draft.' }, createDeferredOptions());

        // act
        const text = await stream.text;

        // assert
        expect(text).toBe('Streamed.');
        expect(model.doStream.mock.calls.map(([call]) => getExposedToolNames(call))).toEqual([['load_tools'], ['beta', 'load_tools'], ['beta', 'load_tools']]);
    });

    it('should load deferred tools while streaming structured output', async () => {
        // arrange
        const model = createScriptedLanguageModel([[callTool('load-1', 'load_tools', { names: ['gamma'] })], [answer('{"answer":"ready"}')]]);
        const generator = createGenerator(model);
        const stream = await generator.streamObject({ prompt: 'Answer as JSON.' }, z.object({ answer: z.string() }), createDeferredOptions());

        // act
        const output = await stream.output;

        // assert
        expect(output).toEqual({ answer: 'ready' });
        expect(model.doStream.mock.calls.map(([call]) => getExposedToolNames(call))).toEqual([['load_tools'], ['gamma', 'load_tools']]);
    });

    it('should prepare a deferred call locally without executing the loader', async () => {
        // arrange
        const onToolExecutionStart = vi.fn<(event: IIntelligenceToolExecutionStartEvent) => void>();
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        const prepared = await generator.prepareText(
            { prompt: 'Help me.' },
            { ...createDeferredOptions({ initialToolNames: ['alpha'] }), onToolExecutionStart },
        );

        // assert
        expect(prepared.capacity).toMatchObject({ toolCount: 2, maximumToolNameUtf8Bytes: 10, textOnly: true, opaqueToolCount: 0 });
        expect(model.doGenerate).not.toHaveBeenCalled();
        expect(onToolExecutionStart).not.toHaveBeenCalled();
    });

    it('should measure exactly the first provider request of a prepared deferred call', async () => {
        // arrange
        const beforeProviderCall = vi.fn(async () => undefined);
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const generator = createGenerator(model);
        const prepared = await generator.prepareText({ prompt: 'Help me.' }, { ...createDeferredOptions({ initialToolNames: ['alpha'] }), beforeProviderCall });

        // act
        await prepared.execute();

        // assert
        expect(beforeProviderCall).toHaveBeenCalledWith(expect.objectContaining({ inputUtf8Bytes: prepared.capacity.serializedInputUtf8Bytes }));
    });

    it.each<{ readonly scenario: string; readonly options: IIntelligenceLanguageGenerationOptions }>([
        { scenario: 'a combination with active tool names', options: { activeToolNames: ['alpha'], deferredToolLoading: {}, maxSteps: 4 } },
        { scenario: 'an unavailable initial tool', options: { deferredToolLoading: { initialToolNames: ['missing'] }, maxSteps: 4 } },
        { scenario: 'duplicate initial tools', options: { deferredToolLoading: { initialToolNames: ['alpha', 'alpha'] }, maxSteps: 4 } },
        { scenario: 'a loader name colliding with a tool', options: { deferredToolLoading: { loaderToolName: 'alpha' }, maxSteps: 4 } },
        { scenario: 'a blank loader name', options: { deferredToolLoading: { loaderToolName: ' ' }, maxSteps: 4 } },
        { scenario: 'a loader name with surrounding spaces', options: { deferredToolLoading: { loaderToolName: ' load_tools ' }, maxSteps: 4 } },
        { scenario: 'a per-load limit below one', options: { deferredToolLoading: { maxToolsPerLoad: 0 }, maxSteps: 4 } },
        { scenario: 'a per-load limit above fifty', options: { deferredToolLoading: { maxToolsPerLoad: 51 }, maxSteps: 4 } },
        { scenario: 'a fractional per-load limit', options: { deferredToolLoading: { maxToolsPerLoad: 2.5 }, maxSteps: 4 } },
        { scenario: 'a missing step limit', options: { deferredToolLoading: {} } },
        { scenario: 'a single-step limit', options: { deferredToolLoading: {}, maxSteps: 1 } },
        { scenario: 'a forced deferred tool', options: { deferredToolLoading: {}, maxSteps: 4, toolChoice: { type: 'tool', toolName: 'beta' } } },
    ])('should reject $scenario before calling the provider', async ({ options }) => {
        // arrange
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        const action = generator.generateText({ prompt: 'Help me.' }, { includeRegisteredTools: false, tools: createToolCatalog(), ...options });

        // assert
        await expect(action).rejects.toBeInstanceOf(IntelligenceValidationError);
        expect(model.doGenerate).not.toHaveBeenCalled();
    });

    it('should reject the default loader name when a registered tool already uses it', async () => {
        // arrange
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const registry = new IntelligenceToolRegistry();
        registry.register({ name: 'load_tools', tool: createToolDefinition('Loads application data.') });
        const generator = createGenerator(model, registry);

        // act
        const action = generator.generateText({ prompt: 'Help me.' }, { deferredToolLoading: {}, maxSteps: 4 });

        // assert
        await expect(action).rejects.toBeInstanceOf(IntelligenceValidationError);
        expect(model.doGenerate).not.toHaveBeenCalled();
    });

    it('should reject invalid deferred loading before streaming', async () => {
        // arrange
        const model = createScriptedLanguageModel([[answer('Done.')]]);
        const generator = createGenerator(model);

        // act
        const action = generator.streamText(
            { prompt: 'Help me.' },
            { includeRegisteredTools: false, tools: createToolCatalog(), deferredToolLoading: { initialToolNames: ['missing'] }, maxSteps: 4 },
        );

        // assert
        await expect(action).rejects.toBeInstanceOf(IntelligenceValidationError);
        expect(model.doStream).not.toHaveBeenCalled();
    });
});

function createDeferredOptions(
    deferredToolLoading: IIntelligenceLanguageGenerationOptions['deferredToolLoading'] = {},
): IIntelligenceLanguageGenerationOptions {
    return {
        includeRegisteredTools: false,
        tools: createToolCatalog(),
        deferredToolLoading,
        maxRetries: 0,
        maxSteps: 4,
    };
}

function createToolCatalog(): IntelligenceToolSet {
    return {
        alpha: createToolDefinition('Finds alpha records.'),
        beta: createToolDefinition('Creates beta\n    drafts. Requires an approved alpha record.'),
        gamma: createToolDefinition(),
    };
}

function createToolDefinition(description?: string, execute: () => Promise<unknown> = async () => ({ ok: true })): IIntelligenceToolDefinition {
    return defineIntelligenceTool({
        ...(description === undefined ? {} : { description }),
        inputSchema: createIntelligenceJsonSchema<Record<string, never>>({
            type: 'object',
            properties: {},
            additionalProperties: false,
        }),
        execute,
    });
}

function createGenerator(model: LanguageModelV4, registry: IntelligenceToolRegistry = new IntelligenceToolRegistry()): IntelligenceLanguageGenerator {
    const modelResolver = {
        resolve: vi.fn(async () => ({
            handle: model,
            provider: model.provider,
            model: model.modelId,
            timeoutMs: 30_000,
        })),
    };

    return new IntelligenceLanguageGenerator(modelResolver as unknown as IntelligenceModelResolver, registry);
}

function createScriptedLanguageModel(steps: ReadonlyArray<ReadonlyArray<ScriptedContent>>): IScriptedLanguageModel {
    const responses = { generated: 0, streamed: 0 };

    return {
        specificationVersion: 'v4',
        provider: 'test-provider',
        modelId: 'test-model',
        supportedUrls: {},
        doGenerate: vi.fn<LanguageModelV4['doGenerate']>(async () => {
            const content = steps[responses.generated] ?? [answer('Done.')];
            responses.generated += 1;

            return createGenerateResult(content);
        }),
        doStream: vi.fn<LanguageModelV4['doStream']>(async () => {
            const content = steps[responses.streamed] ?? [answer('Done.')];
            responses.streamed += 1;

            return { stream: createStream(content) };
        }),
    };
}

function createGenerateResult(content: ReadonlyArray<ScriptedContent>): LanguageModelV4GenerateResult {
    return {
        content: Array.from(content),
        finishReason: createFinishReason(content),
        usage: createUsage(),
        warnings: [],
    };
}

function createStream(content: ReadonlyArray<ScriptedContent>): ReadableStream<LanguageModelV4StreamPart> {
    const parts: Array<LanguageModelV4StreamPart> = [{ type: 'stream-start', warnings: [] }];
    for (const [index, part] of content.entries()) {
        if (part.type === 'text') {
            parts.push(
                { type: 'text-start', id: `text-${index}` },
                { type: 'text-delta', id: `text-${index}`, delta: part.text },
                { type: 'text-end', id: `text-${index}` },
            );
        } else {
            parts.push(part);
        }
    }
    parts.push({ type: 'finish', finishReason: createFinishReason(content), usage: createUsage() });

    return new ReadableStream<LanguageModelV4StreamPart>({
        start: (controller) => {
            for (const part of parts) {
                controller.enqueue(part);
            }
            controller.close();
        },
    });
}

function createFinishReason(content: ReadonlyArray<ScriptedContent>): LanguageModelV4FinishReason {
    return content.some((part) => part.type === 'tool-call') ? { unified: 'tool-calls', raw: 'tool_calls' } : { unified: 'stop', raw: 'stop' };
}

function createUsage(): LanguageModelV4Usage {
    return {
        inputTokens: { total: 5, noCache: 5, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 2, text: 2, reasoning: 0 },
    };
}

function answer(text: string): LanguageModelV4Text {
    return { type: 'text', text };
}

function callTool(toolCallId: string, toolName: string, input: unknown): LanguageModelV4ToolCall {
    return { type: 'tool-call', toolCallId, toolName, input: JSON.stringify(input) };
}

function getExposedToolNames(call: LanguageModelV4CallOptions | undefined): ReadonlyArray<string> {
    return call?.tools?.map((tool) => tool.name) ?? [];
}

function getLoaderDescription(call: LanguageModelV4CallOptions | undefined): string | undefined {
    const loader = call?.tools?.find((tool) => tool.name === 'load_tools');

    return loader?.type === 'function' ? loader.description : undefined;
}

function getToolOutput(call: LanguageModelV4CallOptions | undefined, toolCallId: string): LanguageModelV4ToolResultOutput | undefined {
    for (const message of call?.prompt ?? []) {
        if (message.role !== 'tool') {
            continue;
        }

        for (const part of message.content) {
            if (part.type === 'tool-result' && part.toolCallId === toolCallId) {
                return part.output;
            }
        }
    }

    return undefined;
}

// #endregion
