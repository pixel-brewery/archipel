// #region Imports

import type { TranscriptionModelV4 } from '@ai-sdk/provider';
import { Injectable } from '@nestjs/common';
import type { IIntelligenceStreamingTranscriptionOptions } from '../contracts/IIntelligenceStreamingTranscriptionOptions.js';
import type { IIntelligenceTranscriptionOptions } from '../contracts/IIntelligenceTranscriptionOptions.js';
import type { IIntelligenceTranscriptionResult } from '../contracts/IIntelligenceTranscriptionResult.js';
import type { IIntelligenceTranscriptionStream } from '../contracts/IIntelligenceTranscriptionStream.js';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import type { IntelligenceProviderOptions } from '../contracts/IntelligenceProviderOptions.js';
import type { IntelligenceTranscriptionStreamPart } from '../contracts/IntelligenceTranscriptionStreamPart.js';
import { IntelligenceModelResolver } from '../IntelligenceModelResolver.js';
import { createIntelligenceRequestSignal } from '../runtime/createIntelligenceRequestSignal.js';
import { mapIntelligenceWarnings } from '../runtime/mapIntelligenceWarnings.js';
import { toAiSdkProviderOptions } from '../runtime/toAiSdkProviderOptions.js';
import { IntelligenceGeneratorBase } from './abstracts/IntelligenceGeneratorBase.js';

// #endregion

// #region Types

interface INativeTranscriptionStream {
    readonly fullStream: AsyncIterable<Readonly<Record<string, unknown>>>;
    readonly text: PromiseLike<string>;
    readonly segments: PromiseLike<ReadonlyArray<{ readonly text: string; readonly startSecond: number; readonly endSecond: number }>>;
    readonly language: PromiseLike<string | undefined>;
    readonly durationInSeconds: PromiseLike<number | undefined>;
    readonly warnings: PromiseLike<ReadonlyArray<unknown>>;
}

// #endregion

/**
 * Provider-neutral bounded and streaming transcription facade.
 *
 * @public
 */
@Injectable()
export class IntelligenceTranscriptionGenerator extends IntelligenceGeneratorBase {
    // #region Fields

    // #endregion

    // #region Ctor

