// #region Imports

import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import WebSocket, { type RawData } from 'ws';
import { IntelligenceProviderError } from '../../errors/IntelligenceProviderError.js';
import type { IIntelligenceProviderWebRTCClosure } from '../IIntelligenceProviderWebRTCClosure.js';
import type { IOpenAILiveSessionControlChannelOptions } from './IOpenAILiveSessionControlChannelOptions.js';
import { isOpenAIEndedSessionErrorCode } from './isOpenAIEndedSessionErrorCode.js';
import { readOpenAIErrorCode } from './readOpenAIErrorCode.js';

// #endregion

// #region Constants

/**
 * The sideband also carries copies of the session audio. One event stays far
 * below this bound; a larger one ends the attempt instead of buffering it.
 */
const MAXIMUM_EVENT_BYTES = 1024 * 1024;
const MAXIMUM_ERROR_BODY_BYTES = 16 * 1024;
const ALREADY_ENDED: IIntelligenceProviderWebRTCClosure = { status: 'already-ended', durationSeconds: null };

// #endregion

/**
 * Closes a browser-owned GPT-Live session through its sideband WebSocket.
 *
 * GPT-Live reports a session's final billable voice duration only in the
 * `session.closed` event, which reaches the connections of the session but
 * not any REST response. The channel attaches to the running session with the
 * server API key, sends `session.close`, and resolves with `usage.seconds`
 * from `session.closed`. It never forwards provider error text.
 *
 * @internal
 */
export class OpenAILiveSessionControlChannel {
    // #region Fields

    private readonly _options: IOpenAILiveSessionControlChannelOptions;

    // #endregion

    // #region Ctor

    public constructor(options: IOpenAILiveSessionControlChannelOptions) {
        this._options = options;
    }

    // #endregion

    // #region Methods

    /**
     * Requests the close and waits for the provider's final usage.
     *
     * Resolves `already-ended` when the provider no longer knows the session.
     * Rejects with a retryable `IntelligenceProviderError` when the channel
     * fails or closes before `session.closed`, and with a non-retryable one
     * when the provider rejects the attachment or reports an error event.
     */
    public close(): Promise<IIntelligenceProviderWebRTCClosure> {
        if (this._options.abortSignal.aborted) {
            return Promise.reject(this.createError('OpenAI live session control channel was aborted before it opened.', true));
        }

        return new Promise<IIntelligenceProviderWebRTCClosure>((resolve, reject) => {
            const socket = new WebSocket(this._options.url, {
                headers: { authorization: `Bearer ${this._options.apiKey}` },
                maxPayload: MAXIMUM_EVENT_BYTES,
            });
            let settled = false;

            const settle = (outcome: () => void): void => {
                if (settled) {
                    return;
                }

                settled = true;
                this._options.abortSignal.removeEventListener('abort', handleAbort);
                socket.removeAllListeners();
                // A late socket error after settling must not become an unhandled error event.
                socket.on('error', () => undefined);
                outcome();
            };
            const succeed = (closure: IIntelligenceProviderWebRTCClosure): void =>
                settle(() => {
                    socket.close(1000);
                    resolve(closure);
                });
            const fail = (error: IntelligenceProviderError): void =>
                settle(() => {
                    socket.terminate();
                    reject(error);
                });
            const handleAbort = (): void => fail(this.createError('OpenAI live session control channel was aborted.', true));

            this._options.abortSignal.addEventListener('abort', handleAbort, { once: true });
            socket.on('open', () => {
                socket.send(JSON.stringify({ type: 'session.close', event_id: randomUUID() }));
            });
            socket.on('message', (data: RawData, isBinary: boolean) => {
                if (isBinary) {
                    return;
                }

                const event = this.parseEvent(data);
                if (event?.['type'] === 'session.closed') {
                    succeed({ status: 'terminated', durationSeconds: this.readDurationSeconds(event) });
                } else if (event?.['type'] === 'error') {
                    const code = readOpenAIErrorCode(event);
                    if (isOpenAIEndedSessionErrorCode(code)) {
                        succeed(ALREADY_ENDED);
                    } else {
                        fail(this.createError(`OpenAI live session control channel reported an error${code ? ` (${code})` : ''}.`, false));
                    }
                }
            });
            socket.on('unexpected-response', (_request: unknown, response: IncomingMessage) => {
                void this.readUpgradeRejection(response).then((rejection) => {
                    if (rejection.alreadyEnded) {
                        succeed(ALREADY_ENDED);
                    } else {
                        fail(rejection.error);
                    }
                });
            });
            socket.on('close', () => fail(this.createError('OpenAI live session control channel closed before the session reported its final usage.', true)));
            socket.on('error', (error: Error) =>
                fail(this.createError('OpenAI live session control channel failed without a provider response.', true, error)),
            );
        });
    }

    private parseEvent(data: RawData): Readonly<Record<string, unknown>> | null {
        try {
            const buffer = Buffer.isBuffer(data) ? data : Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data);
            const event: unknown = JSON.parse(buffer.toString('utf8'));

            return typeof event === 'object' && event !== null && !Array.isArray(event) ? (event as Readonly<Record<string, unknown>>) : null;
        } catch {
            // Only JSON events carry control information; anything else is ignored.
            return null;
        }
    }

    private readDurationSeconds(event: Readonly<Record<string, unknown>>): number | null {
        const usage = event['usage'];
        const seconds = typeof usage === 'object' && usage !== null ? (usage as Readonly<Record<string, unknown>>)['seconds'] : undefined;

        return typeof seconds === 'number' && Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
    }

    private async readUpgradeRejection(
        response: IncomingMessage,
    ): Promise<{ readonly alreadyEnded: true } | { readonly alreadyEnded: false; readonly error: IntelligenceProviderError }> {
        const status = response.statusCode ?? 0;
        const code = readOpenAIErrorCode(await this.readJsonBody(response));

        if (status === 409 || status === 410 || ((status === 400 || status === 404) && isOpenAIEndedSessionErrorCode(code))) {
            return { alreadyEnded: true };
        }

        return {
            alreadyEnded: false,
            error: this.createError(
                `OpenAI live session control channel was rejected with HTTP ${status}${code ? ` (${code})` : ''}.`,
                status === 408 || status === 429 || status >= 500,
            ),
        };
    }

    private async readJsonBody(response: IncomingMessage): Promise<unknown> {
        const chunks: Array<Buffer> = [];
        let size = 0;

        try {
            for await (const chunk of response) {
                const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
                size += buffer.length;
                if (size > MAXIMUM_ERROR_BODY_BYTES) {
                    response.destroy();
                    return null;
                }
                chunks.push(buffer);
            }

            return JSON.parse(Buffer.concat(chunks).toString('utf8'));
        } catch {
            // A missing or non-JSON body carries no machine-readable provider code.
            return null;
        }
    }

    private createError(message: string, isRetryable: boolean, cause?: Error): IntelligenceProviderError {
        return new IntelligenceProviderError(message, this._options.provider, this._options.model, isRetryable, cause);
    }

    // #endregion
}
