import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { IIntelligenceLanguageGenerationOptions, IIntelligenceToolCall, IIntelligenceToolDefinition } from '@pixel-brewery/archipel-platform-intelligence';
import { IntelligenceLanguageGenerator } from '@pixel-brewery/archipel-platform-intelligence';
import type { AgentInferenceEvent } from '../contracts/AgentInferenceEvent.js';
import type { IAgentInferenceRequest } from '../interfaces/IAgentInferenceRequest.js';
import type { IAgentInferenceResult } from '../interfaces/IAgentInferenceResult.js';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';
import { AgentInferenceBase } from '../abstracts/AgentInferenceBase.js';

/**
 * Uses Archipel's existing models, validation, provider resilience and streaming.
 *
 * @public
 */
@Injectable()
export class IntelligenceInferenceAdapter extends AgentInferenceBase {
    // #region Fields
    private readonly _generator: IntelligenceLanguageGenerator;
    private readonly _logger: Logger = new Logger(IntelligenceInferenceAdapter.name);
    // #endregion

    // #region Ctor
    /**
     * Connects the agent inference boundary to the configured language generator.
     *
     * @param generator - Canonical owner of provider selection, validation, retries and usage normalization.
     */
    public constructor(generator: IntelligenceLanguageGenerator) {
        super();
        this._generator = generator;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Generates one model response through the canonical intelligence infrastructure.
     *
     * @remarks
     * Only tool declarations reach the provider. Approval and tool effects remain with the interceptable agent loop.
     * @param request - Instructions, messages, schema and provider controls for a single step.
     * @returns Normalized text or structured output, tool calls and provider usage evidence.
     * @throws {AgentRuntimeError} When tool declarations, provider preparation or generation fail.
     */
    public override async run(request: IAgentInferenceRequest): Promise<IAgentInferenceResult> {
        try {
            const options = this.declarations(request.options);
            const result = request.schema
                ? await this._generator.generateObject(request.prompt, request.schema, options)
                : await this._generator.generateText(request.prompt, options);
            return {
                text: result.text,
                output: result.output,
                reasoningText: result.reasoningText,
                toolCalls: result.toolCalls,
                usage: result.usage,
                stepUsage: result.stepUsage,
                finishReason: result.finishReason,
            };
        } catch (_error: unknown) {
            throw new AgentRuntimeError('INFERENCE_FAILED', 'Agent inference failed.');
        }
    }
    /**
     * Streams incremental provider events and one normalized final response.
     *
     * @param request - Instructions, messages, schema and provider controls for a single step.
     * @returns Text/tool events or partial structured output, followed by one final output event.
     * @throws {AgentRuntimeError} When declarations, stream content or provider metadata are invalid or unavailable.
     */
    public override async *stream(request: IAgentInferenceRequest): AsyncIterable<AgentInferenceEvent> {
        const startedAt = Date.now();
        try {
            const options = this.declarations(request.options);
            if (request.schema) {
                if (Object.keys(options.tools ?? {}).length > 0) {
                    throw new AgentRuntimeError('INVALID_STREAM', 'Structured streaming requires a tool-free final step.');
                }
                const result = await this._generator.streamObject(request.prompt, request.schema, options);
                // Observe metadata immediately; some providers reject it before the stream itself fails.
                const metadata = Promise.all([result.output, result.usage, result.finishReason, result.stepUsage]);
                void metadata.catch((_error: unknown) =>
                    this._logger.warn({
                        module: 'platform-intelligence-agents',
                        operation: 'stream',
                        requestId: options.requestId,
                        duration: Date.now() - startedAt,
                        code: 'INFERENCE_METADATA_FAILED',
                    }),
                );
                for await (const output of result.partialOutputStream) {
                    yield { type: 'partial-output', output };
                }
                const [output, usage, finishReason, stepUsage] = await metadata;
                yield { type: 'output', result: { text: JSON.stringify(output), output, toolCalls: [], usage, finishReason, stepUsage } };
                return;
            }
            const result = await this._generator.streamText(request.prompt, options);
            const metadata = Promise.all([result.text, result.usage, result.finishReason, result.stepUsage]);
            void metadata.catch((_error: unknown) =>
                this._logger.warn({
                    module: 'platform-intelligence-agents',
                    operation: 'stream',
                    requestId: options.requestId,
                    duration: Date.now() - startedAt,
                    code: 'INFERENCE_METADATA_FAILED',
                }),
            );
            const calls: IIntelligenceToolCall[] = [];
            if (result.fullStream) {
                for await (const part of result.fullStream) {
                    if (part.type === 'error') {
                        throw new AgentRuntimeError('INFERENCE_FAILED', 'Agent stream failed.');
                    }
                    if (part.type === 'tool-call') {
                        calls.push(part);
                    }
                    yield part;
                }
            } else {
                if (Object.keys(options.tools ?? {}).length > 0) {
                    throw new AgentRuntimeError('INVALID_STREAM', 'Tool streaming requires a full intelligence stream.');
                }
                for await (const text of result.textStream) {
                    yield { type: 'text-delta', text };
                }
            }
            const [text, usage, finishReason, stepUsage] = await metadata;
            yield { type: 'output', result: { text, output: text, toolCalls: calls, usage, finishReason, stepUsage } };
        } catch (error: unknown) {
            if (error instanceof AgentRuntimeError) {
                throw error;
            }
            throw new AgentRuntimeError('INFERENCE_FAILED', 'Agent stream failed.');
        }
    }
    private declarations(options: IIntelligenceLanguageGenerationOptions): IIntelligenceLanguageGenerationOptions {
        const tools: Record<string, IIntelligenceToolDefinition> = {};
        for (const [name, tool] of Object.entries(options.tools ?? {})) {
            if ('nativeDefinition' in tool) {
                throw new AgentRuntimeError('INVALID_TOOL', 'Agent loops require application tool declarations.');
            }
            tools[name] = { description: tool.description, inputSchema: tool.inputSchema, providerOptions: tool.providerOptions };
        }
        return {
            ...options,
            requestId: options.requestId ?? randomUUID(),
            tools,
            maxSteps: 1,
            includeRegisteredTools: false,
            activeToolNames: undefined,
            deferredToolLoading: undefined,
            onToolExecutionStart: undefined,
            onToolExecutionEnd: undefined,
        };
    }
    // #endregion
}
