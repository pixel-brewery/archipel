import type { LanguageModelV4, LanguageModelV4GenerateResult, LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigModule, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceModule, IntelligenceProviderAdapterBase, IntelligenceCapabilityNames } from '@pixel-brewery/archipel-platform-intelligence';
import { Agent } from './participants/Agent.js';
import { AgentsModule } from './AgentsModule.js';
import { AgentRuntimeFactory } from './AgentRuntimeFactory.js';
import type { AgentEvent } from './events/AgentEvent.js';
const usage = { inputTokens: { total: 7, noCache: 7, cacheRead: 0, cacheWrite: 0 }, outputTokens: { total: 2, text: 2, reasoning: 0 } };
const generated = (content: LanguageModelV4GenerateResult['content'], finishReason: 'stop' | 'tool-calls' = 'stop'): LanguageModelV4GenerateResult => ({
    content,
    finishReason: { unified: finishReason, raw: finishReason },
    usage,
    warnings: [],
});
const generate = vi.fn<LanguageModelV4['doGenerate']>();
const stream = vi.fn<LanguageModelV4['doStream']>();
const streamed = (parts: ReadonlyArray<LanguageModelV4StreamPart>) => ({
    stream: new ReadableStream<LanguageModelV4StreamPart>({
        start(controller) {
            for (const part of parts) {
                controller.enqueue(part);
            }
            controller.close();
        },
    }),
});
/**
 * Exposes deterministic AI SDK models while exercising real intelligence composition.
 *
 * @internal
 */
