// #region Imports

import {
    APICallError,
    type Experimental_RealtimeModelV4 as RealtimeModelV4,
    type Experimental_RealtimeModelV4ClientEvent as RealtimeModelV4ClientEvent,
    type Experimental_RealtimeModelV4ServerEvent as RealtimeModelV4ServerEvent,
} from '@ai-sdk/provider';
import { once } from 'node:events';
import type { IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebSocketServer, type WebSocket } from 'ws';
import { IntelligenceProviderNames } from '../../contracts/IntelligenceProviderNames.js';
import { IntelligenceRealtimeError } from '../../errors/IntelligenceRealtimeError.js';
import type { IIntelligenceRealtimeRuntimeOptions } from '../contracts/IIntelligenceRealtimeRuntimeOptions.js';
import type { IntelligenceRealtimeMeteringEvent } from '../contracts/IntelligenceRealtimeMeteringEvent.js';
import { IntelligenceRealtimeMeteringBase } from '../abstracts/IntelligenceRealtimeMeteringBase.js';
import { VercelAiSdkRealtimeSession } from './VercelAiSdkRealtimeSession.js';

// #endregion

class CollectingMeteringAdapter extends IntelligenceRealtimeMeteringBase {
    // #region Fields

    public readonly events: Array<IntelligenceRealtimeMeteringEvent> = [];

    // #endregion

    // #region Ctor

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    public override async report(event: IntelligenceRealtimeMeteringEvent): Promise<void> {
        this.events.push(event);
        await Promise.resolve();
    }

    // #endregion
}

