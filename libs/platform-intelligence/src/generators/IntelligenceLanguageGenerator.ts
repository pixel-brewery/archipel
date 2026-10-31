// #region Imports

import type { LanguageModelV2, LanguageModelV3, LanguageModelV4, LanguageModelV4CallOptions, LanguageModelV4GenerateResult } from '@ai-sdk/provider';
import { Injectable, Logger } from '@nestjs/common';
import type {
    GeneratedFile,
    GenerateTextStepStartEvent,
    LanguageModel,
    LanguageModelMiddleware,
    ModelMessage,
    Prompt,
    ToolExecutionEndEvent,
    ToolExecutionStartEvent,
    ToolSet,
} from 'ai';
import type { IIntelligenceGenerationStepStartEvent } from '../contracts/IIntelligenceGenerationStepStartEvent.js';
import type { IIntelligenceLanguageCallCapacity } from '../contracts/IIntelligenceLanguageCallCapacity.js';
import type { IIntelligenceLanguageCompletion } from '../contracts/IIntelligenceLanguageCompletion.js';
import type { IIntelligenceLanguageGenerationOptions } from '../contracts/IIntelligenceLanguageGenerationOptions.js';
import type { IIntelligenceLanguageStream } from '../contracts/IIntelligenceLanguageStream.js';
import type { IIntelligenceModelMessage } from '../contracts/IIntelligenceModelMessage.js';
import type { IIntelligenceModelStatus } from '../contracts/IIntelligenceModelStatus.js';
import type { IIntelligenceObjectStream } from '../contracts/IIntelligenceObjectStream.js';
import type { IIntelligencePreparedLanguageCall } from '../contracts/IIntelligencePreparedLanguageCall.js';
import type { IIntelligencePrompt } from '../contracts/IIntelligencePrompt.js';
import type { IIntelligenceProviderCallStartEvent } from '../contracts/IIntelligenceProviderCallStartEvent.js';
import type { IIntelligenceSchema } from '../contracts/IIntelligenceSchema.js';
import type { IIntelligenceToolCall } from '../contracts/IIntelligenceToolCall.js';
import type { IIntelligenceToolExecutionEndEvent } from '../contracts/IIntelligenceToolExecutionEndEvent.js';
import type { IIntelligenceToolExecutionStartEvent } from '../contracts/IIntelligenceToolExecutionStartEvent.js';
import type { IIntelligenceUsage } from '../contracts/IIntelligenceUsage.js';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import type { IntelligenceLanguageStreamPart } from '../contracts/IntelligenceLanguageStreamPart.js';
import { IntelligenceProviderError } from '../errors/IntelligenceProviderError.js';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import { IntelligenceModelResolver } from '../IntelligenceModelResolver.js';
import { IntelligenceToolRegistry } from '../IntelligenceToolRegistry.js';
import type { IIntelligenceTool } from '../interfaces/IIntelligenceTool.js';
import { isRetryableIntelligenceProviderError } from '../providers/isRetryableIntelligenceProviderError.js';
import { IntelligenceDeferredToolLoader } from '../runtime/IntelligenceDeferredToolLoader.js';
import { mapIntelligenceGeneratedFile } from '../runtime/mapIntelligenceGeneratedFile.js';
import { mapIntelligenceUsage } from '../runtime/mapIntelligenceUsage.js';
import { mapIntelligenceWarnings } from '../runtime/mapIntelligenceWarnings.js';
import { toAiSdkProviderOptions } from '../runtime/toAiSdkProviderOptions.js';
import { toAiSdkSchema } from '../runtime/toAiSdkSchema.js';
import { toAiSdkToolSet } from '../runtime/toAiSdkToolSet.js';

// #endregion

// #region Types

interface INativeLanguageResult<TOutput> {
    readonly text: string;
    readonly output: TOutput;
    readonly finalStep: {
        readonly finishReason: unknown;
        readonly reasoningText?: string;
    };
    readonly sources: ReadonlyArray<unknown>;
    readonly files: ReadonlyArray<GeneratedFile>;
    readonly toolCalls: ReadonlyArray<{
        readonly toolCallId: string;
        readonly toolName: string;
        readonly input: unknown;
    }>;
    readonly toolResults: ReadonlyArray<unknown>;
    readonly warnings?: ReadonlyArray<unknown>;
    readonly usage: unknown;
    readonly steps?: ReadonlyArray<INativeLanguageStep>;
}

interface INativeLanguageStep {
    readonly usage: unknown;
}

interface INativeLanguageStream<TOutput, TPartial> {
    readonly fullStream?: AsyncIterable<Record<string, unknown>>;
    readonly textStream: AsyncIterable<string>;
    readonly text: PromiseLike<string>;
    readonly output: PromiseLike<TOutput>;
    readonly partialOutputStream: AsyncIterable<TPartial>;
    readonly finishReason: PromiseLike<unknown>;
    readonly usage: PromiseLike<unknown>;
    readonly steps?: PromiseLike<ReadonlyArray<INativeLanguageStep>>;
}

