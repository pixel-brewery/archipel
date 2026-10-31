// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { IIntelligenceProviderCallStartEvent } from '../contracts/IIntelligenceProviderCallStartEvent.js';
import type { IIntelligenceToolDefinition } from '../contracts/IIntelligenceToolDefinition.js';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import { IntelligenceProviderError } from '../errors/IntelligenceProviderError.js';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import { IntelligenceToolRegistry } from '../IntelligenceToolRegistry.js';
import type { IIntelligenceTool } from '../interfaces/IIntelligenceTool.js';
import { IntelligenceLanguageGenerator } from './IntelligenceLanguageGenerator.js';

// #endregion

const sdk = vi.hoisted(() => ({
    Output: { object: vi.fn(({ schema }) => ({ name: 'object', schema })) },
    streamText: vi.fn(),
    generateText: vi.fn(),
    jsonSchema: vi.fn((schema: unknown) => schema),
    tool: vi.fn((definition: unknown) => definition),
    wrapLanguageModel: vi.fn((configuration: Readonly<Record<string, unknown>>) => configuration['model']),
}));

vi.mock('ai', () => sdk);

// #region Tests

describe('IntelligenceLanguageGenerator tool resolution', () => {
    const modelResolver = {
        resolve: vi.fn(async () => ({
            handle: { capability: IntelligenceCapabilityNames.Language },
            provider: 'test',
            model: 'language-model',
            timeoutMs: 30_000,
        })),
    };
    let registry: IntelligenceToolRegistry;
    let generator: IntelligenceLanguageGenerator;

    beforeEach(() => {
        vi.clearAllMocks();
        sdk.wrapLanguageModel.mockImplementation((configuration: Readonly<Record<string, unknown>>) => configuration);
        sdk.generateText.mockImplementation(async (settings: unknown) => {
            if (isRecord(settings) && isRecord(settings['model']) && isRecord(settings['model']['middleware'])) {
                const middleware = settings['model']['middleware'];
                if (typeof middleware['wrapGenerate'] === 'function' && middleware['wrapStream'] === undefined) {
                    return middleware['wrapGenerate']({
                        doGenerate: vi.fn(),
                        params: createProviderCallParams(settings),
                        model: { provider: 'test', modelId: 'language-model' },
                    });
                }
            }

            return createLanguageResult();
        });
        registry = new IntelligenceToolRegistry();
        generator = new IntelligenceLanguageGenerator(modelResolver as never, registry);
    });

    it('should include registered and call-local tools by default', async () => {
        // arrange
        registry.register(createTool('registered'));

        // act
        await generator.generateText(
            { prompt: 'Use tools.' },
            {
                tools: { inline: createToolDefinition('inline') },
            },
        );

        // assert
        expect(getSubmittedToolNames()).toEqual(['registered', 'inline']);
    });

    it('should submit exactly the active tools to the AI SDK', async () => {
        // arrange
        registry.register(createTool('registered'));

        // act
        await generator.generateText(
            { prompt: 'Use one tool.' },
            {
                tools: { inline: createToolDefinition('inline') },
                activeToolNames: ['inline'],
            },
        );

        // assert
        expect(getSubmittedToolNames()).toEqual(['inline']);
    });

    it('should reject duplicate active tool names before calling the provider', async () => {
        // arrange
        registry.register(createTool('registered'));

        // act
        const action = generator.generateText({ prompt: 'Use tools.' }, { activeToolNames: ['registered', 'registered'] });

        // assert
        await expect(action).rejects.toBeInstanceOf(IntelligenceValidationError);
        expect(sdk.generateText).not.toHaveBeenCalled();
    });

    it('should reject unknown active tool names before calling the provider', async () => {
        // act
        const action = generator.generateText({ prompt: 'Use tools.' }, { activeToolNames: ['missing'] });

        // assert
        await expect(action).rejects.toBeInstanceOf(IntelligenceValidationError);
        expect(sdk.generateText).not.toHaveBeenCalled();
    });

    it('should exclude the global registry when includeRegisteredTools is false', async () => {
        // arrange
        registry.register(createTool('registered'));

        // act
        await generator.generateText(
            { prompt: 'Use local tools.' },
            {
                includeRegisteredTools: false,
                tools: { inline: createToolDefinition('inline') },
            },
        );

        // assert
        expect(getSubmittedToolNames()).toEqual(['inline']);
    });

    it('should treat excluded registered tools as unavailable active tools', async () => {
        // arrange
        registry.register(createTool('registered'));

        // act
        const action = generator.generateText(
            { prompt: 'Use tools.' },
            {
                includeRegisteredTools: false,
                activeToolNames: ['registered'],
            },
        );

        // assert
        await expect(action).rejects.toBeInstanceOf(IntelligenceValidationError);
        expect(sdk.generateText).not.toHaveBeenCalled();
    });

    it('should prepare and validate a single-use call with a local capacity probe', async () => {
        // act
        const prepared = await generator.prepareText(
            { prompt: 'Prepare this request.' },
            {
                includeRegisteredTools: false,
                maxRetries: 0,
                tools: { inline: createJsonSchemaToolDefinition('inline') },
            },
        );

        // assert
        expect(sdk.generateText).toHaveBeenCalledTimes(1);
        expect(prepared.provider).toBe('test');
        expect(prepared.model).toBe('language-model');
        expect(prepared.capacity).toMatchObject({
            messageCount: 1,
            toolCount: 1,
            maximumToolNameUtf8Bytes: 6,
            textOnly: true,
            opaqueToolCount: 0,
        });
        expect(prepared.capacity.serializedInputUtf8Bytes).toBeGreaterThan(0);

        await expect(prepared.execute()).resolves.toMatchObject({ text: 'Done' });
        await expect(prepared.execute()).rejects.toBeInstanceOf(IntelligenceValidationError);
        expect(sdk.generateText).toHaveBeenCalledTimes(2);
    });

    it('should run the authoritative guard on standardized input immediately before generation', async () => {
        // arrange
        const beforeProviderCall = vi.fn<(event: IIntelligenceProviderCallStartEvent) => Promise<void>>(async () => undefined);
        await generator.prepareText({ prompt: 'Use the provider.' }, { beforeProviderCall, includeRegisteredTools: false, maxOutputTokens: 128 });
        const middleware = getSubmittedMiddleware();
        const doGenerate = vi.fn(async () => createLanguageResult());

        // act
        await middleware.wrapGenerate({
            doGenerate,
            params: createProviderCallParams(),
            model: { provider: 'provider-id', modelId: 'model-id' },
        });

        // assert
        expect(beforeProviderCall).toHaveBeenCalledWith({
            provider: 'provider-id',
            modelId: 'model-id',
            providerCallNumber: 1,
            inputUtf8Bytes: expect.any(Number),
            maxOutputTokens: 128,
            textOnly: true,
            providerToolCount: 0,
        });
        expect(beforeProviderCall.mock.calls[0]?.[0].inputUtf8Bytes).toBeGreaterThan(0);
        expect(doGenerate).toHaveBeenCalledTimes(1);
    });

    it('should prevent provider generation when the authoritative guard rejects', async () => {
        // arrange
        const guardFailure = new Error('capacity fence rejected');
        await generator.prepareText(
            { prompt: 'Do not dispatch this request.' },
            {
                beforeProviderCall: async () => {
                    throw guardFailure;
                },
                includeRegisteredTools: false,
            },
        );
        const middleware = getSubmittedMiddleware();
        const doGenerate = vi.fn(async () => createLanguageResult());

        // act
        const action = middleware.wrapGenerate({
            doGenerate,
            params: createProviderCallParams(),
            model: { provider: 'provider-id', modelId: 'model-id' },
        });

        // assert
        await expect(action).rejects.toBe(guardFailure);
        expect(doGenerate).not.toHaveBeenCalled();
    });

    it('should report the usage of every provider step next to their sum', async () => {
        // arrange
        sdk.generateText.mockResolvedValueOnce({
            ...createLanguageResult(),
            usage: { inputTokens: 460_000, outputTokens: 30, totalTokens: 460_030 },
            steps: [
                { usage: { inputTokens: 230_000, outputTokens: 10, totalTokens: 230_010, inputTokenDetails: { cacheReadTokens: 200_000 } } },
                { usage: { inputTokens: 230_000, outputTokens: 20, totalTokens: 230_020 } },
            ],
        });

        // act
        const completion = await generator.generateText({ prompt: 'Use a tool, then answer.' }, { includeRegisteredTools: false });

        // assert
        expect(completion.usage).toMatchObject({ inputTokens: 460_000, outputTokens: 30 });
        expect(completion.stepUsage).toEqual([
            expect.objectContaining({ inputTokens: 230_000, outputTokens: 10, cachedInputTokens: 200_000 }),
            expect.objectContaining({ inputTokens: 230_000, outputTokens: 20, cachedInputTokens: null }),
        ]);
    });

    function getSubmittedToolNames(): ReadonlyArray<string> {
        const settings = sdk.generateText.mock.calls[0]?.[0] as unknown;
        if (!isRecord(settings) || !isRecord(settings['tools'])) {
            return [];
        }

        return Object.keys(settings['tools']);
    }

    function getSubmittedMiddleware(): {
        readonly wrapGenerate: (input: {
            readonly doGenerate: () => Promise<unknown>;
            readonly params: ReturnType<typeof createProviderCallParams>;
            readonly model: { readonly provider: string; readonly modelId: string };
        }) => Promise<unknown>;
    } {
        const configuration = sdk.wrapLanguageModel.mock.calls
            .map(([candidate]) => candidate)
            .find((candidate) => isRecord(candidate) && isRecord(candidate['middleware']) && typeof candidate['middleware']['wrapStream'] === 'function');
        if (!isRecord(configuration) || !isRecord(configuration['middleware'])) {
            throw new TypeError('Expected the provider guard middleware to be configured.');
        }

        return configuration['middleware'] as ReturnType<typeof getSubmittedMiddleware>;
    }
});

