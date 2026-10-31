// #region Imports

import type {
    Experimental_RealtimeModelV4 as RealtimeModelV4,
    Experimental_RealtimeModelV4SessionConfig as RealtimeModelV4SessionConfig,
} from '@ai-sdk/provider';
import { Inject, Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import { IntelligenceConfigurationError } from './errors/IntelligenceConfigurationError.js';
import { IntelligenceRealtimeError } from './errors/IntelligenceRealtimeError.js';
import { IntelligenceValidationError } from './errors/IntelligenceValidationError.js';
import { IntelligenceModelResolver } from './IntelligenceModelResolver.js';
import { IntelligenceProviderRegistry } from './IntelligenceProviderRegistry.js';
import { IntelligenceToolRegistry } from './IntelligenceToolRegistry.js';
import type { IntelligenceProviderAdapterBase } from './providers/abstracts/IntelligenceProviderAdapterBase.js';
import type { IIntelligenceProviderLoadRequest } from './providers/IIntelligenceProviderLoadRequest.js';
import type { IIntelligenceProviderWebRTCClosure } from './providers/IIntelligenceProviderWebRTCClosure.js';
import type { IIntelligenceProviderWebRTCTerminationRequest } from './providers/IIntelligenceProviderWebRTCTerminationRequest.js';
import { VercelAiSdkRealtimeSession } from './realtime/adapters/VercelAiSdkRealtimeSession.js';
import type { IIntelligenceRealtimeConversationTurn } from './realtime/contracts/IIntelligenceRealtimeConversationTurn.js';
import type { IIntelligenceRealtimeRuntimeOptions } from './realtime/contracts/IIntelligenceRealtimeRuntimeOptions.js';
import type { IIntelligenceRealtimeSessionConfiguration } from './realtime/contracts/IIntelligenceRealtimeSessionConfiguration.js';
import type { IIntelligenceRealtimeToolDefinition } from './realtime/contracts/IIntelligenceRealtimeToolDefinition.js';
import type { IntelligenceRealtimeConnectionMode } from './realtime/contracts/IntelligenceRealtimeConnectionMode.js';
import { IntelligenceRealtimeConversationHistoryLimits } from './realtime/contracts/IntelligenceRealtimeConversationHistoryLimits.js';
import type { IntelligenceRealtimeConversationHistoryStatus } from './realtime/contracts/IntelligenceRealtimeConversationHistoryStatus.js';
import type { IntelligenceRealtimeWebRTCTerminationStatus } from './realtime/contracts/IntelligenceRealtimeWebRTCTerminationStatus.js';
import type { IIntelligenceRealtimeSessionOptions } from './realtime/interfaces/IIntelligenceRealtimeSessionOptions.js';
import type { IIntelligenceRealtimeWebRTCSessionOptions } from './realtime/interfaces/IIntelligenceRealtimeWebRTCSessionOptions.js';
import type { IIntelligenceRealtimeWebRTCSessionResult } from './realtime/interfaces/IIntelligenceRealtimeWebRTCSessionResult.js';
import type { IIntelligenceRealtimeWebRTCConfiguration } from './realtime/interfaces/IIntelligenceRealtimeWebRTCConfiguration.js';
import type { IIntelligenceRealtimeWebRTCTerminationOptions } from './realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationOptions.js';
import type { IIntelligenceRealtimeWebRTCTerminationResult } from './realtime/interfaces/IIntelligenceRealtimeWebRTCTerminationResult.js';
import { IntelligenceRealtimeMeteringBase } from './realtime/abstracts/IntelligenceRealtimeMeteringBase.js';
import { IntelligenceRealtimeSessionBase } from './realtime/abstracts/IntelligenceRealtimeSessionBase.js';
import { toAiSdkToolSet } from './runtime/toAiSdkToolSet.js';
import { INTELLIGENCE_REALTIME_RUNTIME_OPTIONS_TOKEN } from './tokens/IntelligenceRealtimeRuntimeOptionsToken.js';

// #endregion

// #region Types

interface IWebRTCSessionSetup {
    readonly sessionConfiguration: IIntelligenceRealtimeSessionConfiguration | undefined;
    readonly conversationHistory: IntelligenceRealtimeConversationHistoryStatus;
}

interface IWebRTCTerminationOutcome {
    readonly status: IntelligenceRealtimeWebRTCTerminationStatus;
    readonly durationSeconds: number | null;
}

// #endregion

/**
 * Creates server-owned WebSocket sessions, negotiates browser-owned WebRTC
 * sessions, and ends browser-owned WebRTC sessions at their provider.
 *
 * Applications forward normalized events and audio chunks through their own
 * authenticated WebSocket gateway for server-owned sessions. Provider
 * credentials, event mapping, and upstream sockets remain inside Archipel.
 *
 * @public
 */
@Injectable()
export class IntelligenceRealtimeSessionFactory implements OnModuleDestroy {
    // #region Fields

    private static readonly _MAX_METADATA_ENTRIES = 32;
    private static readonly _MAX_METADATA_KEY_CHARACTERS = 100;
    private static readonly _MAX_METADATA_STRING_CHARACTERS = 1_000;
    private static readonly _MAX_SESSION_INSTRUCTION_CHARACTERS = 100_000;
    private static readonly _MAX_REALTIME_TOOLS = 128;
    private static readonly _MAX_SDP_BYTES = 1_048_576;
    private static readonly _MAX_PROVIDER_SESSION_ID_CHARACTERS = 200;
    private static readonly _MAX_TERMINATION_REASON_CHARACTERS = 100;
    private readonly _activeSessions = new Map<string, IntelligenceRealtimeSessionBase>();
    private readonly _logger = new Logger(IntelligenceRealtimeSessionFactory.name);
    private readonly _metering: IntelligenceRealtimeMeteringBase;
    private readonly _modelResolver: IntelligenceModelResolver;
    private readonly _providerRegistry: IntelligenceProviderRegistry;
    private readonly _runtime: IIntelligenceRealtimeRuntimeOptions;
    private readonly _toolRegistry: IntelligenceToolRegistry;
    private _pendingSessionCount = 0;

    // #endregion

    // #region Ctor

    public constructor(
        modelResolver: IntelligenceModelResolver,
        providerRegistry: IntelligenceProviderRegistry,
        toolRegistry: IntelligenceToolRegistry,
        metering: IntelligenceRealtimeMeteringBase,
        @Inject(INTELLIGENCE_REALTIME_RUNTIME_OPTIONS_TOKEN) runtime: IIntelligenceRealtimeRuntimeOptions,
    ) {
        this._modelResolver = modelResolver;
        this._providerRegistry = providerRegistry;
        this._toolRegistry = toolRegistry;
        this._metering = metering;
        this._runtime = runtime;
    }

    // #endregion

    // #region Properties

    /** Number of sessions currently owned by this module instance. */
    public get activeSessionCount(): number {
        return this._activeSessions.size;
    }

    /** Providers currently registered for server-owned realtime sessions. */
    public get registeredProviders(): ReadonlyArray<string> {
        return this._providerRegistry.listProvidersFor(IntelligenceCapabilityNames.Realtime);
    }

    // #endregion

    // #region Methods

    /**
     * Creates a WebSocket session or exchanges a browser SDP offer for WebRTC.
     *
     * WebSocket results remain server-owned and require `connect()`. A WebRTC
     * result contains the SDP answer; the browser owns its media connection.
     * A WebRTC session that continues an earlier conversation can receive its
     * recent turns through `conversationHistory`; the result reports whether
     * the provider received them or cannot take them during setup.
     *
     * @throws IntelligenceValidationError when options are invalid or the conversation history exceeds
     * `IntelligenceRealtimeConversationHistoryLimits`, before any provider request.
     */
    public createSession(options: IIntelligenceRealtimeWebRTCSessionOptions): Promise<IIntelligenceRealtimeWebRTCSessionResult>;
    public createSession(options: IIntelligenceRealtimeSessionOptions): Promise<IntelligenceRealtimeSessionBase>;
    public createSession(
        options: IIntelligenceRealtimeSessionOptions | IIntelligenceRealtimeWebRTCSessionOptions,
    ): Promise<IntelligenceRealtimeSessionBase | IIntelligenceRealtimeWebRTCSessionResult>;
    public async createSession(
        options: IIntelligenceRealtimeSessionOptions | IIntelligenceRealtimeWebRTCSessionOptions,
    ): Promise<IntelligenceRealtimeSessionBase | IIntelligenceRealtimeWebRTCSessionResult> {
        if (options.connectionMode === 'webrtc') {
            return this.createWebRTCSession(options);
        }

        return this.createWebSocketSession(options);
    }

    /** Returns the data-channel label the browser needs before making its SDP offer. */
    public async getWebRTCConfiguration(options: { readonly provider?: string; readonly model: string }): Promise<IIntelligenceRealtimeWebRTCConfiguration> {
        if (options.model.trim().length === 0 || options.model.length > 200) {
            throw new IntelligenceValidationError('Realtime model must be non-empty and no longer than 200 characters.');
        }

        const resolved = await this._modelResolver.resolve(
            IntelligenceCapabilityNames.Realtime,
            { provider: options.provider, model: options.model },
            this._runtime.connectionTimeoutMs,
        );
        const model = resolved.handle as RealtimeModelV4;
        const { dataChannelLabel } = this.resolveWebRTCConnection(model);

        return { connectionMode: 'webrtc', provider: resolved.provider, model: resolved.model, dataChannelLabel };
    }

    /** Closes all server-owned upstream sessions during Nest application shutdown. */
    public async onModuleDestroy(): Promise<void> {
        const sessions = Array.from(this._activeSessions.values());
        await Promise.allSettled(sessions.map((session) => session.close(1_001, 'Archipel module shutdown')));
        this._activeSessions.clear();
    }

    /**
     * Reports whether a registered realtime provider can end browser-owned
     * WebRTC sessions from the server.
     *
     * Fail-closed applications check this before they negotiate a
     * browser-owned session whose provider usage they must be able to stop.
     * A provider that supports termination can still report `unsupported`
     * for an individual model whose provider API cannot end sessions.
     *
     * @throws IntelligenceConfigurationError when the provider is not registered for realtime.
     */
    public supportsWebRTCSessionTermination(provider: string): boolean {
        const adapter = this._providerRegistry.resolve(provider, IntelligenceCapabilityNames.Realtime);

        return typeof adapter.terminateWebRTCSession === 'function';
    }

    /**
     * Ends a browser-owned WebRTC session at its provider with server credentials.
     *
     * The provider session keeps running, and consuming provider usage, for as
     * long as the browser keeps its peer connection open, even after the
     * application has stopped renewing or billing it. Call this when the
     * application's connection lease expires, when the browser reports that it
     * closed the connection, and when the logical session completes.
     *
     * Termination is idempotent: an unknown or already ended provider session
     * resolves as `already-ended`, so concurrent triggers can call it safely.
     * A provider whose final usage is reported only on its server control
     * channel closes the running session there first, which returns the
     * provider-reported `durationSeconds`; within half of the budget it falls
     * back to the plain termination request, which reports no duration.
     * A provider without a server-side termination API resolves as
     * `unsupported` without a provider request, and that session can keep
     * running. The whole operation, including up to `terminationMaxRetries`
     * retries of transient failures, is bounded by `closeTimeoutMs`.
     *
     * @throws IntelligenceValidationError when an identifier is invalid, before any provider request.
     * @throws IntelligenceConfigurationError when the provider is not registered for realtime or has no credentials.
     * @throws IntelligenceRealtimeError with phase `close` when the provider rejects or fails the request;
     * `isRetryable` marks transient failures that a later call can resolve.
     */
    public async terminateWebRTCSession(options: IIntelligenceRealtimeWebRTCTerminationOptions): Promise<IIntelligenceRealtimeWebRTCTerminationResult> {
        const startedAt = Date.now();
        this.validateTerminationOptions(options);
        const { adapter, request } = this._modelResolver.resolveRequest(
            IntelligenceCapabilityNames.Realtime,
            { provider: options.provider, model: options.model },
            this._runtime.closeTimeoutMs,
        );
        const { provider, model } = request.configuration;
        const logContext = {
            requestId: options.requestId ?? 'unknown',
            module: 'platform-intelligence',
            operation: 'realtime.terminateWebRTCSession',
            provider,
            model,
            reason: options.reason ?? 'unspecified',
        };

        let outcome: IWebRTCTerminationOutcome;
        try {
            outcome = await this.requestWebRTCTermination(adapter, request, options);
        } catch (error: unknown) {
            this._logger.warn({
                message: 'Intelligence realtime WebRTC termination failed.',
                ...logContext,
                errorType: error instanceof Error ? error.name : typeof error,
                retryable: error instanceof IntelligenceRealtimeError && error.isRetryable,
                duration: Date.now() - startedAt,
            });
            throw error;
        }

        if (outcome.status === 'unsupported') {
            this._logger.warn({
                message: 'Intelligence realtime provider cannot terminate the WebRTC session.',
                ...logContext,
                duration: Date.now() - startedAt,
            });
        } else {
            this._logger.debug({
                message: 'Intelligence realtime WebRTC termination completed.',
                ...logContext,
                status: outcome.status,
                durationSeconds: outcome.durationSeconds,
                duration: Date.now() - startedAt,
            });
        }

        return {
            status: outcome.status,
            sessionId: options.sessionId,
            providerSessionId: options.providerSessionId,
            provider,
            model,
            ...(outcome.durationSeconds === null ? {} : { durationSeconds: outcome.durationSeconds }),
        };
    }

    private async createWebSocketSession(options: IIntelligenceRealtimeSessionOptions): Promise<IntelligenceRealtimeSessionBase> {
        const startedAt = Date.now();
        this.validateWebSocketOptions(options);
        if (this._activeSessions.size + this._pendingSessionCount >= this._runtime.maxActiveSessions) {
            throw new IntelligenceValidationError(`Maximum active realtime sessions (${this._runtime.maxActiveSessions}) reached.`);
        }

        this._pendingSessionCount++;
        try {
            const resolved = await this._modelResolver.resolve(
                IntelligenceCapabilityNames.Realtime,
                {
                    provider: options.provider,
                    model: options.model,
                },
                this._runtime.connectionTimeoutMs,
            );
            const model = resolved.handle as RealtimeModelV4;
            const connectionMode = this.resolveWebSocketMode(model, options.connectionMode ?? 'auto');
            const sessionConfiguration = await this.resolveSessionConfiguration(options, model);
            const session = new VercelAiSdkRealtimeSession({
                model,
                provider: resolved.provider,
                connectionMode,
                session: {
                    ...options,
                    sessionConfiguration,
                },
                runtime: this._runtime,
                metering: this._metering,
                onDisposed: (connectionId: string) => this._activeSessions.delete(connectionId),
            });

            this._activeSessions.set(session.connectionId, session);
            this._logger.debug({
                message: 'Intelligence realtime session created.',
                requestId: options.requestId ?? 'unknown',
                module: 'platform-intelligence',
                operation: 'realtime.createSession',
                provider: resolved.provider,
                model: resolved.model,
                connectionMode,
                duration: Date.now() - startedAt,
            });

            return session;
        } finally {
            this._pendingSessionCount--;
        }
    }

    private async createWebRTCSession(options: IIntelligenceRealtimeWebRTCSessionOptions): Promise<IIntelligenceRealtimeWebRTCSessionResult> {
        this.validateCommonOptions(options);
        if (options.offerSdp.trim().length === 0 || Buffer.byteLength(options.offerSdp, 'utf8') > IntelligenceRealtimeSessionFactory._MAX_SDP_BYTES) {
            throw new IntelligenceValidationError('Realtime WebRTC offerSdp must be non-empty and no larger than 1 MiB.');
        }
        if (options.conversationHistory !== undefined) {
            this.validateConversationHistory(options.conversationHistory);
        }
        if (this._activeSessions.size + this._pendingSessionCount >= this._runtime.maxActiveSessions) {
            throw new IntelligenceValidationError(`Maximum active realtime sessions (${this._runtime.maxActiveSessions}) reached.`);
        }

        this._pendingSessionCount++;
        try {
            const resolved = await this._modelResolver.resolve(
                IntelligenceCapabilityNames.Realtime,
                { provider: options.provider, model: options.model },
                this._runtime.connectionTimeoutMs,
            );
            const model = resolved.handle as RealtimeModelV4;
            const { dataChannelLabel, doCreateWebRTCSession } = this.resolveWebRTCConnection(model);
            const setup = options.conversationHistory === undefined ? null : await this.applyConversationHistory(options, options.conversationHistory);

            const abortController = new AbortController();
            let timeout: NodeJS.Timeout | null = null;
            const timeoutPromise = new Promise<never>((_resolve, reject) => {
                timeout = setTimeout(() => {
                    reject(
                        new IntelligenceRealtimeError(
                            `Realtime WebRTC session setup timed out after ${this._runtime.connectionTimeoutMs}ms.`,
                            'connect',
                            resolved.provider,
                            options.model,
                            options.sessionId,
                            true,
                        ),
                    );
                    abortController.abort();
                }, this._runtime.connectionTimeoutMs);
            });

            try {
                const answer = await Promise.race([
                    doCreateWebRTCSession.call(model, {
                        sdp: options.offerSdp,
                        sessionConfig: (setup?.sessionConfiguration ?? options.sessionConfiguration) as RealtimeModelV4SessionConfig | undefined,
                        abortSignal: abortController.signal,
                    }),
                    timeoutPromise,
                ]);
                if (
                    typeof answer.sessionId !== 'string' ||
                    answer.sessionId.trim().length === 0 ||
                    typeof answer.sdp !== 'string' ||
                    answer.sdp.trim().length === 0 ||
                    Buffer.byteLength(answer.sdp, 'utf8') > IntelligenceRealtimeSessionFactory._MAX_SDP_BYTES
                ) {
                    throw new IntelligenceRealtimeError(
                        'Realtime model returned an invalid WebRTC session answer.',
                        'connect',
                        resolved.provider,
                        options.model,
                        options.sessionId,
                        false,
                    );
                }

                return {
                    connectionMode: 'webrtc',
                    sessionId: options.sessionId,
                    providerSessionId: answer.sessionId,
                    provider: resolved.provider,
                    model: resolved.model,
                    answerSdp: answer.sdp,
                    dataChannelLabel,
                    ...(setup === null ? {} : { conversationHistory: setup.conversationHistory }),
                };
            } catch (error: unknown) {
                if (error instanceof IntelligenceRealtimeError) {
                    throw error;
                }

                throw new IntelligenceRealtimeError(
                    error instanceof Error ? error.message : String(error),
                    'connect',
                    resolved.provider,
                    options.model,
                    options.sessionId,
                    error instanceof Error && 'isRetryable' in error && error.isRetryable === true,
                    error instanceof Error ? error : undefined,
                );
            } finally {
                if (timeout) {
                    clearTimeout(timeout);
                }
            }
        } finally {
            this._pendingSessionCount--;
        }
    }

    /** Lets the provider adapter add validated earlier turns to the WebRTC setup, or reports that it cannot. */
    private async applyConversationHistory(
        options: IIntelligenceRealtimeWebRTCSessionOptions,
        conversationHistory: ReadonlyArray<IIntelligenceRealtimeConversationTurn>,
    ): Promise<IWebRTCSessionSetup> {
        const { adapter, request } = this._modelResolver.resolveRequest(
            IntelligenceCapabilityNames.Realtime,
            { provider: options.provider, model: options.model },
            this._runtime.connectionTimeoutMs,
        );
        const sessionConfiguration = await adapter.applyWebRTCConversationHistory?.({
            ...request,
            sessionConfiguration: options.sessionConfiguration ?? {},
            conversationHistory,
        });
        if (sessionConfiguration) {
            return { sessionConfiguration, conversationHistory: 'handed-over' };
        }

        this._logger.warn({
            message: 'Intelligence realtime model cannot receive conversation history; the WebRTC session starts without it.',
            requestId: options.requestId ?? 'unknown',
            module: 'platform-intelligence',
            operation: 'realtime.createSession',
            provider: request.configuration.provider,
            model: request.configuration.model,
            turns: conversationHistory.length,
        });

        return { sessionConfiguration: options.sessionConfiguration, conversationHistory: 'unsupported' };
    }

    private async requestWebRTCTermination(
        adapter: IntelligenceProviderAdapterBase,
        request: IIntelligenceProviderLoadRequest,
        options: IIntelligenceRealtimeWebRTCTerminationOptions,
    ): Promise<IWebRTCTerminationOutcome> {
        const terminate = adapter.terminateWebRTCSession;
        if (!terminate) {
            return { status: 'unsupported', durationSeconds: null };
        }

        const { provider, model } = request.configuration;
        const abortController = new AbortController();
        let timeout: NodeJS.Timeout | null = null;
        const timeoutPromise = new Promise<never>((_resolve, reject) => {
            timeout = setTimeout(() => {
                reject(
                    new IntelligenceRealtimeError(
                        `Realtime WebRTC termination timed out after ${this._runtime.closeTimeoutMs}ms.`,
                        'close',
                        provider,
                        model,
                        options.sessionId,
                        true,
                    ),
                );
                abortController.abort();
            }, this._runtime.closeTimeoutMs);
        });

        try {
            return await Promise.race([
                this.executeWebRTCClosure(
                    adapter,
                    terminate,
                    {
                        ...request,
                        providerSessionId: options.providerSessionId,
                        abortSignal: abortController.signal,
                    },
                    options,
                ),
                timeoutPromise,
            ]);
        } catch (error: unknown) {
            throw this.toWebRTCTerminationError(error, provider, model, options.sessionId);
        } finally {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }

    private async executeWebRTCClosure(
        adapter: IntelligenceProviderAdapterBase,
        terminate: NonNullable<IntelligenceProviderAdapterBase['terminateWebRTCSession']>,
        request: IIntelligenceProviderWebRTCTerminationRequest,
        options: IIntelligenceRealtimeWebRTCTerminationOptions,
    ): Promise<IWebRTCTerminationOutcome> {
        const closure = await this.closeThroughControlChannel(adapter, request, options);
        if (closure !== null) {
            return closure;
        }

        return { status: await this.executeWebRTCTermination(adapter, terminate, request), durationSeconds: null };
    }

    /**
     * Gives the provider control channel half of the termination budget, so a
     * channel that does not answer still leaves time for the plain termination.
     */
    private async closeThroughControlChannel(
        adapter: IntelligenceProviderAdapterBase,
        request: IIntelligenceProviderWebRTCTerminationRequest,
        options: IIntelligenceRealtimeWebRTCTerminationOptions,
    ): Promise<IIntelligenceProviderWebRTCClosure | null> {
        const close = adapter.closeWebRTCSession;
        if (!close) {
            return null;
        }

        const channelAbortController = new AbortController();
        const abortChannel = (): void => channelAbortController.abort();
        const timeout = setTimeout(abortChannel, Math.floor(this._runtime.closeTimeoutMs / 2));
        request.abortSignal.addEventListener('abort', abortChannel, { once: true });

        try {
            return await close.call(adapter, { ...request, abortSignal: channelAbortController.signal });
        } catch (error: unknown) {
            if (request.abortSignal.aborted || error instanceof IntelligenceValidationError || error instanceof IntelligenceConfigurationError) {
                throw error;
            }

            this._logger.warn({
                message: 'Intelligence realtime control channel could not close the WebRTC session; hanging up instead.',
                requestId: options.requestId ?? 'unknown',
                module: 'platform-intelligence',
                operation: 'realtime.closeWebRTCSession',
                provider: request.configuration.provider,
                model: request.configuration.model,
                errorType: error instanceof Error ? error.name : typeof error,
            });

            return null;
        } finally {
            clearTimeout(timeout);
            request.abortSignal.removeEventListener('abort', abortChannel);
        }
    }

    private async executeWebRTCTermination(
        adapter: IntelligenceProviderAdapterBase,
        terminate: NonNullable<IntelligenceProviderAdapterBase['terminateWebRTCSession']>,
        request: IIntelligenceProviderWebRTCTerminationRequest,
    ): Promise<IntelligenceRealtimeWebRTCTerminationStatus> {
        for (let attempt = 0; ; attempt++) {
            try {
                return await terminate.call(adapter, request);
            } catch (error: unknown) {
                const isRetryable = error instanceof Error && 'isRetryable' in error && error.isRetryable === true;
                if (!isRetryable || attempt >= this._runtime.terminationMaxRetries) {
                    throw error;
                }

                await this.waitForTerminationRetry(attempt, request.abortSignal);
                if (request.abortSignal.aborted) {
                    throw error;
                }
            }
        }
    }

    private async waitForTerminationRetry(attempt: number, signal: AbortSignal): Promise<void> {
        const ceilingMs = Math.min(250 * 2 ** attempt, 1_000);
        const delayMs = ceilingMs / 2 + Math.random() * (ceilingMs / 2);

        await new Promise<void>((resolve) => {
            if (signal.aborted) {
                resolve();
                return;
            }

            const onAbort = (): void => {
                clearTimeout(timeout);
                resolve();
            };
            const timeout = setTimeout(() => {
                signal.removeEventListener('abort', onAbort);
                resolve();
            }, delayMs);
            signal.addEventListener('abort', onAbort, { once: true });
        });
    }

    private toWebRTCTerminationError(error: unknown, provider: string, model: string, sessionId: string): Error {
        if (error instanceof IntelligenceRealtimeError || error instanceof IntelligenceValidationError || error instanceof IntelligenceConfigurationError) {
            return error;
        }

        return new IntelligenceRealtimeError(
            error instanceof Error ? error.message : String(error),
            'close',
            provider,
            model,
            sessionId,
            error instanceof Error && 'isRetryable' in error && error.isRetryable === true,
            error instanceof Error ? error : undefined,
        );
    }

    private resolveWebSocketMode(
        model: RealtimeModelV4,
        requestedMode: IIntelligenceRealtimeSessionOptions['connectionMode'],
    ): Exclude<IntelligenceRealtimeConnectionMode, 'webrtc'> {
        const advertised = model.capabilities?.connections ?? ['client-secret-websocket'];
        const supportsWebSocket = model.capabilities?.transports.includes('websocket') ?? true;
        const supportsServer = supportsWebSocket && advertised.includes('server-websocket') && typeof model.getServerWebSocketConfig === 'function';
        const supportsClient =
            supportsWebSocket &&
            advertised.includes('client-secret-websocket') &&
            typeof model.doCreateClientSecret === 'function' &&
            typeof model.getWebSocketConfig === 'function';
        const mode =
            requestedMode === undefined || requestedMode === 'auto' ? (supportsServer ? 'server-websocket' : 'client-secret-websocket') : requestedMode;

        if ((mode === 'server-websocket' && !supportsServer) || (mode === 'client-secret-websocket' && !supportsClient)) {
            throw new IntelligenceValidationError(`Realtime model ${model.modelId} does not support ${mode}.`);
        }

        return mode;
    }

    private resolveWebRTCConnection(model: RealtimeModelV4): {
        readonly dataChannelLabel: string;
        readonly doCreateWebRTCSession: NonNullable<RealtimeModelV4['doCreateWebRTCSession']>;
    } {
        const getWebRTCConfig = model.getWebRTCConfig;
        const doCreateWebRTCSession = model.doCreateWebRTCSession;
        if (
            !model.capabilities?.connections?.includes('webrtc') ||
            !model.capabilities.transports.includes('webrtc') ||
            !getWebRTCConfig ||
            !doCreateWebRTCSession
        ) {
            throw new IntelligenceValidationError(`Realtime model ${model.modelId} does not support WebRTC sessions.`);
        }

        const dataChannelLabel = getWebRTCConfig.call(model).dataChannelLabel;
        if (typeof dataChannelLabel !== 'string' || dataChannelLabel.trim().length === 0) {
            throw new IntelligenceValidationError(`Realtime model ${model.modelId} returned an empty WebRTC data channel label.`);
        }

        return { dataChannelLabel, doCreateWebRTCSession };
    }

    private async resolveSessionConfiguration(
        options: IIntelligenceRealtimeSessionOptions,
        model: RealtimeModelV4,
    ): Promise<IIntelligenceRealtimeSessionConfiguration> {
        const explicit = options.sessionConfiguration ?? {};
        if (explicit.tools) {
            return explicit;
        }

        if (model.capabilities?.conversation === 'continuous') {
            if (options.activeToolNames?.length) {
                throw new IntelligenceValidationError('Registered Archipel tools cannot be auto-injected into continuous realtime models.');
            }
            return explicit;
        }

        const tools = await this.resolveToolSet(options.activeToolNames);
        if (Object.keys(tools).length === 0) {
            return explicit;
        }

        const { experimental_getRealtimeToolDefinitions: getRealtimeToolDefinitions } = await import('ai');
        const definitions = await getRealtimeToolDefinitions({ tools });

        return {
            ...explicit,
            tools: definitions as unknown as ReadonlyArray<IIntelligenceRealtimeToolDefinition>,
        };
    }

    private async resolveToolSet(activeToolNames: ReadonlyArray<string> | undefined): Promise<ToolSet> {
        const registered = this._toolRegistry.toExecutionToolSet();
        if (!activeToolNames) {
            return toAiSdkToolSet(registered);
        }

        const selected: Record<string, (typeof registered)[string]> = {};
        for (const name of activeToolNames) {
            const tool = registered[name];
            if (!tool) {
                throw new IntelligenceValidationError(`Realtime tool "${name}" is not registered.`);
            }
            selected[name] = tool;
        }

        return toAiSdkToolSet(selected);
    }

    private validateWebSocketOptions(options: IIntelligenceRealtimeSessionOptions): void {
        this.validateCommonOptions(options);
        if (Object.keys(options.metadata ?? {}).length > IntelligenceRealtimeSessionFactory._MAX_METADATA_ENTRIES) {
            throw new IntelligenceValidationError(`Realtime metadata supports at most ${IntelligenceRealtimeSessionFactory._MAX_METADATA_ENTRIES} entries.`);
        }
        for (const [key, value] of Object.entries(options.metadata ?? {})) {
            if (key.length === 0 || key.length > IntelligenceRealtimeSessionFactory._MAX_METADATA_KEY_CHARACTERS) {
                throw new IntelligenceValidationError(
                    `Realtime metadata keys must be non-empty and no longer than ${IntelligenceRealtimeSessionFactory._MAX_METADATA_KEY_CHARACTERS} characters.`,
                );
            }
            if (typeof value === 'string' && value.length > IntelligenceRealtimeSessionFactory._MAX_METADATA_STRING_CHARACTERS) {
                throw new IntelligenceValidationError(
                    `Realtime metadata string values must be no longer than ${IntelligenceRealtimeSessionFactory._MAX_METADATA_STRING_CHARACTERS} characters.`,
                );
            }
        }
        if ((options.activeToolNames?.length ?? 0) > IntelligenceRealtimeSessionFactory._MAX_REALTIME_TOOLS) {
            throw new IntelligenceValidationError(`Realtime sessions support at most ${IntelligenceRealtimeSessionFactory._MAX_REALTIME_TOOLS} active tools.`);
        }
        if (options.activeToolNames && new Set(options.activeToolNames).size !== options.activeToolNames.length) {
            throw new IntelligenceValidationError('Realtime activeToolNames must not contain duplicates.');
        }
    }

    private validateCommonOptions(options: Pick<IIntelligenceRealtimeSessionOptions, 'sessionId' | 'model' | 'sessionConfiguration'>): void {
        if (options.sessionId.trim().length === 0 || options.sessionId.length > 200) {
            throw new IntelligenceValidationError('Realtime sessionId must be non-empty and no longer than 200 characters.');
        }
        if (options.model.trim().length === 0 || options.model.length > 200) {
            throw new IntelligenceValidationError('Realtime model must be non-empty and no longer than 200 characters.');
        }
        if (
            options.sessionConfiguration?.instructions &&
            options.sessionConfiguration.instructions.length > IntelligenceRealtimeSessionFactory._MAX_SESSION_INSTRUCTION_CHARACTERS
        ) {
            throw new IntelligenceValidationError(
                `Realtime instructions must be no longer than ${IntelligenceRealtimeSessionFactory._MAX_SESSION_INSTRUCTION_CHARACTERS} characters.`,
            );
        }
        if ((options.sessionConfiguration?.tools?.length ?? 0) > IntelligenceRealtimeSessionFactory._MAX_REALTIME_TOOLS) {
            throw new IntelligenceValidationError(
                `Realtime sessions support at most ${IntelligenceRealtimeSessionFactory._MAX_REALTIME_TOOLS} explicit tools.`,
            );
        }
    }

    /** Enforces the provider-neutral bounds; an oversized history is reported, never shortened. */
    private validateConversationHistory(conversationHistory: ReadonlyArray<IIntelligenceRealtimeConversationTurn>): void {
        const maxTurns = IntelligenceRealtimeConversationHistoryLimits.maxTurns;
        const maxTextBytes = IntelligenceRealtimeConversationHistoryLimits.maxTextBytes;
        if (conversationHistory.length === 0 || conversationHistory.length > maxTurns) {
            throw new IntelligenceValidationError(`Realtime conversationHistory must contain between 1 and ${maxTurns} turns.`);
        }

        let textBytes = 0;
        for (const turn of conversationHistory) {
            if ((turn.speaker !== 'user' && turn.speaker !== 'assistant') || typeof turn.text !== 'string' || !/[^\s\p{Cc}]/u.test(turn.text)) {
                throw new IntelligenceValidationError('Every realtime conversationHistory turn needs the speaker "user" or "assistant" and visible text.');
            }
            textBytes += Buffer.byteLength(turn.text, 'utf8');
        }
        if (textBytes > maxTextBytes) {
            throw new IntelligenceValidationError(
                `Realtime conversationHistory texts must not exceed ${maxTextBytes} UTF-8 bytes combined; hand over fewer turns instead.`,
            );
        }
    }

    private validateTerminationOptions(options: IIntelligenceRealtimeWebRTCTerminationOptions): void {
        this.validateCommonOptions(options);
        if (options.provider.trim().length === 0) {
            throw new IntelligenceValidationError('Realtime provider must be non-empty.');
        }
        if (
            options.providerSessionId.length === 0 ||
            options.providerSessionId.length > IntelligenceRealtimeSessionFactory._MAX_PROVIDER_SESSION_ID_CHARACTERS ||
            /[\s\p{Cc}]/u.test(options.providerSessionId)
        ) {
            throw new IntelligenceValidationError(
                `Realtime providerSessionId must be non-empty, contain no whitespace or control characters, and be no longer than ${IntelligenceRealtimeSessionFactory._MAX_PROVIDER_SESSION_ID_CHARACTERS} characters.`,
            );
        }
        if (
            options.reason !== undefined &&
            (options.reason.trim().length === 0 ||
                options.reason.length > IntelligenceRealtimeSessionFactory._MAX_TERMINATION_REASON_CHARACTERS ||
                /\p{Cc}/u.test(options.reason))
        ) {
            throw new IntelligenceValidationError(
                `Realtime termination reason must be non-empty, contain no control characters, and be no longer than ${IntelligenceRealtimeSessionFactory._MAX_TERMINATION_REASON_CHARACTERS} characters.`,
            );
        }
    }

    // #endregion
}
