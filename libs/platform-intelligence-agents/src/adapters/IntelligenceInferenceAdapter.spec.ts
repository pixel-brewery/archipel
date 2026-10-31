import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IntelligenceLanguageGenerator } from '@pixel-brewery/archipel-platform-intelligence';
import type { IIntelligenceLanguageCompletion, IIntelligenceLanguageStream } from '@pixel-brewery/archipel-platform-intelligence';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceInferenceAdapter } from './IntelligenceInferenceAdapter.js';
import type { IAgentInferenceRequest } from '../interfaces/IAgentInferenceRequest.js';
import type { AgentInferenceEvent } from '../contracts/AgentInferenceEvent.js';
const completion = (): IIntelligenceLanguageCompletion => ({
    text: 'answer',
    output: 'answer',
    provider: 'test',
    model: 'model',
    finishReason: 'stop',
    sources: [],
    files: [],
    toolCalls: [],
    toolResults: [],
    warnings: [],
    usage: null,
});
const request = (): IAgentInferenceRequest => ({
    prompt: { prompt: 'inspect' },
    options: {
        requestId: 'test-request',
        maxSteps: 100,
        includeRegisteredTools: true,
        tools: { echo: { description: 'Echo', inputSchema: { kind: 'json-schema', jsonSchema: { type: 'object' } }, execute: vi.fn() } },
    },
});
const fixture = async () => {
    const language = {
        generateText: vi.fn().mockResolvedValue(completion()),
        generateObject: vi.fn().mockResolvedValue({ ...completion(), output: { answer: true } }),
        streamText: vi.fn(),
        streamObject: vi.fn(),
    };
    const module = await Test.createTestingModule({
        providers: [IntelligenceInferenceAdapter, { provide: IntelligenceLanguageGenerator, useValue: language }],
    }).compile();
    return { adapter: module.get(IntelligenceInferenceAdapter), language };
};
async function collect(events: AsyncIterable<AgentInferenceEvent>): Promise<AgentInferenceEvent[]> {
    const result: AgentInferenceEvent[] = [];
    for await (const event of events) {
        result.push(event);
    }
    return result;
}
afterEach(() => vi.restoreAllMocks());
describe('Intelligence inference adapter', () => {
    it('forces one provider step and removes all effect executors and global tool exposure', async () => {
        // arrange
        const { adapter, language } = await fixture();
        // act
        const result = await adapter.run(request());
        // assert
        expect(result.text).toBe('answer');
        const options = language.generateText.mock.calls[0][1];
        expect(options).toMatchObject({ maxSteps: 1, includeRegisteredTools: false });
        expect(options.tools.echo).not.toHaveProperty('execute');
        expect(options.tools.echo).not.toHaveProperty('needsApproval');
    });
    it('delegates schema-constrained generation to the existing intelligence contract', async () => {
        // arrange
        const { adapter, language } = await fixture();
        const schema = { kind: 'json-schema' as const, jsonSchema: { type: 'object' } };
        // act
        const result = await adapter.run({ ...request(), schema });
        // assert
        expect(language.generateObject.mock.calls[0][1]).toBe(schema);
        expect(result.output).toEqual({ answer: true });
    });
    it('wraps provider failures without leaking credentials', async () => {
        // arrange
        const { adapter, language } = await fixture();
        language.generateText.mockRejectedValue(new Error('secret=private'));
        // act
        const result = adapter.run(request());
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INFERENCE_FAILED', message: 'Agent inference failed.' });
    });
    it('preserves streamed tool call metadata without executing tools', async () => {
        // arrange
        const { adapter, language } = await fixture();
        const stream: IIntelligenceLanguageStream = {
            fullStream: (async function* () {
                yield { type: 'text-delta' as const, text: 'answer' };
                yield { type: 'tool-call' as const, toolCallId: 'call', toolName: 'echo', input: {} };
            })(),
            textStream: (async function* () {
                yield 'answer';
            })(),
            text: Promise.resolve('answer'),
            usage: Promise.resolve(null),
            finishReason: Promise.resolve('tool-calls'),
        };
        language.streamText.mockResolvedValue(stream);
        // act
        const events = await collect(adapter.stream(request()));
        // assert
        expect(events.at(-1)).toMatchObject({ type: 'output', result: { text: 'answer', toolCalls: [{ toolCallId: 'call', toolName: 'echo', input: {} }] } });
        expect(events).toHaveLength(3);
    });
    it('streams partial structured answers and emits the validated final object', async () => {
        // arrange
        const { adapter, language } = await fixture();
        language.streamObject.mockResolvedValue({
            partialOutputStream: (async function* () {
                yield { answer: true };
            })(),
            output: Promise.resolve({ answer: true }),
            usage: Promise.resolve(null),
            finishReason: Promise.resolve('stop'),
        });
        // act
        const events = await collect(
            adapter.stream({ prompt: request().prompt, options: {}, schema: { kind: 'json-schema', jsonSchema: { type: 'object' } } }),
        );
        // assert
        expect(events).toEqual([
            { type: 'partial-output', output: { answer: true } },
            {
                type: 'output',
                result: { text: '{"answer":true}', output: { answer: true }, toolCalls: [], usage: null, finishReason: 'stop', stepUsage: undefined },
            },
        ]);
    });
    it('streams text-only adapters without requiring a full stream', async () => {
        // arrange
        const { adapter, language } = await fixture();
        language.streamText.mockResolvedValue({
            textStream: (async function* () {
                yield 'answer';
            })(),
            text: Promise.resolve('answer'),
            usage: Promise.resolve(null),
            finishReason: Promise.resolve('stop'),
        });
        // act
        const events = await collect(adapter.stream({ prompt: request().prompt, options: {} }));
        // assert
        expect(events[0]).toEqual({ type: 'text-delta', text: 'answer' });
        expect(events.at(-1)).toMatchObject({ type: 'output' });
    });
    it('rejects tool streaming that cannot report selected calls', async () => {
        // arrange
        const { adapter, language } = await fixture();
        language.streamText.mockResolvedValue({
            textStream: (async function* () {
                yield 'answer';
            })(),
            text: Promise.resolve('answer'),
            usage: Promise.resolve(null),
            finishReason: Promise.resolve('stop'),
        });
        // act
        const events = collect(adapter.stream(request()));
        // assert
        await expect(events).rejects.toMatchObject({ code: 'INVALID_STREAM' });
    });
    it('rejects a structured tool step that should have been split by the runtime', async () => {
        // arrange
        const { adapter } = await fixture();
        // act
        const events = collect(adapter.stream({ ...request(), schema: { kind: 'json-schema', jsonSchema: { type: 'object' } } }));
        // assert
        await expect(events).rejects.toMatchObject({ code: 'INVALID_STREAM' });
    });
    it('wraps streamed provider errors', async () => {
        // arrange
        const { adapter, language } = await fixture();
        language.streamText.mockRejectedValue(new Error('private token'));
        // act
        const events = collect(adapter.stream(request()));
        // assert
        await expect(events).rejects.toMatchObject({ code: 'INFERENCE_FAILED' });
    });
    it('observes rejected stream metadata without an unhandled promise rejection', async () => {
        // arrange
        const { adapter, language } = await fixture();
        vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        language.streamText.mockResolvedValue({
            fullStream: (async function* () {
                yield { type: 'text-delta', text: 'partial' };
            })(),
            text: Promise.reject(new Error('private metadata')),
            usage: Promise.resolve(null),
            finishReason: Promise.resolve('error'),
        });
        // act
        const events = collect(adapter.stream(request()));
        // assert
        await expect(events).rejects.toMatchObject({ code: 'INFERENCE_FAILED' });
        expect(Logger.prototype.warn).toHaveBeenCalledWith(expect.objectContaining({ code: 'INFERENCE_METADATA_FAILED' }));
    });
});
