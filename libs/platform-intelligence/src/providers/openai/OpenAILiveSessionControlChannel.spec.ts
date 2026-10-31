// #region Imports

import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Duplex } from 'node:stream';
import { afterEach, describe, expect, it } from 'vitest';
import { WebSocketServer, type WebSocket } from 'ws';
import { IntelligenceProviderError } from '../../errors/IntelligenceProviderError.js';
import { OpenAILiveSessionControlChannel } from './OpenAILiveSessionControlChannel.js';

// #endregion

// #region Helpers

type FakeSidebandBehavior =
    | { readonly kind: 'accept'; readonly onClientEvent: (socket: WebSocket, event: Readonly<Record<string, unknown>>) => void }
    | { readonly kind: 'reject'; readonly status: number; readonly body: unknown };

/** Stands in for the GPT-Live attach endpoint of one session. */
class FakeSidebandProvider {
    public readonly authorizations: Array<string | undefined> = [];
    public readonly clientEvents: Array<Readonly<Record<string, unknown>>> = [];
    public readonly paths: Array<string | undefined> = [];
    private readonly _server: Server;
    private readonly _sockets = new WebSocketServer({ noServer: true });

    public constructor(behavior: FakeSidebandBehavior) {
        this._server = createServer();
        this._server.on('upgrade', (request: IncomingMessage, socket: Duplex, head: Buffer) => {
            this.authorizations.push(request.headers.authorization);
            this.paths.push(request.url);
            if (behavior.kind === 'reject') {
                const body = JSON.stringify(behavior.body);
                socket.end(
                    `HTTP/1.1 ${behavior.status} Rejected\r\nContent-Type: application/json\r\nContent-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`,
                );
                return;
            }

            this._sockets.handleUpgrade(request, socket, head, (webSocket) => {
                webSocket.on('message', (data) => {
                    const event = JSON.parse(data.toString()) as Readonly<Record<string, unknown>>;
                    this.clientEvents.push(event);
                    behavior.onClientEvent(webSocket, event);
                });
            });
        });
    }

    public async start(): Promise<string> {
        await new Promise<void>((resolve) => this._server.listen(0, '127.0.0.1', resolve));
        const address = this._server.address() as AddressInfo;

        return `ws://127.0.0.1:${address.port}/v1/live/sessions/live_123/attach`;
    }

    public async stop(): Promise<void> {
        for (const client of this._sockets.clients) {
            client.terminate();
        }
        await new Promise<void>((resolve) => this._sockets.close(() => resolve()));
        await new Promise<void>((resolve) => this._server.close(() => resolve()));
    }
}

function createChannel(url: string, abortSignal = new AbortController().signal): OpenAILiveSessionControlChannel {
    return new OpenAILiveSessionControlChannel({ url, apiKey: 'server-secret', provider: 'openai', model: 'gpt-live-1', abortSignal });
}

// #endregion

describe('OpenAILiveSessionControlChannel', () => {
    // #region Methods

    let provider: FakeSidebandProvider | null = null;

    afterEach(async () => {
        await provider?.stop();
        provider = null;
    });

    it('closes the running session with the server key and reports the final voice duration after audio copies', async () => {
        // arrange
        provider = new FakeSidebandProvider({
            kind: 'accept',
            onClientEvent: (socket, event) => {
                if (event['type'] === 'session.close') {
                    socket.send(JSON.stringify({ type: 'session.output_audio.delta', delta: 'AAAA' }));
                    socket.send(JSON.stringify({ type: 'session.usage.updated', usage: { seconds: 47 } }));
                    socket.send(JSON.stringify({ type: 'session.closed', usage: { seconds: 47.5 }, reason: 'close_requested' }));
                }
            },
        });
        const url = await provider.start();

        // act
        const closure = await createChannel(url).close();

        // assert
        expect(closure).toEqual({ status: 'terminated', durationSeconds: 47.5 });
        expect(provider.authorizations).toEqual(['Bearer server-secret']);
        expect(provider.paths).toEqual(['/v1/live/sessions/live_123/attach']);
        expect(provider.clientEvents).toEqual([{ type: 'session.close', event_id: expect.any(String) }]);
    });

    it('reports an unknown duration when the closed session carries no usage', async () => {
        // arrange
        provider = new FakeSidebandProvider({
            kind: 'accept',
            onClientEvent: (socket) => socket.send(JSON.stringify({ type: 'session.closed', reason: 'close_requested' })),
        });
        const url = await provider.start();

        // act
        const closure = await createChannel(url).close();

        // assert
        expect(closure).toEqual({ status: 'terminated', durationSeconds: null });
    });

    it.each([
        ['an unknown session', 404, { error: { type: 'invalid_request_error', code: 'session_id_not_found' } }],
        ['a closed session', 400, { error: { type: 'invalid_request_error', code: 'session_closed' } }],
        ['a gone session', 410, null],
    ] as const)('resolves %s as already ended without a duration', async (_description, status, body) => {
        // arrange
        provider = new FakeSidebandProvider({ kind: 'reject', status, body });
        const url = await provider.start();

        // act
        const closure = await createChannel(url).close();

        // assert
        expect(closure).toEqual({ status: 'already-ended', durationSeconds: null });
    });

    it('rejects a refused attachment without echoing the provider message', async () => {
        // arrange
        provider = new FakeSidebandProvider({
            kind: 'reject',
            status: 401,
            body: { error: { message: 'Incorrect API key provided: sk-test-****1234.', code: 'invalid_api_key' } },
        });
        const url = await provider.start();

        // act
        const result = createChannel(url).close();

        // assert
        await expect(result).rejects.toBeInstanceOf(IntelligenceProviderError);
        await expect(result).rejects.toMatchObject({ isRetryable: false, message: expect.not.stringContaining('sk-test') });
    });

    it('rejects as retryable when the channel closes before the session reports its final usage', async () => {
        // arrange
        provider = new FakeSidebandProvider({ kind: 'accept', onClientEvent: (socket) => socket.close(1011) });
        const url = await provider.start();

        // act
        const result = createChannel(url).close();

        // assert
        await expect(result).rejects.toMatchObject({ isRetryable: true });
    });

    it('resolves an error event about an ended session as already ended', async () => {
        // arrange
        provider = new FakeSidebandProvider({
            kind: 'accept',
            onClientEvent: (socket) => socket.send(JSON.stringify({ type: 'error', error: { code: 'session_closed', message: 'Session already closed.' } })),
        });
        const url = await provider.start();

        // act
        const closure = await createChannel(url).close();

        // assert
        expect(closure).toEqual({ status: 'already-ended', durationSeconds: null });
    });

    it('stops waiting and drops the connection when the attempt is aborted', async () => {
        // arrange
        provider = new FakeSidebandProvider({ kind: 'accept', onClientEvent: () => undefined });
        const url = await provider.start();
        const abortController = new AbortController();
        const result = createChannel(url, abortController.signal).close();
        await expect.poll(() => provider?.clientEvents.length).toBe(1);

        // act
        abortController.abort();

        // assert
        await expect(result).rejects.toMatchObject({ isRetryable: true });
    });

    // #endregion
});