class LocalProvider extends IntelligenceProviderAdapterBase {
    // #region Fields
    /**
     * Provider identifier used by the local model-selection fixture.
     */
    public readonly provider = 'local' as const;
    /**
     * Language capability exposed by this provider fixture.
     */
    public readonly capabilities: readonly ['language'] = [IntelligenceCapabilityNames.Language] as const;
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Loads the deterministic language model with spyable generation boundaries.
     *
     * @returns An AI SDK model whose generate and stream calls use the test doubles.
     */
    public override async load(): Promise<LanguageModelV4> {
        return { specificationVersion: 'v4', provider: 'local', modelId: 'local-model', supportedUrls: {}, doGenerate: generate, doStream: stream };
    }
    // #endregion
}
afterEach(() => {
    vi.restoreAllMocks();
    generate.mockReset();
    stream.mockReset();
});
describe('Agent runtime through real IntelligenceModule and AI SDK', () => {
    it('preserves the provider guard, owns tool effects and feeds their result into the next provider request', async () => {
        // arrange
        generate
            .mockResolvedValueOnce(generated([{ type: 'tool-call', toolCallId: 'provider-call', toolName: 'echo', input: '{"value":"input"}' }], 'tool-calls'))
            .mockResolvedValueOnce(generated([{ type: 'text', text: 'Inspected.' }]));
        const execute = vi.fn().mockResolvedValue({ accepted: true });
        const guard = vi.fn().mockResolvedValue(undefined);
        const events: AgentEvent[] = [];
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy() }),
                AgentsModule.register({
                    imports: [
                        IntelligenceModule.register({
                            providerAdapters: [LocalProvider],
                            defaultModels: { language: { provider: 'local', model: 'local-model' } },
                        }),
                    ],
                }),
            ],
        }).compile();
        await module.init();
        const runtime = module.get(AgentRuntimeFactory).create({
            eventSink: {
                publish: (event) => {
                    events.push(event);
                },
            },
        });
        runtime.join(
            new Agent({
                id: 'inspector',
                name: 'Inspector',
                instruction: 'Inspect input.',
                tools: {
                    echo: {
                        inputSchema: { kind: 'json-schema', jsonSchema: { type: 'object', properties: { value: { type: 'string' } }, required: ['value'] } },
                        execute,
                    },
                },
            }),
        );
        // act
        const result = await runtime.runLoop('inspector', 'Inspect now.', { generation: { beforeProviderCall: guard, maxRetries: 0 } });
        await runtime.drain();
        // assert
        expect(result.result?.text).toBe('Inspected.');
        expect(generate).toHaveBeenCalledTimes(2);
        expect(guard).toHaveBeenCalledTimes(2);
        expect(execute).toHaveBeenCalledOnce();
        expect(execute.mock.calls[0][1].toolCallId).toBe('provider-call');
        expect(JSON.stringify(generate.mock.calls[1][0].prompt)).toContain('accepted');
        expect(events.filter((event) => event.type === 'inference.completed')).toHaveLength(2);
        expect(events.find((event) => event.type === 'inference.completed')?.payload).toMatchObject({ result: { usage: { inputTokens: 7, outputTokens: 2 } } });
        await module.close();
    });
    it('streams a tool-only provider step and then the final answer through the real SDK', async () => {
        // arrange
        stream
            .mockResolvedValueOnce(
                streamed([
                    { type: 'stream-start', warnings: [] },
                    { type: 'tool-call', toolCallId: 'stream-call', toolName: 'echo', input: '{}' },
                    { type: 'finish', usage, finishReason: { unified: 'tool-calls', raw: 'tool-calls' } },
                ]),
            )
            .mockResolvedValueOnce(
                streamed([
                    { type: 'stream-start', warnings: [] },
                    { type: 'text-start', id: 'text' },
                    { type: 'text-delta', id: 'text', delta: 'Streamed answer.' },
                    { type: 'text-end', id: 'text' },
                    { type: 'finish', usage, finishReason: { unified: 'stop', raw: 'stop' } },
                ]),
            );
        const execute = vi.fn().mockResolvedValue('ok');
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy() }),
                AgentsModule.register({
                    imports: [
                        IntelligenceModule.register({
                            providerAdapters: [LocalProvider],
                            defaultModels: { language: { provider: 'local', model: 'local-model' } },
                        }),
                    ],
                }),
            ],
        }).compile();
        await module.init();
        const runtime = module.get(AgentRuntimeFactory).create();
        runtime.join(
            new Agent({
                id: 'agent',
                name: 'Agent',
                instruction: '',
                tools: { echo: { inputSchema: { kind: 'json-schema', jsonSchema: { type: 'object' } }, execute } },
            }),
        );
        // act
        const result = await runtime.runLoop('agent', 'Inspect', { streaming: true, generation: { maxRetries: 0 } });
        // assert
        expect(result.result?.text).toBe('Streamed answer.');
        expect(stream).toHaveBeenCalledTimes(2);
        expect(execute).toHaveBeenCalledOnce();
        await module.close();
    });
    it('produces a schema-constrained final result after the tool conversation', async () => {
        // arrange
        generate
            .mockResolvedValueOnce(generated([{ type: 'tool-call', toolCallId: 'call', toolName: 'echo', input: '{}' }], 'tool-calls'))
            .mockResolvedValueOnce(generated([{ type: 'text', text: 'Inspected.' }]))
            .mockResolvedValueOnce(generated([{ type: 'text', text: '{"accepted":true}' }]));
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy() }),
                AgentsModule.register({
                    imports: [
                        IntelligenceModule.register({
                            providerAdapters: [LocalProvider],
                            defaultModels: { language: { provider: 'local', model: 'local-model' } },
                        }),
                    ],
                }),
            ],
        }).compile();
        await module.init();
        const runtime = module.get(AgentRuntimeFactory).create();
        runtime.join(
            new Agent({
                id: 'agent',
                name: 'Agent',
                instruction: '',
                tools: { echo: { inputSchema: { kind: 'json-schema', jsonSchema: { type: 'object' } }, execute: async () => 'ok' } },
            }),
        );
        // act
        const result = await runtime.runLoop('agent', 'Inspect', {
            schema: { kind: 'json-schema', jsonSchema: { type: 'object', properties: { accepted: { type: 'boolean' } }, required: ['accepted'] } },
            generation: { maxRetries: 0 },
        });
        // assert
        expect(result.result?.output).toEqual({ accepted: true });
        expect(generate).toHaveBeenCalledTimes(3);
        expect(generate.mock.calls[2][0].tools ?? []).toHaveLength(0);
        await module.close();
    });
    it('prevents provider contact when the application fence rejects', async () => {
        // arrange
        vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy() }),
                AgentsModule.register({
                    imports: [
                        IntelligenceModule.register({
                            providerAdapters: [LocalProvider],
                            defaultModels: { language: { provider: 'local', model: 'local-model' } },
                        }),
                    ],
                }),
            ],
        }).compile();
        await module.init();
        const runtime = module.get(AgentRuntimeFactory).create();
        runtime.join(new Agent({ id: 'agent', name: 'Agent', instruction: '' }));
        // act
        const result = runtime.runLoop('agent', 'Inspect', {
            generation: {
                beforeProviderCall: () => {
                    throw new Error('fence rejected');
                },
                maxRetries: 0,
            },
        });
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INFERENCE_FAILED' });
        expect(generate).not.toHaveBeenCalled();
        await module.close();
    });
});