function createTool(name: string): IIntelligenceTool {
    return {
        name,
        tool: createToolDefinition(name),
    };
}

function createToolDefinition(name: string): IIntelligenceToolDefinition {
    return {
        description: `${name} tool`,
        inputSchema: z.object({}),
    };
}

function createJsonSchemaToolDefinition(name: string): IIntelligenceToolDefinition {
    return {
        description: `${name} tool`,
        inputSchema: {
            kind: 'json-schema',
            jsonSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false,
            },
        },
    };
}

function createProviderCallParams(settings?: unknown) {
    const record = isRecord(settings) ? settings : {};

    return {
        prompt: [{ role: 'user' as const, content: [{ type: 'text' as const, text: 'Use the provider.' }] }],
        maxOutputTokens: typeof record['maxOutputTokens'] === 'number' ? record['maxOutputTokens'] : 128,
        tools: isRecord(record['tools'])
            ? Object.entries(record['tools']).map(([name, definition]) => ({
                  type: 'function' as const,
                  name,
                  inputSchema: isRecord(definition) && isRecord(definition['inputSchema']) ? definition['inputSchema'] : {},
              }))
            : undefined,
        responseFormat: { type: 'text' as const },
    };
}

function createLanguageResult(): Readonly<Record<string, unknown>> {
    return {
        text: 'Done',
        output: 'Done',
        finalStep: { finishReason: 'stop' },
        sources: [],
        files: [],
        toolCalls: [],
        toolResults: [],
        warnings: [],
        usage: { inputTokens: 2, outputTokens: 1, totalTokens: 3 },
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// #endregion

describe('IntelligenceLanguageGenerator capability facade', () => {
    const modelResolver = {
        resolve: vi.fn(async (capability: string) => ({
            handle: { capability },
            provider: 'test',
            model: `${capability}-model`,
            timeoutMs: 30_000,
        })),
        getDefaultConfiguration: vi.fn(() => ({ provider: 'test', model: 'language-model' })),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should own text, structured output, and streaming inside the language facade', async () => {
        sdk.generateText.mockResolvedValueOnce(createFacadeLanguageResult('Hello')).mockResolvedValueOnce(createFacadeLanguageResult({ answer: 'Hello' }));
        sdk.streamText.mockReturnValue({
            textStream: toAsyncIterable(['Hel', 'lo']),
            partialOutputStream: toAsyncIterable([{ answer: 'Hel' }]),
            text: Promise.resolve('Hello'),
            output: Promise.resolve({ answer: 'Hello' }),
            finishReason: Promise.resolve('stop'),
            usage: Promise.resolve({ inputTokens: 2, outputTokens: 1, totalTokens: 3 }),
        });
        const generator = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());

        const text = await generator.generateText({ prompt: 'Say hello.' });
        const object = await generator.generateObject({ prompt: 'Return JSON.' }, z.object({ answer: z.string() }));
        const textStream = await generator.streamText({ prompt: 'Stream.' });
        const objectStream = await generator.streamObject({ prompt: 'Stream JSON.' }, z.object({ answer: z.string() }));

        expect(text.output).toBe('Hello');
        expect(object.output).toEqual({ answer: 'Hello' });
        expect(await textStream.text).toBe('Hello');
        expect(await objectStream.output).toEqual({ answer: 'Hello' });
        expect(sdk.Output.object).toHaveBeenCalledTimes(2);
    });

    it('should expose client tool calls without executing them on the server', async () => {
        // arrange
        const clientTool = { description: 'Change the client design', inputSchema: z.object({ nodeId: z.string() }) };
        sdk.streamText.mockReturnValue({
            textStream: toAsyncIterable([]),
            fullStream: toAsyncIterable([
                { type: 'start-step' },
                { type: 'text-delta', text: 'Proposed change' },
                { type: 'tool-call', toolCallId: 'call-1', toolName: 'client_edit', input: { nodeId: 'hero' } },
                { type: 'finish-step' },
            ]),
            text: Promise.resolve('Proposed change'),
            output: Promise.resolve('Proposed change'),
            finishReason: Promise.resolve('tool-calls'),
            usage: Promise.resolve({ inputTokens: 2, outputTokens: 1 }),
        });
        const generator = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());
        const stream = await generator.streamText({ prompt: 'Edit the hero' }, { includeRegisteredTools: false, tools: { client_edit: clientTool } });

        // act
        const events = [];
        for await (const event of stream.fullStream!) events.push(event);

        // assert
        expect(events).toEqual([
            { type: 'step', phase: 'start' },
            { type: 'text-delta', text: 'Proposed change' },
            { type: 'tool-call', toolCallId: 'call-1', toolName: 'client_edit', input: { nodeId: 'hero' } },
            { type: 'step', phase: 'finish' },
        ]);
        const settings = sdk.streamText.mock.calls[0][0];
        expect(settings.tools.client_edit.execute).toBeUndefined();
    });

    it('should resume a client tool result using the native JSON output contract', async () => {
        const output = { applied: true, createdIds: ['hero'] };
        sdk.generateText.mockResolvedValue(createFacadeLanguageResult('Done'));
        const generator = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());
        await generator.generateText(
            {
                messages: [
                    { role: 'assistant', content: [{ type: 'tool-call', toolCallId: 'edit-1', toolName: 'client_edit', input: { nodeId: 'hero' } }] },
                    { role: 'tool', content: [{ type: 'tool-result', toolCallId: 'edit-1', toolName: 'client_edit', output }] },
                ],
            },
            { includeRegisteredTools: false },
        );
        const settings = sdk.generateText.mock.calls[0][0];
        expect(settings.messages[1].content[0].output).toEqual({ type: 'json', value: output });
        expect(settings.messages[1].content[0].output.value).not.toBe(output);
    });

    it('should expose provider failures in the full stream', async () => {
        // arrange
        sdk.streamText.mockReturnValue({
            textStream: toAsyncIterable([]),
            fullStream: toAsyncIterable([{ type: 'error', error: 'provider unavailable' }]),
            text: Promise.resolve(''),
            output: Promise.resolve(''),
            finishReason: Promise.resolve('error'),
            usage: Promise.resolve(null),
        });
        const generator = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());
        const stream = await generator.streamText({ prompt: 'Edit' });

        // act
        const events = [];
        for await (const event of stream.fullStream!) events.push(event);

        // assert
        expect(events).toEqual([{ type: 'error', error: 'provider unavailable' }]);
    });

    it('should report the usage of every provider step once a text stream finished', async () => {
        // arrange
        sdk.streamText.mockReturnValue({
            textStream: toAsyncIterable(['Done']),
            partialOutputStream: toAsyncIterable([]),
            text: Promise.resolve('Done'),
            output: Promise.resolve('Done'),
            finishReason: Promise.resolve('stop'),
            usage: Promise.resolve({ inputTokens: 5, outputTokens: 3, totalTokens: 8 }),
            steps: Promise.resolve([
                { usage: { inputTokens: 2, outputTokens: 1, totalTokens: 3 } },
                { usage: { inputTokens: 3, outputTokens: 2, totalTokens: 5 } },
            ]),
        });
        const generator = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());
        const stream = await generator.streamText({ prompt: 'Stream with a tool.' });

        // act
        const stepUsage = await stream.stepUsage;

        // assert
        expect(stepUsage).toEqual([expect.objectContaining({ inputTokens: 2, outputTokens: 1 }), expect.objectContaining({ inputTokens: 3, outputTokens: 2 })]);
    });

    it.each(['text', 'object'] as const)('should isolate rejected %s stream promises without logging raw provider data', async (kind) => {
        // arrange
        const providerFailure = new Error('stream provider unavailable');
        const rawLog = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        sdk.streamText.mockImplementation((settings: { onError?: (event: { error: unknown }) => void }) => {
            (settings.onError ?? ((event) => console.error(event.error)))({ error: providerFailure });
            return {
                textStream: toRejectedAsyncIterable(providerFailure),
                text: Promise.reject(providerFailure),
                output: Promise.reject(providerFailure),
                partialOutputStream: toRejectedAsyncIterable(providerFailure),
                finishReason: Promise.reject(providerFailure),
                usage: Promise.reject(providerFailure),
            };
        });
        const generator = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());
        const consumeTextStream = async (): Promise<void> => {
            const iterable =
                kind === 'text'
                    ? (await generator.streamText({ prompt: 'Private user content.' })).textStream
                    : (await generator.streamObject({ prompt: 'Private user content.' }, z.object({ value: z.string() }))).partialOutputStream;

            for await (const chunk of iterable) {
                void chunk;
            }
        };

        // act
        const result = consumeTextStream();

        // assert
        await expect(result).rejects.toBeInstanceOf(IntelligenceProviderError);
        expect(rawLog).not.toHaveBeenCalled();
    });

    it('should report a timed-out provider call as a retryable provider failure', async () => {
        // arrange
        sdk.generateText.mockRejectedValue(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
        const generator = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());

        // act
        const result = generator.generateText({ prompt: 'Say hello.' });

        // assert
        await expect(result).rejects.toMatchObject({ name: 'IntelligenceProviderError', isRetryable: true });
    });

    it('should normalize language provider failures', async () => {
        // arrange
        const providerFailure = new Error('provider unavailable');
        sdk.generateText.mockRejectedValue(providerFailure);
        sdk.streamText.mockImplementation(() => {
            throw providerFailure;
        });
        const generator = new IntelligenceLanguageGenerator(modelResolver as never, new IntelligenceToolRegistry());
        const actions: ReadonlyArray<() => Promise<unknown>> = [
            () => generator.generateText({ prompt: 'text' }),
            () => generator.generateObject({ prompt: 'object' }, z.object({ value: z.string() })),
            () => generator.streamText({ prompt: 'stream text' }),
            () => generator.streamObject({ prompt: 'stream object' }, z.object({ value: z.string() })),
        ];

        // act
        const results = await Promise.allSettled(actions.map((action) => action()));

        // assert
        expect(results.every((result) => result.status === 'rejected' && result.reason instanceof IntelligenceProviderError)).toBe(true);
    });
});

function createFacadeLanguageResult<T>(output: T): Record<string, unknown> {
    return {
        text: typeof output === 'string' ? output : JSON.stringify(output),
        output,
        finalStep: { finishReason: 'stop' },
        sources: [],
        files: [],
        toolCalls: [],
        toolResults: [],
        warnings: [],
        usage: { inputTokens: 2, outputTokens: 1, totalTokens: 3 },
    };
}

function toAsyncIterable<T>(values: ReadonlyArray<T>): AsyncIterable<T> {
    return {
        async *[Symbol.asyncIterator]() {
            yield* values;
        },
    };
}

function toRejectedAsyncIterable(error: Error): AsyncIterable<never> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<never> {
            return {
                next: async (): Promise<IteratorResult<never>> => {
                    throw error;
                },
            };
        },
    };
}