describe('VercelAiSdkRealtimeSession', () => {
    // #region Fields

    const servers: Array<WebSocketServer> = [];

    // #endregion

    // #region Setup

    afterEach(async () => {
        await Promise.all(
            servers.splice(0).map(
                (server) =>
                    new Promise<void>((resolve) => {
                        server.close(() => resolve());
                    }),
            ),
        );
        vi.restoreAllMocks();
    });

    // #endregion

    // #region Helpers

    async function createServer(
        onConnection?: (socket: WebSocket, request: IncomingMessage) => void,
    ): Promise<{ readonly server: WebSocketServer; readonly url: string }> {
        const server = new WebSocketServer({ port: 0 });
        servers.push(server);
        server.on('connection', (socket, request) => onConnection?.(socket, request));
        await once(server, 'listening');
        const address = server.address() as AddressInfo;

        return { server, url: `ws://127.0.0.1:${address.port}` };
    }

    function createModel(url: string, createSecret?: RealtimeModelV4['doCreateClientSecret']): RealtimeModelV4 {
        return {
            specificationVersion: 'v4',
            provider: 'openai.realtime',
            modelId: 'gpt-realtime',
            doCreateClientSecret: createSecret ?? vi.fn(async () => ({ token: 'secret', url })),
            getWebSocketConfig: (options) => ({ url: options.url }),
            parseServerEvent: (raw: unknown): RealtimeModelV4ServerEvent => {
                const event = raw as { response?: { id?: string; status?: string } };

                return {
                    type: 'response-done',
                    responseId: event.response?.id ?? 'response-1',
                    status: event.response?.status ?? 'completed',
                    raw,
                };
            },
            serializeClientEvent: (event: RealtimeModelV4ClientEvent) => event,
            buildSessionConfig: (configuration) => configuration,
        };
    }

    function createRuntime(overrides: Partial<IIntelligenceRealtimeRuntimeOptions> = {}): IIntelligenceRealtimeRuntimeOptions {
        return {
            maxActiveSessions: 10,
            maxPendingEvents: 32,
            maxBufferedBytes: 1024 * 1024,
            connectionTimeoutMs: 1_000,
            closeTimeoutMs: 1_000,
            meteringIntervalMs: 30_000,
            tokenRequestMaxRetries: 0,
            terminationMaxRetries: 0,
            ...overrides,
        };
    }

    // #endregion

    // #region Methods

    it('should connect, normalize provider events, and emit auditable metering events', async () => {
        // arrange
        const received: Array<unknown> = [];
        const connection = await createServer((socket) => {
            socket.on('message', (data) => received.push(JSON.parse(data.toString()) as unknown));
            socket.send(
                JSON.stringify({
                    type: 'response.done',
                    response: {
                        id: 'response-42',
                        status: 'completed',
                        usage: { input_tokens: 20, output_tokens: 5, total_tokens: 25 },
                    },
                }),
            );
        });
        const metering = new CollectingMeteringAdapter();
        const onEvent = vi.fn();
        const onClose = vi.fn();
        const session = new VercelAiSdkRealtimeSession({
            model: createModel(connection.url),
            provider: IntelligenceProviderNames.OpenAI,
            session: {
                sessionId: 'consultation-1',
                model: 'gpt-realtime',
                sessionConfiguration: { instructions: 'Transcribe the consultation.' },
                metadata: { tenantId: 'tenant-1' },
                onEvent,
                onClose,
            },
            runtime: createRuntime(),
            metering,
            onDisposed: vi.fn(),
        });

        // act
        await session.connect();
        await vi.waitFor(() => expect(onEvent).toHaveBeenCalledOnce());
        await session.close();

        // assert
        expect(received[0]).toMatchObject({ type: 'session-update', config: { instructions: 'Transcribe the consultation.' } });
        expect(onEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'response-done', responseId: 'response-42' }));
        expect(metering.events.map((event) => event.type)).toEqual(['session-started', 'provider-usage', 'billing-interval', 'session-ended']);
        expect(metering.events.find((event) => event.type === 'provider-usage')).toMatchObject({
            eventId: expect.stringContaining(':usage:'),
            sessionId: 'consultation-1',
            metadata: { tenantId: 'tenant-1' },
            responseId: 'response-42',
            usage: { totalTokens: 25 },
        });
        expect(onClose).toHaveBeenCalledWith({ code: 1000, reason: 'Archipel realtime session closed', clean: true });
    });

    it('should use server credentials and wait for the Live session lifecycle', async () => {
        // arrange
        const received: Array<Record<string, unknown>> = [];
        let authorization: string | undefined;
        const connection = await createServer((socket, request) => {
            authorization = request.headers.authorization;
            socket.on('message', (data) => {
                const event = JSON.parse(data.toString()) as Record<string, unknown>;
                received.push(event);
                if (event['type'] === 'session.start') {
                    socket.send(JSON.stringify({ type: 'session.started', session: { id: 'provider-session' } }));
                }
                if (event['type'] === 'session.close') {
                    socket.send(JSON.stringify({ type: 'session.closed', usage: { seconds: 1.5 }, reason: 'completed' }), () => {
                        socket.close(1000, 'done');
                    });
                }
            });
        });
        const createSecret = vi.fn(async () => ({ token: 'unused', url: connection.url }));
        const parseServerEvent = vi.fn((raw: unknown): RealtimeModelV4ServerEvent => {
            const event = raw as { type: string };
            if (event.type === 'session.started') {
                return { type: 'session-started', sessionId: 'provider-session', raw };
            }
            return { type: 'session-closed', sessionId: 'provider-session', usage: { seconds: 1.5 }, reason: 'completed', raw };
        });
        const model: RealtimeModelV4 = {
            ...createModel(connection.url, createSecret),
            capabilities: {
                conversation: 'continuous',
                transports: ['websocket'],
                connections: ['server-websocket'],
                startup: 'session-start',
                finalization: 'session-close',
            },
            getServerWebSocketConfig: () => ({ url: connection.url, headers: { Authorization: 'Bearer server-key' } }),
            createServerEventParser: () => parseServerEvent,
            serializeClientEvent: (event) => {
                if (event.type === 'session-start') {
                    return { type: 'session.start', config: event.config };
                }
                if (event.type === 'session-close') {
                    return { type: 'session.close' };
                }
                return event;
            },
        };
        const metering = new CollectingMeteringAdapter();
        const onClose = vi.fn();
        const session = new VercelAiSdkRealtimeSession({
            model,
            provider: IntelligenceProviderNames.OpenAI,
            connectionMode: 'server-websocket',
            session: { sessionId: 'live-session', model: 'gpt-live-1', sessionConfiguration: { instructions: 'Be concise.' }, onClose },
            runtime: createRuntime(),
            metering,
            onDisposed: vi.fn(),
        });

        // act
        await session.connect();
        await session.close();

        // assert
        expect(session.connectionMode).toBe('server-websocket');
        expect(authorization).toBe('Bearer server-key');
        expect(createSecret).not.toHaveBeenCalled();
        expect(received).toEqual([{ type: 'session.start', config: { instructions: 'Be concise.' } }, { type: 'session.close' }]);
        expect(parseServerEvent).toHaveBeenCalledTimes(2);
        expect(metering.events).toContainEqual(expect.objectContaining({ type: 'provider-duration', durationSeconds: 1.5, final: true }));
        expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ clean: true }));
    });

    it('should serialize audio, text, response, and tool events in call order', async () => {
        // arrange
        const received: Array<Record<string, unknown>> = [];
        const connection = await createServer((socket) => {
            socket.on('message', (data) => received.push(JSON.parse(data.toString()) as Record<string, unknown>));
        });
        const session = new VercelAiSdkRealtimeSession({
            model: createModel(connection.url),
            provider: IntelligenceProviderNames.OpenAI,
            session: { sessionId: 'consultation-2', model: 'gpt-realtime' },
            runtime: createRuntime(),
            metering: new CollectingMeteringAdapter(),
            onDisposed: vi.fn(),
        });
        await session.connect();

        // act
        await session.appendAudio('YXVkaW8=');
        await session.commitAudio();
        await session.sendText('Hello', false);
        await session.requestResponse({ modalities: ['text'] });
        await session.addToolOutput('call-1', { accepted: true }, 'confirm');
        await session.cancelResponse();
        await session.close();

        // assert
        expect(received.map((event) => event['type'])).toEqual([
            'session-update',
            'input-audio-append',
            'input-audio-commit',
            'conversation-item-create',
            'response-create',
            'conversation-item-create',
            'response-cancel',
        ]);
        expect(received[5]).toMatchObject({
            item: { type: 'function-call-output', callId: 'call-1', name: 'confirm', output: '{"accepted":true}' },
        });
    });

    it('should wrap failed client-secret creation without opening a provider socket', async () => {
        // arrange
        const createSecret = vi.fn(async () => {
            throw new Error('401 invalid API key');
        });
        const session = new VercelAiSdkRealtimeSession({
            model: createModel('ws://127.0.0.1:1', createSecret),
            provider: IntelligenceProviderNames.OpenAI,
            session: { sessionId: 'consultation-3', model: 'gpt-realtime' },
            runtime: createRuntime(),
            metering: new CollectingMeteringAdapter(),
            onDisposed: vi.fn(),
        });

        // act
        const result = session.connect();

        // assert
        await expect(result).rejects.toMatchObject({
            name: IntelligenceRealtimeError.name,
            phase: 'token',
            provider: IntelligenceProviderNames.OpenAI,
            model: 'gpt-realtime',
            sessionId: 'consultation-3',
            isRetryable: false,
        });
        expect(createSecret).toHaveBeenCalledOnce();
        await session.close();
    });

    it('should retry a transient client-secret failure and report it as retryable', async () => {
        // arrange
        const createSecret = vi.fn(async () => {
            throw new APICallError({
                message: 'The server had an error while processing your request.',
                url: 'https://provider.test/v1/realtime/client_secrets',
                requestBodyValues: {},
                statusCode: 503,
            });
        });
        const session = new VercelAiSdkRealtimeSession({
            model: createModel('ws://127.0.0.1:1', createSecret),
            provider: IntelligenceProviderNames.OpenAI,
            session: { sessionId: 'consultation-5', model: 'gpt-realtime' },
            runtime: createRuntime({ tokenRequestMaxRetries: 1 }),
            metering: new CollectingMeteringAdapter(),
            onDisposed: vi.fn(),
        });

        // act
        const result = session.connect();

        // assert
        await expect(result).rejects.toMatchObject({ name: IntelligenceRealtimeError.name, phase: 'token', isRetryable: true });
        expect(createSecret).toHaveBeenCalledTimes(2);
        await session.close();
    });

    it('should not retry a rejected client-secret request because its message mentions a connection', async () => {
        // arrange
        const createSecret = vi.fn(async () => {
            throw new APICallError({
                message: 'Invalid connection settings.',
                url: 'https://provider.test/v1/realtime/client_secrets',
                requestBodyValues: {},
                statusCode: 400,
            });
        });
        const session = new VercelAiSdkRealtimeSession({
            model: createModel('ws://127.0.0.1:1', createSecret),
            provider: IntelligenceProviderNames.OpenAI,
            session: { sessionId: 'consultation-6', model: 'gpt-realtime' },
            runtime: createRuntime({ tokenRequestMaxRetries: 1 }),
            metering: new CollectingMeteringAdapter(),
            onDisposed: vi.fn(),
        });

        // act
        const result = session.connect();

        // assert
        await expect(result).rejects.toMatchObject({ name: IntelligenceRealtimeError.name, phase: 'token', isRetryable: false });
        expect(createSecret).toHaveBeenCalledOnce();
        await session.close();
    });

    it.each(['doCreateClientSecret', 'getWebSocketConfig'] as const)(
        'should reject a realtime model without %s before requesting a client secret',
        async (missingMethod) => {
            // arrange
            const createSecret = vi.fn(async () => ({ token: 'secret', url: 'ws://127.0.0.1:1' }));
            const model = createModel('ws://127.0.0.1:1', createSecret);
            delete model[missingMethod];
            const session = new VercelAiSdkRealtimeSession({
                model,
                provider: IntelligenceProviderNames.OpenAI,
                session: { sessionId: 'unsupported-session', model: 'unsupported-realtime' },
                runtime: createRuntime(),
                metering: new CollectingMeteringAdapter(),
                onDisposed: vi.fn(),
            });

            // act
            const result = session.connect();

            // assert
            await expect(result).rejects.toMatchObject({
                name: IntelligenceRealtimeError.name,
                phase: 'configuration',
                isRetryable: false,
            });
            expect(createSecret).not.toHaveBeenCalled();
        },
    );

    it('should reject oversized audio chunks before they enter the send queue', async () => {
        // arrange
        const connection = await createServer();
        const session = new VercelAiSdkRealtimeSession({
            model: createModel(connection.url),
            provider: IntelligenceProviderNames.OpenAI,
            session: { sessionId: 'consultation-4', model: 'gpt-realtime' },
            runtime: createRuntime(),
            metering: new CollectingMeteringAdapter(),
            onDisposed: vi.fn(),
        });
        await session.connect();

        // act
        const result = session.appendAudio('a'.repeat(1_500_001));

        // assert
        await expect(result).rejects.toMatchObject({ phase: 'send', isRetryable: false });
        await session.close();
    });

    // #endregion
});