    public constructor(modelResolver: IntelligenceModelResolver) {
        super(modelResolver, IntelligenceTranscriptionGenerator.name);
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Transcribes bounded audio input.
     *
     * @public
     */
    public async transcribe(options: IIntelligenceTranscriptionOptions): Promise<IIntelligenceTranscriptionResult> {
        const startedAt = Date.now();
        const resolved = await this.modelResolver.resolve(IntelligenceCapabilityNames.Transcription, options.model, options.timeoutMs);

        try {
            const { transcribe } = await import('ai');
            const result = await transcribe({
                model: resolved.handle as TranscriptionModelV4,
                audio: options.audio,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
                maxRetries: options.maxRetries ?? 2,
                abortSignal: createIntelligenceRequestSignal(resolved.timeoutMs, options.abortSignal),
                headers: options.headers ? { ...options.headers } : undefined,
            });

            return {
                text: result.text,
                segments: result.segments,
                ...(result.language ? { language: result.language } : {}),
                ...(result.durationInSeconds !== undefined ? { durationInSeconds: result.durationInSeconds } : {}),
                provider: resolved.provider,
                model: resolved.model,
                warnings: mapIntelligenceWarnings(result.warnings),
            };
        } catch (error: unknown) {
            throw this.createProviderError(
                error,
                resolved.provider,
                resolved.model,
                IntelligenceCapabilityNames.Transcription,
                'transcription.transcribe',
                options.requestId,
                startedAt,
            );
        }
    }

    /**
     * Streams incremental and final transcripts from live raw audio.
     *
     * @public
     */
    public async stream(options: IIntelligenceStreamingTranscriptionOptions): Promise<IIntelligenceTranscriptionStream> {
        const startedAt = Date.now();
        const resolved = await this.modelResolver.resolve(IntelligenceCapabilityNames.Transcription, options.model, options.timeoutMs);

        try {
            const { experimental_streamTranscribe: streamTranscribe } = await import('ai');
            const result = streamTranscribe({
                model: resolved.handle as TranscriptionModelV4,
                audio: options.audio,
                inputAudioFormat: { ...options.inputAudioFormat },
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
                abortSignal: createIntelligenceRequestSignal(resolved.timeoutMs, options.abortSignal),
                headers: options.headers ? { ...options.headers } : undefined,
                includeRawChunks: options.includeRawChunks,
            }) as unknown as INativeTranscriptionStream;
            const wrapPromise = <T>(promise: PromiseLike<T>): Promise<T> =>
                this.wrapTranscriptionPromise(promise, resolved.provider, resolved.model, options.requestId, startedAt);
            const wrapStream = (): AsyncIterable<IntelligenceTranscriptionStreamPart> =>
                this.wrapTranscriptionStream(result.fullStream, resolved.provider, resolved.model, options.requestId, startedAt);

            return {
                provider: resolved.provider,
                model: resolved.model,
                get fullStream(): AsyncIterable<IntelligenceTranscriptionStreamPart> {
                    return wrapStream();
                },
                get text(): PromiseLike<string> {
                    return wrapPromise(result.text);
                },
                get segments(): PromiseLike<ReadonlyArray<{ readonly text: string; readonly startSecond: number; readonly endSecond: number }>> {
                    return wrapPromise(result.segments);
                },
                get language(): PromiseLike<string | undefined> {
                    return wrapPromise(result.language);
                },
                get durationInSeconds(): PromiseLike<number | undefined> {
                    return wrapPromise(result.durationInSeconds);
                },
                get warnings(): PromiseLike<ReadonlyArray<string>> {
                    return wrapPromise(result.warnings).then(mapIntelligenceWarnings);
                },
            };
        } catch (error: unknown) {
            throw this.createProviderError(
                error,
                resolved.provider,
                resolved.model,
                IntelligenceCapabilityNames.Transcription,
                'transcription.stream',
                options.requestId,
                startedAt,
            );
        }
    }

    private static mapTranscriptionPart(part: Readonly<Record<string, unknown>>): IntelligenceTranscriptionStreamPart {
        switch (part['type']) {
            case 'transcript-delta':
                return {
                    type: 'transcript-delta',
                    ...(typeof part['id'] === 'string' ? { id: part['id'] } : {}),
                    delta: String(part['delta'] ?? ''),
                    ...(part['providerMetadata'] ? { providerMetadata: part['providerMetadata'] as IntelligenceProviderOptions } : {}),
                };
            case 'transcript-partial':
                return {
                    type: 'transcript-partial',
                    ...(typeof part['id'] === 'string' ? { id: part['id'] } : {}),
                    text: String(part['text'] ?? ''),
                    ...(typeof part['startSecond'] === 'number' ? { startSecond: part['startSecond'] } : {}),
                    ...(typeof part['durationInSeconds'] === 'number' ? { durationInSeconds: part['durationInSeconds'] } : {}),
                    ...(typeof part['channelIndex'] === 'number' ? { channelIndex: part['channelIndex'] } : {}),
                    ...(part['providerMetadata'] ? { providerMetadata: part['providerMetadata'] as IntelligenceProviderOptions } : {}),
                };
            case 'transcript-final':
                return {
                    type: 'transcript-final',
                    ...(typeof part['id'] === 'string' ? { id: part['id'] } : {}),
                    text: String(part['text'] ?? ''),
                    ...(typeof part['startSecond'] === 'number' ? { startSecond: part['startSecond'] } : {}),
                    ...(typeof part['endSecond'] === 'number' ? { endSecond: part['endSecond'] } : {}),
                    ...(typeof part['channelIndex'] === 'number' ? { channelIndex: part['channelIndex'] } : {}),
                    ...(part['providerMetadata'] ? { providerMetadata: part['providerMetadata'] as IntelligenceProviderOptions } : {}),
                };
            case 'raw':
                return { type: 'raw', rawValue: part['rawValue'] };
            case 'error':
                return { type: 'error', error: part['error'] };
            default:
                return { type: 'raw', rawValue: part };
        }
    }

    private async *wrapTranscriptionStream(
        stream: AsyncIterable<Readonly<Record<string, unknown>>>,
        provider: string,
        model: string,
        requestId: string | undefined,
        startedAt: number,
    ): AsyncIterable<IntelligenceTranscriptionStreamPart> {
        try {
            for await (const part of stream) {
                yield IntelligenceTranscriptionGenerator.mapTranscriptionPart(part);
            }
        } catch (error: unknown) {
            throw this.createProviderError(error, provider, model, IntelligenceCapabilityNames.Transcription, 'transcription.stream', requestId, startedAt);
        }
    }

    private async wrapTranscriptionPromise<T>(
        promise: PromiseLike<T>,
        provider: string,
        model: string,
        requestId: string | undefined,
        startedAt: number,
    ): Promise<T> {
        try {
            return await promise;
        } catch (error: unknown) {
            throw this.createProviderError(error, provider, model, IntelligenceCapabilityNames.Transcription, 'transcription.stream', requestId, startedAt);
        }
    }

    // #endregion
}
