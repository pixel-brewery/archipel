// #region Imports

import type {
    Experimental_RealtimeModelV4 as RealtimeModelV4,
    Experimental_RealtimeModelV4ClientEvent as RealtimeModelV4ClientEvent,
    Experimental_RealtimeModelV4ClientSecretResult as RealtimeModelV4ClientSecretResult,
    Experimental_RealtimeModelV4ServerEvent as RealtimeModelV4ServerEvent,
    Experimental_RealtimeModelV4SessionConfig as RealtimeModelV4SessionConfig,
} from '@ai-sdk/provider';
import { Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import WebSocket, { type RawData } from 'ws';
import { IntelligenceRealtimeError } from '../../errors/IntelligenceRealtimeError.js';
import { isRetryableIntelligenceProviderError } from '../../providers/isRetryableIntelligenceProviderError.js';
import type { IIntelligenceRealtimeCloseEvent } from '../contracts/IIntelligenceRealtimeCloseEvent.js';
import type { IIntelligenceRealtimeRuntimeOptions } from '../contracts/IIntelligenceRealtimeRuntimeOptions.js';
import type { IntelligenceRealtimeClientEvent } from '../contracts/IntelligenceRealtimeClientEvent.js';
import type { IntelligenceRealtimeConnectionMode } from '../contracts/IntelligenceRealtimeConnectionMode.js';
import type { IntelligenceRealtimeMetadataValue } from '../contracts/IntelligenceRealtimeMetadataValue.js';
import type { IntelligenceRealtimeMeteringEvent } from '../contracts/IntelligenceRealtimeMeteringEvent.js';
import type { IntelligenceRealtimeServerEvent } from '../contracts/IntelligenceRealtimeServerEvent.js';
import type { IntelligenceRealtimeStatus } from '../contracts/IntelligenceRealtimeStatus.js';
import type { IIntelligenceRealtimeSessionOptions } from '../interfaces/IIntelligenceRealtimeSessionOptions.js';
import { mapIntelligenceRealtimeUsage } from '../mapIntelligenceRealtimeUsage.js';
import type { IntelligenceRealtimeMeteringBase } from '../abstracts/IntelligenceRealtimeMeteringBase.js';
import { IntelligenceRealtimeSessionBase } from '../abstracts/IntelligenceRealtimeSessionBase.js';

// #endregion

interface IVercelAiSdkRealtimeSessionOptions {
    readonly model: RealtimeModelV4;
    readonly provider: string;
    readonly connectionMode?: Exclude<IntelligenceRealtimeConnectionMode, 'webrtc'>;
    readonly session: IIntelligenceRealtimeSessionOptions;
    readonly runtime: IIntelligenceRealtimeRuntimeOptions;
    readonly metering: IntelligenceRealtimeMeteringBase;
    readonly onDisposed: (connectionId: string) => void;
}

/**
 * Server-side realtime session implemented through Vercel AI SDK model adapters.
 *
 * @internal
 */
export class VercelAiSdkRealtimeSession extends IntelligenceRealtimeSessionBase {
    // #region Fields

    private static readonly _MAX_AUDIO_CHUNK_CHARACTERS = 1_500_000;
    private static readonly _MAX_TEXT_CHARACTERS = 100_000;
    private readonly _connectionId = randomUUID();
    private readonly _connectionMode: Exclude<IntelligenceRealtimeConnectionMode, 'webrtc'>;
    private readonly _logger = new Logger(VercelAiSdkRealtimeSession.name);
    private readonly _metadata: Readonly<Record<string, IntelligenceRealtimeMetadataValue>>;
    private readonly _metering: IntelligenceRealtimeMeteringBase;
    private readonly _modelAdapter: RealtimeModelV4;
    private readonly _onClose: IIntelligenceRealtimeSessionOptions['onClose'];
    private readonly _onDisposed: (connectionId: string) => void;
    private readonly _onError: IIntelligenceRealtimeSessionOptions['onError'];
    private readonly _onEvent: IIntelligenceRealtimeSessionOptions['onEvent'];
    private readonly _provider: string;
    private readonly _requestId: string;
    private readonly _runtime: IIntelligenceRealtimeRuntimeOptions;
    private readonly _sessionConfiguration: IIntelligenceRealtimeSessionOptions['sessionConfiguration'];
    private readonly _sessionId: string;
    private readonly _model: string;
    private readonly _closedPromise: Promise<void>;
    private readonly _sessionClosedPromise: Promise<void>;
    private readonly _sessionStartedPromise: Promise<void>;
    private _closePromise: Promise<void> | null = null;
    private _finalized = false;
    private _durationSequence = 0;
    private _lastMeteredAt: Date | null = null;
    private _lastProviderDurationSeconds = 0;
    private _meteringInterval: NodeJS.Timeout | null = null;
    private _meteringQueue: Promise<void> = Promise.resolve();
    private _meteringSequence = 0;
    private _pendingInboundEvents = 0;
    private _pendingMeteringEvents = 0;
    private _pendingOutboundEvents = 0;
    private _receiveQueue: Promise<void> = Promise.resolve();
    private _resolveClosed: () => void = () => undefined;
    private _resolveSessionClosed: () => void = () => undefined;
    private _resolveSessionStarted: () => void = () => undefined;
    private _sendQueue: Promise<void> = Promise.resolve();
    private _sessionClosed = false;
    private _parseServerEvent: ((raw: unknown) => RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[]) | null = null;
    private _socket: WebSocket | null = null;
    private _startedAt: Date | null = null;
    private _status: IntelligenceRealtimeStatus = 'idle';
    private _usageSequence = 0;

    // #endregion

    // #region Ctor

    public constructor(options: IVercelAiSdkRealtimeSessionOptions) {
        super();
        this._modelAdapter = options.model;
        this._connectionMode = options.connectionMode ?? 'client-secret-websocket';
        this._provider = options.provider;
        this._requestId = options.session.requestId ?? 'unknown';
        this._sessionId = options.session.sessionId;
        this._model = options.session.model;
        this._sessionConfiguration = options.session.sessionConfiguration;
        this._metadata = Object.freeze({ ...(options.session.metadata ?? {}) });
        this._onEvent = options.session.onEvent;
        this._onError = options.session.onError;
        this._onClose = options.session.onClose;
        this._runtime = options.runtime;
        this._metering = options.metering;
        this._onDisposed = options.onDisposed;
        this._closedPromise = new Promise<void>((resolve) => {
            this._resolveClosed = resolve;
        });
        this._sessionStartedPromise = new Promise<void>((resolve) => {
            this._resolveSessionStarted = resolve;
        });
        this._sessionClosedPromise = new Promise<void>((resolve) => {
            this._resolveSessionClosed = resolve;
        });
    }

    // #endregion

    // #region Properties

    public override get sessionId(): string {
        return this._sessionId;
    }

    public override get connectionId(): string {
        return this._connectionId;
    }

    public override get provider(): string {
        return this._provider;
    }

    public override get model(): string {
        return this._model;
    }

    public override get connectionMode(): Exclude<IntelligenceRealtimeConnectionMode, 'webrtc'> {
        return this._connectionMode;
    }

    public override get status(): IntelligenceRealtimeStatus {
        return this._status;
    }

    // #endregion

    // #region Methods

    public override async connect(): Promise<void> {
        if (this._status === 'connected') {
            return;
        }
        if (this._status !== 'idle') {
            throw this.createError(`Cannot connect a realtime session in state ${this._status}.`, 'connect', false);
        }

        this._status = 'connecting';

        try {
            const socket = await this.createSocket();
            this._parseServerEvent = this._modelAdapter.createServerEventParser?.() ?? this._modelAdapter.parseServerEvent.bind(this._modelAdapter);
            this._socket = socket;
            this.attachSocketHandlers(socket);
            await this.waitForSocketOpen(socket);

            await this.send({
                type: this._modelAdapter.capabilities?.startup ?? 'session-update',
                config: this._sessionConfiguration ?? {},
            });
            if (this._modelAdapter.capabilities?.startup === 'session-start') {
                await this.waitForSessionStarted();
            }
        } catch (error: unknown) {
            if (!this._finalized) {
                this._status = 'error';
                this._socket?.terminate();
                await this.finalizeClose(1_011, 'Realtime connection failed', false);
            }

            const wrapped =
                error instanceof IntelligenceRealtimeError
                    ? error
                    : this.createError(this.resolveErrorMessage(error), 'connect', isRetryableIntelligenceProviderError(error), error);
            this.emitError(wrapped);
            throw wrapped;
        }
    }

    public override async send(event: IntelligenceRealtimeClientEvent): Promise<void> {
        if (this._status !== 'connected') {
            throw this.createError(`Cannot send a realtime event in state ${this._status}.`, 'send', false);
        }
        if (this._pendingOutboundEvents >= this._runtime.maxPendingEvents) {
            throw this.createError('Realtime outbound event queue capacity exceeded.', 'send', true);
        }

        this._pendingOutboundEvents++;
        const operation = this._sendQueue.then(async () => {
            const serialized = await this._modelAdapter.serializeClientEvent(event as unknown as RealtimeModelV4ClientEvent);
            if (serialized !== undefined && serialized !== null) {
                await this.sendRaw(serialized);
            }
        });
        this._sendQueue = operation.catch(() => undefined);

        try {
            await operation;
        } catch (error: unknown) {
            const wrapped =
                error instanceof IntelligenceRealtimeError
                    ? error
                    : this.createError(this.resolveErrorMessage(error), 'send', isRetryableIntelligenceProviderError(error), error);
            this.emitError(wrapped);
            throw wrapped;
        } finally {
            this._pendingOutboundEvents--;
        }
    }

    public override async appendAudio(audio: string): Promise<void> {
        if (audio.length === 0 || audio.length > VercelAiSdkRealtimeSession._MAX_AUDIO_CHUNK_CHARACTERS) {
            throw this.createError('Realtime audio chunks must be non-empty and no larger than 1,500,000 base64 characters.', 'send', false);
        }

        await this.send({ type: 'input-audio-append', audio });
    }

    public override async commitAudio(): Promise<void> {
        await this.send({ type: 'input-audio-commit' });
    }

    public override async clearAudio(): Promise<void> {
        await this.send({ type: 'input-audio-clear' });
    }

    public override async sendText(text: string, requestResponse = true): Promise<void> {
        if (text.trim().length === 0 || text.length > VercelAiSdkRealtimeSession._MAX_TEXT_CHARACTERS) {
            throw this.createError('Realtime text messages must be non-empty and no larger than 100,000 characters.', 'send', false);
        }

        await this.send({
            type: 'conversation-item-create',
            item: { type: 'text-message', role: 'user', text },
        });

        if (requestResponse) {
            await this.requestResponse();
        }
    }

    public override async requestResponse(options?: {
        readonly modalities?: ReadonlyArray<string>;
        readonly instructions?: string;
        readonly metadata?: Readonly<Record<string, unknown>>;
    }): Promise<void> {
        await this.send({ type: 'response-create', ...(options ? { options } : {}) });
    }

    public override async cancelResponse(): Promise<void> {
        await this.send({ type: 'response-cancel' });
    }

    public override async addToolOutput(callId: string, output: unknown, name?: string): Promise<void> {
        let serializedOutput: string;
        try {
            serializedOutput = JSON.stringify(output) ?? 'null';
        } catch (error: unknown) {
            throw this.createError(`Realtime tool output is not JSON serializable: ${this.resolveErrorMessage(error)}`, 'send', false, error);
        }

        await this.send({
            type: 'conversation-item-create',
            item: {
                type: 'function-call-output',
                callId,
                ...(name ? { name } : {}),
                output: serializedOutput,
            },
        });
    }

    public override async close(code = 1_000, reason = 'Archipel realtime session closed'): Promise<void> {
        if (this._closePromise) {
            return this._closePromise;
        }

        this._closePromise = this.closeInternal(code, reason);

        return this._closePromise;
    }

    private async closeInternal(code: number, reason: string): Promise<void> {
        if (this._finalized) {
            return;
        }

        if (this._status === 'idle') {
            await this.finalizeClose(code, reason, code === 1_000);
            return;
        }

        const socket = this._socket;
        if (!socket || socket.readyState === WebSocket.CLOSED) {
            await this.finalizeClose(code, reason, code === 1_000);
            return;
        }

        if (this._status === 'connected' && this._modelAdapter.capabilities?.finalization === 'session-close') {
            try {
                await this.send({ type: 'session-close' });
                this._status = 'closing';
                await this.waitForSessionClosed();
            } catch (error: unknown) {
                this.emitError(this.createError(this.resolveErrorMessage(error), 'close', false, error));
            }
        }

        if (this._finalized) {
            return;
        }

        this._status = 'closing';

        const safeReason = reason.slice(0, 120);
        socket.close(code, safeReason);
        const timeout = setTimeout(() => socket.terminate(), this._runtime.closeTimeoutMs);

        try {
            await this._closedPromise;
        } finally {
            clearTimeout(timeout);
        }
    }

    private attachSocketHandlers(socket: WebSocket): void {
        socket.on('message', (data: RawData) => this.enqueueIncoming(data));
        socket.on('error', (error: Error) => {
            if (this._status === 'connected') {
                this.emitError(this.createError(error.message, 'receive', true, error));
            }
        });
        socket.on('close', (code: number, reason: Buffer) => {
            void this._receiveQueue.then(async () => {
                const finalizationConfirmed = this._modelAdapter.capabilities?.finalization !== 'session-close' || this._sessionClosed;
                await this.finalizeClose(code, reason.toString('utf8'), code === 1_000 && finalizationConfirmed);
            });
        });
    }

    private async createSocket(): Promise<WebSocket> {
        if (this._connectionMode === 'server-websocket') {
            const getServerWebSocketConfig = this._modelAdapter.getServerWebSocketConfig;
            if (!getServerWebSocketConfig) {
                throw this.createError('Realtime model does not support server WebSocket connections.', 'configuration', false);
            }

            const configuration = await getServerWebSocketConfig.call(this._modelAdapter);
            return new WebSocket(configuration.url, { headers: configuration.headers, maxPayload: this._runtime.maxBufferedBytes });
        }

        const getWebSocketConfig = this._modelAdapter.getWebSocketConfig;
        if (!getWebSocketConfig) {
            throw this.createError('Realtime model does not support client-secret WebSocket connections.', 'configuration', false);
        }

        const secret = await this.createClientSecret();
        const configuration = getWebSocketConfig.call(this._modelAdapter, { token: secret.token, url: secret.url });
        return new WebSocket(configuration.url, configuration.protocols, { maxPayload: this._runtime.maxBufferedBytes });
    }

    private async waitForSocketOpen(socket: WebSocket): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            const cleanup = (): void => {
                clearTimeout(timeout);
                socket.off('open', handleOpen);
                socket.off('error', handleError);
                socket.off('close', handleClose);
            };
            const handleOpen = (): void => {
                cleanup();
                this._status = 'connected';
                if (this._modelAdapter.capabilities?.startup !== 'session-start') {
                    this.startMetering();
                }
                resolve();
            };
            const handleError = (error: Error): void => {
                cleanup();
                reject(this.createError(error.message, 'connect', true, error));
            };
            const handleClose = (code: number): void => {
                cleanup();
                reject(this.createError(`Realtime WebSocket closed before opening with code ${code}.`, 'connect', true));
            };
            const timeout = setTimeout(() => {
                cleanup();
                socket.terminate();
                reject(this.createError(`Realtime WebSocket connection timed out after ${this._runtime.connectionTimeoutMs}ms.`, 'connect', true));
            }, this._runtime.connectionTimeoutMs);

            socket.once('open', handleOpen);
            socket.once('error', handleError);
            socket.once('close', handleClose);
        });
    }

    private async waitForSessionStarted(): Promise<void> {
        let timeout: NodeJS.Timeout | null = null;
        try {
            await Promise.race([
                this._sessionStartedPromise,
                this._closedPromise.then(() => {
                    throw this.createError('Realtime WebSocket closed before the session started.', 'connect', true);
                }),
                new Promise<never>((_resolve, reject) => {
                    timeout = setTimeout(() => {
                        reject(this.createError(`Realtime session startup timed out after ${this._runtime.connectionTimeoutMs}ms.`, 'connect', true));
                    }, this._runtime.connectionTimeoutMs);
                }),
            ]);
        } finally {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }

    private async waitForSessionClosed(): Promise<void> {
        let timeout: NodeJS.Timeout | null = null;
        try {
            await Promise.race([
                this._sessionClosedPromise,
                this._closedPromise,
                new Promise<void>((resolve) => {
                    timeout = setTimeout(resolve, this._runtime.closeTimeoutMs);
                }),
            ]);
        } finally {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }

    private async createClientSecret(): Promise<RealtimeModelV4ClientSecretResult> {
        const doCreateClientSecret = this._modelAdapter.doCreateClientSecret;
        if (!doCreateClientSecret) {
            throw this.createError('Realtime model does not support client-secret WebSocket connections.', 'configuration', false);
        }

        for (let attempt = 0; attempt <= this._runtime.tokenRequestMaxRetries; attempt++) {
            try {
                return await doCreateClientSecret.call(this._modelAdapter, {
                    sessionConfig: (this._sessionConfiguration ?? {}) as RealtimeModelV4SessionConfig,
                });
            } catch (error: unknown) {
                const retryable = isRetryableIntelligenceProviderError(error);
                if (!retryable || attempt === this._runtime.tokenRequestMaxRetries) {
                    throw this.createError(this.resolveErrorMessage(error), 'token', retryable, error);
                }

                await this.delay(Math.min(250 * 2 ** attempt, 1_000));
            }
        }

        throw this.createError('Realtime client secret creation failed after all retries.', 'token', false);
    }

    private enqueueIncoming(data: RawData): void {
        if (this._pendingInboundEvents >= this._runtime.maxPendingEvents) {
            const error = this.createError('Realtime inbound event queue capacity exceeded.', 'receive', true);
            this.emitError(error);
            void this.close(1_013, 'Inbound event queue capacity exceeded');
            return;
        }

        this._pendingInboundEvents++;
        const operation = this._receiveQueue.then(() => this.handleIncoming(data));
        this._receiveQueue = operation
            .catch((error: unknown) => this.emitError(this.createError(this.resolveErrorMessage(error), 'receive', false, error)))
            .then(() => {
                this._pendingInboundEvents--;
            });
    }

    private async handleIncoming(data: RawData): Promise<void> {
        const raw = JSON.parse(this.decodeRawData(data)) as unknown;
        const healthCheckResponse = this._modelAdapter.getHealthCheckResponse?.(raw);
        if (healthCheckResponse !== undefined && healthCheckResponse !== null) {
            await this.sendRaw(healthCheckResponse);
        }

        const parsed = this._parseServerEvent?.(raw) ?? this._modelAdapter.parseServerEvent(raw);
        const sdkEvents = Array.isArray(parsed) ? parsed : [parsed];
        const events = sdkEvents as ReadonlyArray<RealtimeModelV4ServerEvent> as ReadonlyArray<IntelligenceRealtimeServerEvent>;
        const usage = mapIntelligenceRealtimeUsage(raw);
        if (usage) {
            const response = events.find((event) => event.type === 'response-done');
            this.enqueueMetering({
                ...this.createMeteringEnvelope(`${this._connectionId}:usage:${++this._usageSequence}`),
                type: 'provider-usage',
                responseId: response?.type === 'response-done' ? response.responseId : null,
                usage,
            });
        }

        for (const event of events) {
            if (event.type === 'session-started') {
                this.startMetering();
                this._resolveSessionStarted();
            }
            if (event.type === 'session-usage' || event.type === 'session-closed') {
                this.recordProviderDuration(event.usage.seconds, event.type === 'session-closed');
            }
            if (event.type === 'session-closed') {
                this._sessionClosed = true;
                this._resolveSessionClosed();
            }
            if (event.type === 'error') {
                this.emitError(this.createError(event.message, 'receive', false));
            }
            await this._onEvent?.(event);
        }
    }

    private async sendRaw(data: unknown): Promise<void> {
        const socket = this._socket;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            throw this.createError('Realtime WebSocket is not open.', 'send', true);
        }
        const serialized = JSON.stringify(data);
        if (socket.bufferedAmount + Buffer.byteLength(serialized, 'utf8') > this._runtime.maxBufferedBytes) {
            throw this.createError('Realtime WebSocket backpressure limit exceeded.', 'send', true);
        }
        await new Promise<void>((resolve, reject) => {
            socket.send(serialized, (error?: Error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    private startMetering(): void {
        if (this._startedAt) {
            return;
        }

        const now = new Date();
        this._startedAt = now;
        this._lastMeteredAt = now;
        this.enqueueMetering({
            ...this.createMeteringEnvelope(`${this._connectionId}:started`, now),
            type: 'session-started',
            startedAt: now.toISOString(),
        });
        this._meteringInterval = setInterval(() => this.emitBillingInterval(false), this._runtime.meteringIntervalMs);
        this._meteringInterval.unref();
    }

    private recordProviderDuration(seconds: number, final: boolean): void {
        if (!Number.isFinite(seconds) || seconds < this._lastProviderDurationSeconds || (!final && seconds === this._lastProviderDurationSeconds)) {
            return;
        }

        this._lastProviderDurationSeconds = seconds;
        this.enqueueMetering({
            ...this.createMeteringEnvelope(`${this._connectionId}:duration:${++this._durationSequence}`),
            type: 'provider-duration',
            durationSeconds: seconds,
            final,
        });
    }

    private emitBillingInterval(final: boolean): void {
        if (!this._lastMeteredAt) {
            return;
        }

        const endedAt = new Date();
        const durationMs = Math.max(0, endedAt.getTime() - this._lastMeteredAt.getTime());
        if (durationMs === 0 && final) {
            return;
        }

        const startedAt = this._lastMeteredAt;
        this._lastMeteredAt = endedAt;
        const sequence = ++this._meteringSequence;
        this.enqueueMetering({
            ...this.createMeteringEnvelope(`${this._connectionId}:interval:${sequence}`, endedAt),
            type: 'billing-interval',
            sequence,
            periodStartedAt: startedAt.toISOString(),
            periodEndedAt: endedAt.toISOString(),
            durationMs,
            final,
        });
    }

    private enqueueMetering(event: IntelligenceRealtimeMeteringEvent): void {
        if (this._pendingMeteringEvents >= this._runtime.maxPendingEvents) {
            this.emitError(this.createError('Realtime metering queue capacity exceeded.', 'metering', false));
            void this.close(1_011, 'Metering queue capacity exceeded');
            return;
        }

        this._pendingMeteringEvents++;
        const operation = this._meteringQueue.then(() => this.reportMetering(event));
        this._meteringQueue = operation
            .catch((error: unknown) => this.emitError(this.createError(this.resolveErrorMessage(error), 'metering', true, error)))
            .then(() => {
                this._pendingMeteringEvents--;
            });
    }

    private async finalizeClose(code: number, reason: string, clean: boolean): Promise<void> {
        if (this._finalized) {
            return;
        }

        this._finalized = true;
        this._status = 'closed';
        if (this._meteringInterval) {
            clearInterval(this._meteringInterval);
            this._meteringInterval = null;
        }

        if (this._startedAt) {
            this.emitBillingInterval(true);
            const endedAt = new Date();
            this.enqueueMetering({
                ...this.createMeteringEnvelope(`${this._connectionId}:ended`, endedAt),
                type: 'session-ended',
                startedAt: this._startedAt.toISOString(),
                endedAt: endedAt.toISOString(),
                durationMs: Math.max(0, endedAt.getTime() - this._startedAt.getTime()),
                closeCode: code,
                closeReason: reason,
            });
            await this.flushMetering();
        }

        const closeEvent = { code, reason, clean } satisfies IIntelligenceRealtimeCloseEvent;
        const closeCallbackStartedAt = Date.now();
        try {
            await this._onClose?.(closeEvent);
        } catch {
            this._logger.warn({
                message: 'Intelligence realtime close callback failed.',
                requestId: this._requestId,
                module: 'platform-intelligence',
                operation: 'realtime.closeCallback',
                duration: Date.now() - closeCallbackStartedAt,
            });
        } finally {
            this._socket = null;
            this._onDisposed(this._connectionId);
            this._resolveClosed();
        }
    }

    private async flushMetering(): Promise<void> {
        let timeout: NodeJS.Timeout | null = null;
        try {
            await Promise.race([
                this._meteringQueue,
                new Promise<void>((resolve) => {
                    timeout = setTimeout(resolve, this._runtime.closeTimeoutMs);
                    timeout.unref();
                }),
            ]);
        } finally {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }

    private async reportMetering(event: IntelligenceRealtimeMeteringEvent): Promise<void> {
        for (let attempt = 0; attempt <= 2; attempt++) {
            try {
                await this._metering.report(event);
                return;
            } catch (error: unknown) {
                if (attempt === 2) {
                    throw error;
                }
                await this.delay(100 * 2 ** attempt);
            }
        }
    }

    private createMeteringEnvelope(eventId: string, occurredAt = new Date()): Omit<IntelligenceRealtimeMeteringEvent, 'type'> {
        return {
            eventId,
            sessionId: this._sessionId,
            connectionId: this._connectionId,
            provider: this._provider,
            model: this._model,
            occurredAt: occurredAt.toISOString(),
            metadata: this._metadata,
        };
    }

    private createError(message: string, phase: IntelligenceRealtimeError['phase'], isRetryable: boolean, cause?: unknown): IntelligenceRealtimeError {
        return new IntelligenceRealtimeError(
            message,
            phase,
            this._provider,
            this._model,
            this._sessionId,
            isRetryable,
            cause instanceof Error ? cause : undefined,
        );
    }

    private emitError(error: Error): void {
        if (!this._onError) {
            this._logger.error({
                message: 'Intelligence realtime session failed.',
                requestId: this._requestId,
                module: 'platform-intelligence',
                operation: 'realtime.session',
                errorType: error.name,
            });
            return;
        }

        const errorCallbackStartedAt = Date.now();
        void Promise.resolve(this._onError(error)).catch(() => {
            this._logger.warn({
                message: 'Intelligence realtime error callback failed.',
                requestId: this._requestId,
                module: 'platform-intelligence',
                operation: 'realtime.errorCallback',
                duration: Date.now() - errorCallbackStartedAt,
            });
        });
    }

    private decodeRawData(data: RawData): string {
        if (Array.isArray(data)) {
            return Buffer.concat(data).toString('utf8');
        }
        if (data instanceof ArrayBuffer) {
            return Buffer.from(data).toString('utf8');
        }

        return data.toString('utf8');
    }

    private resolveErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }

    private async delay(milliseconds: number): Promise<void> {
        await new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
    }

    // #endregion
}