interface IPreparedNativeLanguageCall<TOutput> {
    readonly provider: string;
    readonly model: string;
    readonly requestId: string;
    readonly capacity: IIntelligenceLanguageCallCapacity;
    readonly executeNative: () => Promise<INativeLanguageResult<TOutput>>;
    readonly outputMode: 'text' | 'structured';
}

interface INativeToolSettings {
    readonly tools: ToolSet;
    readonly prepareStep?: () => { readonly activeTools: Array<string> };
}

type NativeLanguageModel = LanguageModelV2 | LanguageModelV3 | LanguageModelV4;

// #endregion

/**
 * Provider-neutral language generation, structured output, and streaming facade.
 *
 * @public
 */
@Injectable()
export class IntelligenceLanguageGenerator {
    // #region Fields

    private readonly _logger = new Logger(IntelligenceLanguageGenerator.name);
    private readonly _modelResolver: IntelligenceModelResolver;
    private readonly _toolRegistry: IntelligenceToolRegistry;

    // #endregion

    // #region Ctor

    public constructor(modelResolver: IntelligenceModelResolver, toolRegistry: IntelligenceToolRegistry) {
        this._modelResolver = modelResolver;
        this._toolRegistry = toolRegistry;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Generates plain text and normalized tool metadata.
     *
     * @public
     */
    public async generateText(
        prompt: IIntelligencePrompt,
        options: IIntelligenceLanguageGenerationOptions = {},
    ): Promise<IIntelligenceLanguageCompletion<string>> {
        return this.generate(prompt, options);
    }

    /**
     * Resolves and validates a single-use text call without contacting the provider.
     *
     * The returned capacity snapshot is captured from the exact standardized
     * initial provider input through a local synthetic response. The optional
     * provider guard still runs later on every real provider attempt.
     *
     * @public
     */
    public async prepareText(
        prompt: IIntelligencePrompt,
        options: IIntelligenceLanguageGenerationOptions = {},
    ): Promise<IIntelligencePreparedLanguageCall<string>> {
        const prepared = await this.prepareLanguageCall<string>(prompt, options, undefined, true);
        let executed = false;

        return Object.freeze({
            provider: prepared.provider,
            model: prepared.model,
            capacity: prepared.capacity,
            execute: async (): Promise<IIntelligenceLanguageCompletion<string>> => {
                if (executed) {
                    throw new IntelligenceValidationError('A prepared intelligence language call can only be executed once.');
                }
                executed = true;
                return this.executePreparedLanguageCall(prepared);
            },
        });
    }

    /**
     * Generates a schema-constrained object through the language capability.
     *
     * @public
     */
    public async generateObject<T>(
        prompt: IIntelligencePrompt,
        schema: IIntelligenceSchema<T>,
        options: IIntelligenceLanguageGenerationOptions = {},
    ): Promise<IIntelligenceLanguageCompletion<T>> {
        const { Output } = await import('ai');
        const output = Output.object({
            schema: await toAiSdkSchema(schema),
        });

        return this.generate(prompt, options, output);
    }

    /**
     * Streams text without exposing the native AI SDK stream object.
     *
     * @public
     */
    public async streamText(prompt: IIntelligencePrompt, options: IIntelligenceLanguageGenerationOptions = {}): Promise<IIntelligenceLanguageStream> {
        const resolved = await this._modelResolver.resolve(IntelligenceCapabilityNames.Language, options.model, options.timeoutMs);

        try {
            const { streamText, wrapLanguageModel } = await import('ai');
            const result = streamText({
                ...this.createCallSettings(prompt, options, resolved.timeoutMs),
                // Promise observers log sanitized failures; the SDK default logs raw request data.
                onError: () => undefined,
                model: this.createProviderGuardedModel(resolved.handle as NativeLanguageModel, options.beforeProviderCall, wrapLanguageModel),
                ...(await this.resolveNativeToolSettings(options)),
            } as never) as unknown as INativeLanguageStream<string, string>;
            const failureState = { logged: false };
            const requestId = options.requestId ?? 'unknown';
            const text = this.observeLanguageStreamPromise(
                this.wrapLanguagePromise(result.text, resolved.provider, resolved.model),
                resolved.provider,
                resolved.model,
                requestId,
                failureState,
            );
            const finishReason = this.observeLanguageStreamPromise(
                this.wrapLanguagePromise(result.finishReason, resolved.provider, resolved.model).then((reason) => String(reason)),
                resolved.provider,
                resolved.model,
                requestId,
                failureState,
            );
            const usage = this.observeLanguageStreamPromise(
                this.wrapLanguagePromise(result.usage, resolved.provider, resolved.model).then((nativeUsage) => mapIntelligenceUsage(nativeUsage)),
                resolved.provider,
                resolved.model,
                requestId,
                failureState,
            );
            void this.observeLanguageStreamPromise(
                this.wrapLanguagePromise(result.output, resolved.provider, resolved.model),
                resolved.provider,
                resolved.model,
                requestId,
                failureState,
            );
            const stepUsage = this.observeStepUsage(result, resolved.provider, resolved.model, requestId, failureState);

            return {
                textStream: this.wrapLanguageStream(result.textStream, resolved.provider, resolved.model, text),
                ...(result.fullStream ? { fullStream: this.mapFullStream(result.fullStream) } : {}),
                text,
                finishReason,
                usage,
                ...(stepUsage ? { stepUsage } : {}),
            };
        } catch (error: unknown) {
            if (error instanceof IntelligenceValidationError) {
                throw error;
            }

            throw this.createProviderError(error, resolved.provider, resolved.model);
        }
    }

    /**
     * Streams partial structured output through the language capability.
     *
     * @public
     */
    public async streamObject<T>(
        prompt: IIntelligencePrompt,
        schema: IIntelligenceSchema<T>,
        options: IIntelligenceLanguageGenerationOptions = {},
    ): Promise<IIntelligenceObjectStream<T>> {
        const resolved = await this._modelResolver.resolve(IntelligenceCapabilityNames.Language, options.model, options.timeoutMs);
        const { Output, streamText, wrapLanguageModel } = await import('ai');
        const output = Output.object({
            schema: await toAiSdkSchema(schema),
        });

        try {
            const result = streamText({
                ...this.createCallSettings(prompt, options, resolved.timeoutMs),
                // Promise observers log sanitized failures; the SDK default logs raw request data.
                onError: () => undefined,
                model: this.createProviderGuardedModel(resolved.handle as NativeLanguageModel, options.beforeProviderCall, wrapLanguageModel),
                ...(await this.resolveNativeToolSettings(options)),
                output,
            } as never) as unknown as INativeLanguageStream<T, Partial<T>>;
            const failureState = { logged: false };
            const requestId = options.requestId ?? 'unknown';
            const outputPromise = this.observeLanguageStreamPromise(
                this.wrapLanguagePromise(result.output, resolved.provider, resolved.model),
                resolved.provider,
                resolved.model,
                requestId,
                failureState,
            );
            const finishReason = this.observeLanguageStreamPromise(
                this.wrapLanguagePromise(result.finishReason, resolved.provider, resolved.model).then((reason) => String(reason)),
                resolved.provider,
                resolved.model,
                requestId,
                failureState,
            );
            const usage = this.observeLanguageStreamPromise(
                this.wrapLanguagePromise(result.usage, resolved.provider, resolved.model).then((nativeUsage) => mapIntelligenceUsage(nativeUsage)),
                resolved.provider,
                resolved.model,
                requestId,
                failureState,
            );
            void this.observeLanguageStreamPromise(
                this.wrapLanguagePromise(result.text, resolved.provider, resolved.model),
                resolved.provider,
                resolved.model,
                requestId,
                failureState,
            );
            const stepUsage = this.observeStepUsage(result, resolved.provider, resolved.model, requestId, failureState);

            return {
                partialOutputStream: this.wrapLanguageStream(result.partialOutputStream, resolved.provider, resolved.model, outputPromise),
                output: outputPromise,
                finishReason,
                usage,
                ...(stepUsage ? { stepUsage } : {}),
            };
        } catch (error: unknown) {
            if (error instanceof IntelligenceValidationError) {
                throw error;
            }

            throw this.createProviderError(error, resolved.provider, resolved.model);
        }
    }

    /**
     * Returns the default language model without exposing credentials.
     *
     * @public
     */
    public getDefaultModel(): IIntelligenceModelStatus {
        const configuration = this._modelResolver.getDefaultConfiguration(IntelligenceCapabilityNames.Language);

        return {
            provider: configuration.provider,
            model: configuration.model,
        };
    }

    private async generate<TOutput>(
        prompt: IIntelligencePrompt,
        options: IIntelligenceLanguageGenerationOptions,
        output?: unknown,
    ): Promise<IIntelligenceLanguageCompletion<TOutput>> {
        const prepared = await this.prepareLanguageCall<TOutput>(prompt, options, output);

        return this.executePreparedLanguageCall(prepared);
    }

    private async prepareLanguageCall<TOutput>(
        prompt: IIntelligencePrompt,
        options: IIntelligenceLanguageGenerationOptions,
        output?: unknown,
        probeStandardizedInput = false,
    ): Promise<IPreparedNativeLanguageCall<TOutput>> {
        const resolved = await this._modelResolver.resolve(IntelligenceCapabilityNames.Language, options.model, options.timeoutMs);
        const { generateText, wrapLanguageModel } = await import('ai');
        const promptSnapshot = this.clonePrompt(prompt);
        const toolDefinitions = this.resolveToolDefinitions(options);
        const deferredToolLoader = this.resolveDeferredToolLoader(options, toolDefinitions);
        const tools = await toAiSdkToolSet(toolDefinitions);
        const callSettings = this.createCallSettings(promptSnapshot, options, resolved.timeoutMs);
        const createNativeOptionsWithoutModel = async (): Promise<Readonly<Record<string, unknown>>> => ({
            ...callSettings,
            ...(await this.createNativeToolSettings(tools, deferredToolLoader)),
            ...(output ? { output: output as never } : {}),
        });
        const capacity = probeStandardizedInput
            ? await this.probeStandardizedLanguageCallCapacity(
                  resolved.handle as NativeLanguageModel,
                  await createNativeOptionsWithoutModel(),
                  generateText,
                  wrapLanguageModel,
              )
            : this.createLanguageCallCapacity(promptSnapshot, deferredToolLoader?.selectInitialToolDefinitions(toolDefinitions) ?? toolDefinitions);
        const model = this.createProviderGuardedModel(resolved.handle as NativeLanguageModel, options.beforeProviderCall, wrapLanguageModel);
        const nativeOptions = {
            ...(await createNativeOptionsWithoutModel()),
            model,
        };

        return {
            provider: resolved.provider,
            model: resolved.model,
            requestId: options.requestId ?? 'unknown',
            capacity,
            outputMode: output === undefined ? 'text' : 'structured',
            executeNative: async () => (await generateText(nativeOptions as never)) as unknown as INativeLanguageResult<TOutput>,
        };
    }

    private async probeStandardizedLanguageCallCapacity(
        model: NativeLanguageModel,
        nativeOptionsWithoutModel: Readonly<Record<string, unknown>>,
        generateText: (typeof import('ai'))['generateText'],
        wrapLanguageModel: (typeof import('ai'))['wrapLanguageModel'],
    ): Promise<IIntelligenceLanguageCallCapacity> {
        let captured:
            | {
                  readonly model: LanguageModelV4;
                  readonly params: LanguageModelV4CallOptions;
              }
            | undefined;
        const probeResult: LanguageModelV4GenerateResult = {
            content: [{ type: 'text', text: '' }],
            finishReason: { unified: 'stop', raw: 'capacity-probe' },
            usage: {
                inputTokens: { total: 0, noCache: 0, cacheRead: 0, cacheWrite: 0 },
                outputTokens: { total: 0, text: 0, reasoning: 0 },
            },
            warnings: [],
        };
        const middleware: LanguageModelMiddleware = {
            specificationVersion: 'v4',
            wrapGenerate: async ({ params, model: nativeModel }) => {
                captured = { model: nativeModel, params };
                return probeResult;
            },
        };
        const probeModel = wrapLanguageModel({ model, middleware });

        await generateText({
            ...nativeOptionsWithoutModel,
            model: probeModel,
            maxRetries: 0,
            abortSignal: undefined,
            timeout: undefined,
            onStepStart: undefined,
            onToolExecutionStart: undefined,
            onToolExecutionEnd: undefined,
        } as never);

        if (!captured) {
            throw new IntelligenceValidationError('The standardized intelligence provider input could not be captured locally.');
        }

        return this.createStandardizedLanguageCallCapacity(captured.model, captured.params);
    }

    private createStandardizedLanguageCallCapacity(model: LanguageModelV4, params: LanguageModelV4CallOptions): IIntelligenceLanguageCallCapacity {
        const event = this.createProviderCallStartEvent(model, params, 1);
        const tools = params.tools ?? [];
        const maximumToolNameUtf8Bytes = tools.reduce(
            (maximum, tool) => (tool.type === 'function' ? Math.max(maximum, this.measureUtf8Bytes(tool.name)) : maximum),
            0,
        );

        return Object.freeze({
            serializedInputUtf8Bytes: event.inputUtf8Bytes,
            messageCount: params.prompt.length,
            toolCount: tools.length,
            maximumToolNameUtf8Bytes,
            textOnly: event.textOnly,
            opaqueToolCount: event.providerToolCount,
        });
    }

    private async executePreparedLanguageCall<TOutput>(prepared: IPreparedNativeLanguageCall<TOutput>): Promise<IIntelligenceLanguageCompletion<TOutput>> {
        const startedAt = Date.now();

        try {
            const result = await prepared.executeNative();
            const completion = this.mapCompletion<TOutput>(result, prepared.provider, prepared.model, prepared.outputMode);

            this._logger.log({
                message: 'Intelligence language call completed',
                requestId: prepared.requestId,
                module: 'platform-intelligence',
                operation: 'language.generate',
                provider: prepared.provider,
                model: prepared.model,
                duration: Date.now() - startedAt,
                inputTokens: completion.usage?.inputTokens ?? null,
                outputTokens: completion.usage?.outputTokens ?? null,
            });

            return completion;
        } catch (error: unknown) {
            if (error instanceof IntelligenceValidationError) {
                throw error;
            }

            const providerError = this.createProviderError(error, prepared.provider, prepared.model);
            this._logger.error({
                message: 'Intelligence language call failed',
                requestId: prepared.requestId,
                module: 'platform-intelligence',
                operation: 'language.generate',
                provider: prepared.provider,
                model: prepared.model,
                duration: Date.now() - startedAt,
                retryable: providerError.isRetryable,
            });
            throw providerError;
        }
    }

    private async *wrapLanguageStream<T>(stream: AsyncIterable<T>, provider: string, model: string, completion?: PromiseLike<unknown>): AsyncIterable<T> {
        try {
            yield* stream;

            if (completion) {
                await completion;
            }
        } catch (error: unknown) {
            if (error instanceof IntelligenceProviderError) {
                throw error;
            }

            throw this.createProviderError(error, provider, model);
        }
    }

    private async wrapLanguagePromise<T>(promise: PromiseLike<T>, provider: string, model: string): Promise<T> {
        try {
            return await promise;
        } catch (error: unknown) {
            throw this.createProviderError(error, provider, model);
        }
    }

    private observeLanguageStreamPromise<T>(
        promise: Promise<T>,
        provider: string,
        model: string,
        requestId: string,
        failureState: { logged: boolean },
    ): Promise<T> {
        void promise.catch((error: unknown) => {
            if (failureState.logged) {
                return;
            }

            failureState.logged = true;
            const providerError = error instanceof IntelligenceProviderError ? error : this.createProviderError(error, provider, model);
            this._logger.error({
                message: 'Intelligence language stream failed',
                requestId,
                module: 'platform-intelligence',
                operation: 'language.stream',
                provider,
                model,
                retryable: providerError.isRetryable,
            });
        });

        return promise;
    }

    private createProviderError(error: unknown, provider: string, model: string): IntelligenceProviderError {
        return new IntelligenceProviderError(
            'The intelligence language provider request failed.',
            provider,
            model,
            isRetryableIntelligenceProviderError(error),
            error instanceof Error ? error : undefined,
        );
    }

    private createProviderGuardedModel(
        model: NativeLanguageModel,
        beforeProviderCall: IIntelligenceLanguageGenerationOptions['beforeProviderCall'],
        wrapLanguageModel: (typeof import('ai'))['wrapLanguageModel'],
    ): LanguageModel {
        if (!beforeProviderCall) {
            return model;
        }

        let providerCallNumber = 0;
        const guard = async (nativeModel: { readonly provider: string; readonly modelId: string }, params: LanguageModelV4CallOptions): Promise<void> => {
            providerCallNumber += 1;
            const event = this.createProviderCallStartEvent(nativeModel, params, providerCallNumber);
            await beforeProviderCall(event);
        };
        const middleware: LanguageModelMiddleware = {
            specificationVersion: 'v4',
            wrapGenerate: async ({ doGenerate, params, model: nativeModel }) => {
                await guard(nativeModel, params);
                return doGenerate();
            },
            wrapStream: async ({ doStream, params, model: nativeModel }) => {
                await guard(nativeModel, params);
                return doStream();
            },
        };

        return wrapLanguageModel({ model, middleware });
    }

    private createProviderCallStartEvent(
        model: { readonly provider: string; readonly modelId: string },
        params: LanguageModelV4CallOptions,
        providerCallNumber: number,
    ): IIntelligenceProviderCallStartEvent {
        const measuredInput = {
            prompt: params.prompt,
            tools: params.tools,
            toolChoice: params.toolChoice,
            responseFormat: params.responseFormat,
            providerOptions: params.providerOptions,
        };
        const providerToolCount = params.tools?.filter((tool) => tool.type === 'provider').length ?? 0;

        return {
            provider: model.provider,
            modelId: model.modelId,
            providerCallNumber,
            inputUtf8Bytes: this.measureSerializedUtf8Bytes(measuredInput),
            maxOutputTokens: params.maxOutputTokens ?? null,
            textOnly: this.isTextOnlyProviderInput(params) && providerToolCount === 0,
            providerToolCount,
        };
    }

    private createLanguageCallCapacity(
        prompt: IIntelligencePrompt,
        tools: Readonly<Record<string, IIntelligenceTool['tool']>>,
    ): IIntelligenceLanguageCallCapacity {
        let opaqueToolCount = 0;
        const toolContracts = Object.entries(tools).map(([name, definition]) => {
            if ('nativeDefinition' in definition) {
                opaqueToolCount += 1;
                return { name, native: true };
            }

            const inputSchema = 'kind' in definition.inputSchema ? definition.inputSchema.jsonSchema : null;
            const outputSchema = definition.outputSchema && 'kind' in definition.outputSchema ? definition.outputSchema.jsonSchema : null;
            if (inputSchema === null || (definition.outputSchema !== undefined && outputSchema === null)) {
                opaqueToolCount += 1;
            }

            return {
                name,
                description: definition.description ?? null,
                inputSchema,
                outputSchema,
                needsApproval: definition.needsApproval ?? false,
                providerOptions: definition.providerOptions ?? null,
            };
        });
        const maximumToolNameUtf8Bytes = Object.keys(tools).reduce((maximum, name) => Math.max(maximum, this.measureUtf8Bytes(name)), 0);
        const measuredInput = {
            instructions: prompt.instructions ?? prompt.system ?? null,
            prompt: prompt.prompt ?? null,
            messages: prompt.messages ?? null,
            tools: toolContracts,
        };

        return Object.freeze({
            serializedInputUtf8Bytes: this.measureSerializedUtf8Bytes(measuredInput),
            messageCount: prompt.messages?.length ?? (prompt.prompt === undefined ? 0 : 1),
            toolCount: toolContracts.length,
            maximumToolNameUtf8Bytes,
            textOnly: this.isTextOnlyPrompt(prompt) && opaqueToolCount === 0,
            opaqueToolCount,
        });
    }

    private clonePrompt(prompt: IIntelligencePrompt): IIntelligencePrompt {
        return {
            ...(prompt.instructions === undefined ? {} : { instructions: prompt.instructions }),
            ...(prompt.system === undefined ? {} : { system: prompt.system }),
            ...(prompt.prompt === undefined ? {} : { prompt: prompt.prompt }),
            ...(prompt.messages === undefined ? {} : { messages: prompt.messages.map((message) => this.cloneModelMessage(message)) }),
        };
    }

    private cloneModelMessage(message: IIntelligenceModelMessage): IIntelligenceModelMessage {
        if (typeof message.content === 'string') {
            return { role: message.role, content: message.content } as IIntelligenceModelMessage;
        }
        if (message.role === 'tool') {
            return {
                role: 'tool',
                content: message.content.map((part) => ({
                    ...part,
                    output: structuredClone(part.output),
                })),
            };
        }

        return {
            role: message.role,
            content: message.content.map((part) => {
                if (part.type === 'tool-call') {
                    return { ...part, input: structuredClone(part.input) };
                }
                if (part.type === 'text') {
                    return { ...part };
                }
                if (part.type === 'image') {
                    return { ...part, image: this.cloneMediaValue(part.image) };
                }
                return { ...part, data: this.cloneMediaValue(part.data) };
            }),
        };
    }

    private cloneMediaValue(value: string | URL | Uint8Array | ArrayBuffer): string | URL | Uint8Array | ArrayBuffer {
        if (typeof value === 'string') {
            return value;
        }
        if (value instanceof URL) {
            return new URL(value.toString());
        }
        if (value instanceof Uint8Array) {
            return value.slice();
        }
        return value.slice(0);
    }

    private isTextOnlyPrompt(prompt: IIntelligencePrompt): boolean {
        return (
            prompt.messages?.every(
                (message) => message.role === 'tool' || typeof message.content === 'string' || message.content.every((part) => part.type === 'text'),
            ) ?? true
        );
    }

    private isTextOnlyProviderInput(params: LanguageModelV4CallOptions): boolean {
        return params.prompt.every((message) => {
            if (message.role === 'system') {
                return true;
            }
            return message.content.every((part) => part.type !== 'file' && part.type !== 'reasoning-file' && part.type !== 'custom');
        });
    }

    private measureSerializedUtf8Bytes(value: unknown): number {
        const serialized = JSON.stringify(value, (_key, item: unknown) => {
            if (item instanceof Uint8Array) {
                return { byteLength: item.byteLength, bytes: Array.from(item) };
            }
            if (item instanceof ArrayBuffer) {
                return { byteLength: item.byteLength, bytes: Array.from(new Uint8Array(item)) };
            }
            if (item instanceof URL) {
                return item.toString();
            }
            return item;
        });
        if (serialized === undefined) {
            throw new IntelligenceValidationError('The prepared intelligence language input is not serializable.');
        }
        return this.measureUtf8Bytes(serialized);
    }

    private measureUtf8Bytes(value: string): number {
        return new TextEncoder().encode(value).byteLength;
    }

    private createCallSettings(prompt: IIntelligencePrompt, options: IIntelligenceLanguageGenerationOptions, timeoutMs: number): Record<string, unknown> {
        this.validateOptions(options);

        return {
            ...this.createNativePrompt(prompt),
            ...(prompt.instructions ? { instructions: prompt.instructions } : {}),
            ...(prompt.system ? { system: prompt.system } : {}),
            temperature: options.temperature,
            topP: options.topP,
            maxOutputTokens: options.maxOutputTokens,
            maxRetries: options.maxRetries ?? 2,
            abortSignal: options.abortSignal,
            timeout: timeoutMs,
            headers: options.headers ? { ...options.headers } : undefined,
            providerOptions: toAiSdkProviderOptions(options.providerOptions),
            toolChoice: options.toolChoice,
            activeTools: options.activeToolNames ? Array.from(options.activeToolNames) : undefined,
            stopWhen: options.maxSteps ? this.createStepLimit(options.maxSteps) : undefined,
            onStepStart: options.onStepStart ? (event: GenerateTextStepStartEvent<ToolSet>) => options.onStepStart?.(this.mapStepStartEvent(event)) : undefined,
            onToolExecutionStart: options.onToolExecutionStart
                ? (event: ToolExecutionStartEvent<ToolSet>) => options.onToolExecutionStart?.(this.mapToolExecutionStartEvent(event))
                : undefined,
            onToolExecutionEnd: options.onToolExecutionEnd
                ? (event: ToolExecutionEndEvent<ToolSet>) => options.onToolExecutionEnd?.(this.mapToolExecutionEndEvent(event))
                : undefined,
        };
    }

    private async *mapFullStream(stream: AsyncIterable<Record<string, unknown>>): AsyncGenerator<IntelligenceLanguageStreamPart> {
        for await (const part of stream) {
            switch (part['type']) {
                case 'text-delta':
                    yield { type: 'text-delta', text: String(part['text']) };
                    break;
                case 'tool-call':
                    yield { type: 'tool-call', toolCallId: String(part['toolCallId']), toolName: String(part['toolName']), input: part['input'] };
                    break;
                case 'tool-result':
                    yield { type: 'tool-result', toolCallId: String(part['toolCallId']), toolName: String(part['toolName']), output: part['output'] };
                    break;
                case 'start-step':
                case 'finish-step':
                    yield { type: 'step', phase: part['type'] === 'start-step' ? 'start' : 'finish' };
                    break;
                case 'error':
                case 'tool-error':
                    yield { type: 'error', error: part['error'] };
                    break;
            }
        }
    }

    private createNativePrompt(prompt: IIntelligencePrompt): Prompt {
        const hasPrompt = typeof prompt.prompt === 'string';
        const hasMessages = prompt.messages !== undefined;
        if (hasPrompt === hasMessages) {
            throw new IntelligenceValidationError('Exactly one of prompt.prompt or prompt.messages must be provided.');
        }

        return hasPrompt
            ? { prompt: prompt.prompt as string }
            : {
                  messages: Array.from(prompt.messages ?? []).map((message) =>
                      message.role === 'tool'
                          ? { ...message, content: message.content.map((part) => ({ ...part, output: { type: 'json', value: part.output } })) }
                          : message,
                  ) as Array<ModelMessage>,
              };
    }

    private resolveToolDefinitions(options: IIntelligenceLanguageGenerationOptions): Record<string, IIntelligenceTool['tool']> {
        const tools: Record<string, IIntelligenceTool['tool']> = {
            ...(options.includeRegisteredTools === false ? {} : this._toolRegistry.toExecutionToolSet()),
            ...(options.tools ?? {}),
        };

        if (options.deferredToolLoading !== undefined && options.activeToolNames !== undefined) {
            throw new IntelligenceValidationError('deferredToolLoading cannot be combined with activeToolNames.');
        }
        if (options.activeToolNames === undefined) {
            return tools;
        }

        const activeToolNames = Array.from(options.activeToolNames);
        if (new Set(activeToolNames).size !== activeToolNames.length) {
            throw new IntelligenceValidationError('activeToolNames must not contain duplicate tool names.');
        }

        const activeToolEntries = activeToolNames.map((toolName) => {
            if (!Object.hasOwn(tools, toolName)) {
                throw new IntelligenceValidationError(`Active intelligence tool "${toolName}" is not available for this call.`);
            }

            return [toolName, tools[toolName]] as const;
        });

        return Object.fromEntries(activeToolEntries);
    }

    private resolveDeferredToolLoader(
        options: IIntelligenceLanguageGenerationOptions,
        tools: Readonly<Record<string, IIntelligenceTool['tool']>>,
    ): IntelligenceDeferredToolLoader | undefined {
        if (options.deferredToolLoading === undefined) {
            return undefined;
        }
        if (options.maxSteps === undefined || options.maxSteps < 2) {
            throw new IntelligenceValidationError('deferredToolLoading requires maxSteps of at least 2 so loaded tools can be called in a later step.');
        }

        const deferredToolLoader = IntelligenceDeferredToolLoader.create(options.deferredToolLoading, tools);
        const toolChoice = options.toolChoice;
        if (typeof toolChoice === 'object' && !deferredToolLoader.isInitiallyActive(toolChoice.toolName)) {
            throw new IntelligenceValidationError(
                `Tool choice "${toolChoice.toolName}" must name an initial tool or the deferred tool loader "${deferredToolLoader.loaderToolName}".`,
            );
        }

        return deferredToolLoader;
    }

    private async resolveNativeToolSettings(options: IIntelligenceLanguageGenerationOptions): Promise<INativeToolSettings> {
        const toolDefinitions = this.resolveToolDefinitions(options);
        const deferredToolLoader = this.resolveDeferredToolLoader(options, toolDefinitions);

        return this.createNativeToolSettings(await toAiSdkToolSet(toolDefinitions), deferredToolLoader);
    }

    private async createNativeToolSettings(tools: ToolSet, deferredToolLoader: IntelligenceDeferredToolLoader | undefined): Promise<INativeToolSettings> {
        return deferredToolLoader ? deferredToolLoader.createNativeToolSettings(tools) : { tools };
    }

    private createStepLimit(maxSteps: number): (context: { readonly steps: ReadonlyArray<unknown> }) => boolean {
        return ({ steps }) => steps.length >= maxSteps;
    }

    private mapCompletion<TOutput>(
        result: INativeLanguageResult<TOutput>,
        provider: string,
        model: string,
        outputMode: 'text' | 'structured',
    ): IIntelligenceLanguageCompletion<TOutput> {
        const finalStep = result.finalStep;

        return {
            text: result.text,
            // Text mode also permits a tool-only response. The SDK's structured output getter throws for that valid step.
            output: outputMode === 'text' ? (result.text as TOutput) : result.output,
            provider,
            model,
            finishReason: String(finalStep.finishReason),
            ...(finalStep.reasoningText ? { reasoningText: finalStep.reasoningText } : {}),
            sources: result.sources.map((source) => {
                const record = source as unknown as Readonly<Record<string, unknown>>;

                return {
                    type: typeof record['sourceType'] === 'string' ? record['sourceType'] : 'source',
                    ...(typeof record['id'] === 'string' ? { id: record['id'] } : {}),
                    ...(typeof record['url'] === 'string' ? { url: record['url'] } : {}),
                    ...(typeof record['title'] === 'string' ? { title: record['title'] } : {}),
                };
            }),
            files: result.files.map(mapIntelligenceGeneratedFile),
            toolCalls: result.toolCalls.map((toolCall) => this.mapToolCall(toolCall)),
            toolResults: result.toolResults,
            warnings: mapIntelligenceWarnings(result.warnings),
            usage: mapIntelligenceUsage(result.usage),
            ...(result.steps ? { stepUsage: this.mapStepUsage(result.steps) } : {}),
        };
    }

    private mapStepUsage(steps: ReadonlyArray<INativeLanguageStep>): ReadonlyArray<IIntelligenceUsage | null> {
        return steps.map((step) => mapIntelligenceUsage(step.usage));
    }

    private observeStepUsage(
        result: INativeLanguageStream<unknown, unknown>,
        provider: string,
        model: string,
        requestId: string,
        failureState: { logged: boolean },
    ): PromiseLike<ReadonlyArray<IIntelligenceUsage | null>> | undefined {
        if (!result.steps) {
            return undefined;
        }

        return this.observeLanguageStreamPromise(
            this.wrapLanguagePromise(result.steps, provider, model).then((steps) => this.mapStepUsage(steps)),
            provider,
            model,
            requestId,
            failureState,
        );
    }

    private mapStepStartEvent(event: GenerateTextStepStartEvent<ToolSet>): IIntelligenceGenerationStepStartEvent {
        return {
            callId: event.callId,
            provider: event.provider,
            modelId: event.modelId,
            stepNumber: event.stepNumber,
        };
    }

    private mapToolExecutionStartEvent(event: ToolExecutionStartEvent<ToolSet>): IIntelligenceToolExecutionStartEvent {
        return {
            callId: event.callId,
            toolCall: this.mapToolCall(event.toolCall),
        };
    }

    private mapToolExecutionEndEvent(event: ToolExecutionEndEvent<ToolSet>): IIntelligenceToolExecutionEndEvent {
        const toolOutput = event.toolOutput;

        return {
            callId: event.callId,
            toolCall: this.mapToolCall(event.toolCall),
            toolOutput:
                toolOutput.type === 'tool-result' ? { type: 'tool-result', output: toolOutput.output } : { type: 'tool-error', error: toolOutput.error },
            toolExecutionMs: event.toolExecutionMs,
        };
    }

    private mapToolCall(toolCall: { readonly toolCallId: string; readonly toolName: string; readonly input: unknown }): IIntelligenceToolCall {
        return {
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            input: toolCall.input,
        };
    }

    private validateOptions(options: IIntelligenceLanguageGenerationOptions): void {
        if (options.temperature !== undefined && (options.temperature < 0 || options.temperature > 2)) {
            throw new IntelligenceValidationError('Temperature must be between 0 and 2.');
        }
        if (options.topP !== undefined && (options.topP < 0 || options.topP > 1)) {
            throw new IntelligenceValidationError('Top-p must be between 0 and 1.');
        }
        if (options.maxOutputTokens !== undefined && (!Number.isSafeInteger(options.maxOutputTokens) || options.maxOutputTokens < 1)) {
            throw new IntelligenceValidationError('maxOutputTokens must be a positive safe integer.');
        }
        if (options.maxSteps !== undefined && (!Number.isSafeInteger(options.maxSteps) || options.maxSteps < 1 || options.maxSteps > 100)) {
            throw new IntelligenceValidationError('maxSteps must be a safe integer between 1 and 100.');
        }
        if (options.maxRetries !== undefined && (!Number.isSafeInteger(options.maxRetries) || options.maxRetries < 0 || options.maxRetries > 10)) {
            throw new IntelligenceValidationError('maxRetries must be a safe integer between 0 and 10.');
        }
    }

    // #endregion
}
