// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import { IntelligenceCapabilityNames } from '../../contracts/IntelligenceCapabilityNames.js';
import type { IIntelligenceProviderProbeResult } from '../../contracts/IIntelligenceProviderProbeResult.js';
import { IntelligenceProviderNames } from '../../contracts/IntelligenceProviderNames.js';
import { IntelligenceConfigurationError } from '../../errors/IntelligenceConfigurationError.js';
import { IntelligenceProviderError } from '../../errors/IntelligenceProviderError.js';
import { IntelligenceValidationError } from '../../errors/IntelligenceValidationError.js';
import type { IIntelligenceRealtimeSessionConfiguration } from '../../realtime/contracts/IIntelligenceRealtimeSessionConfiguration.js';
import type { IntelligenceRealtimeWebRTCTerminationStatus } from '../../realtime/contracts/IntelligenceRealtimeWebRTCTerminationStatus.js';
import { formatIntelligenceRealtimeConversationHistory } from '../../realtime/formatIntelligenceRealtimeConversationHistory.js';
import { createProviderOptions } from '../createProviderOptions.js';
import { IntelligenceProviderAdapterBase } from '../abstracts/IntelligenceProviderAdapterBase.js';
import type { IIntelligenceProviderLoadRequest } from '../IIntelligenceProviderLoadRequest.js';
import type { IIntelligenceProviderWebRTCClosure } from '../IIntelligenceProviderWebRTCClosure.js';
import type { IIntelligenceProviderWebRTCConversationHistoryRequest } from '../IIntelligenceProviderWebRTCConversationHistoryRequest.js';
import type { IIntelligenceProviderWebRTCTerminationRequest } from '../IIntelligenceProviderWebRTCTerminationRequest.js';
import { resolveProviderAdapterConfiguration } from '../resolveProviderAdapterConfiguration.js';
import { createIntelligenceTimeoutFetch } from '../../runtime/createIntelligenceTimeoutFetch.js';
import { loadOpenAISdk } from './loadOpenAISdk.js';
import { OPENAI_API_KEY, OPENAI_BASE_URL } from './env.js';
import { OpenAIIntelligenceVideoModel } from './OpenAIIntelligenceVideoModel.js';
import { OpenAILiveSessionControlChannel } from './OpenAILiveSessionControlChannel.js';
import { isOpenAIEndedSessionErrorCode } from './isOpenAIEndedSessionErrorCode.js';
import { readOpenAIErrorCode } from './readOpenAIErrorCode.js';

// #endregion

/**
 * OpenAI adapter for language, embeddings, images, audio, video, realtime, files, and skills.
 *
 * @public
 */
@Injectable()
export class OpenAIIntelligenceProviderAdapter extends IntelligenceProviderAdapterBase {
    // #region Fields

    private static readonly _SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,200}$/u;
    private readonly _configService: ConfigService;
    private readonly _logger = new Logger(OpenAIIntelligenceProviderAdapter.name);

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();
        this._configService = configService;
    }

    // #endregion

    // #region Properties

    public readonly provider = IntelligenceProviderNames.OpenAI;
    public readonly capabilities = [
        IntelligenceCapabilityNames.Language,
        IntelligenceCapabilityNames.Embedding,
        IntelligenceCapabilityNames.Image,
        IntelligenceCapabilityNames.Speech,
        IntelligenceCapabilityNames.Transcription,
        IntelligenceCapabilityNames.Video,
        IntelligenceCapabilityNames.Realtime,
        IntelligenceCapabilityNames.Files,
        IntelligenceCapabilityNames.Skills,
    ] as const;

    // #endregion

    // #region Methods

    public override async load(request: IIntelligenceProviderLoadRequest): Promise<unknown> {
        const configuration = this.resolveConfiguration(request);
        const { createOpenAI } = await loadOpenAISdk();
        const provider = createOpenAI({
            ...createProviderOptions(configuration),
            fetch: createIntelligenceTimeoutFetch(request.providerRequestTimeoutMs),
        });
        const model = configuration.model;

        switch (request.capability) {
            case IntelligenceCapabilityNames.Language:
                return provider(model);
            case IntelligenceCapabilityNames.Embedding:
                return provider.embedding(model);
            case IntelligenceCapabilityNames.Image:
                return provider.image(model);
            case IntelligenceCapabilityNames.Speech:
                return provider.speech(model);
            case IntelligenceCapabilityNames.Transcription:
                return provider.transcription(model);
            case IntelligenceCapabilityNames.Video:
                if (!configuration.apiKey) {
                    throw new IntelligenceConfigurationError('OpenAI video generation requires an API key.');
                }

                return new OpenAIIntelligenceVideoModel({
                    apiKey: configuration.apiKey,
                    baseUrl: configuration.baseUrl ?? 'https://api.openai.com/v1',
                    fetch: createIntelligenceTimeoutFetch(request.providerRequestTimeoutMs),
                    modelId: model,
                });
            case IntelligenceCapabilityNames.Realtime:
                return provider.experimental_realtime(model);
            case IntelligenceCapabilityNames.Files:
                return provider.files();
            case IntelligenceCapabilityNames.Skills:
                return provider.skills();
            default:
                throw new IntelligenceConfigurationError(`OpenAI does not support the ${request.capability} capability through this adapter.`);
        }
    }

    public override async probe(request: IIntelligenceProviderLoadRequest): Promise<IIntelligenceProviderProbeResult> {
        const startedAt = Date.now();
        const configuration = this.resolveConfiguration(request);
        const checkedAt = new Date();

        if (!configuration.apiKey) {
            return this.createProbeResult(request, checkedAt, 'down', 'MISSING_CREDENTIALS');
        }

        const baseUrl = (configuration.baseUrl ?? 'https://api.openai.com/v1').replace(/\/+$/u, '');

        try {
            const response = await createIntelligenceTimeoutFetch(request.providerRequestTimeoutMs)(
                `${baseUrl}/models/${encodeURIComponent(configuration.model)}`,
                {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        authorization: `Bearer ${configuration.apiKey}`,
                    },
                },
            );

            if (response.ok) {
                return this.createProbeResult(request, checkedAt, 'operational', null);
            }

            if (response.status === 401 || response.status === 403) {
                return this.createProbeResult(request, checkedAt, 'down', 'AUTHENTICATION_FAILED');
            }

            if (response.status === 404) {
                return this.createProbeResult(request, checkedAt, 'down', 'MODEL_NOT_FOUND');
            }

            if (response.status === 429) {
                return this.createProbeResult(request, checkedAt, 'degraded', 'RATE_LIMITED');
            }

            return this.createProbeResult(request, checkedAt, response.status >= 500 ? 'degraded' : 'down', 'PROVIDER_UNAVAILABLE');
        } catch {
            this._logger.warn('OpenAI intelligence readiness probe failed.', {
                requestId: 'health',
                module: 'platform-intelligence',
                operation: 'provider.probe',
                provider: this.provider,
                duration: Date.now() - startedAt,
            });

            return this.createProbeResult(request, checkedAt, 'degraded', 'PROVIDER_UNAVAILABLE');
        }
    }

    /**
     * Seeds a GPT-Live WebRTC session with earlier conversation turns.
     *
     * GPT-Live accepts prior messages in the session's `input` and does not
     * speak because of them. All turns become one `user` message holding the
     * quoted history, so neither a developer message nor an assistant message
     * carries application-reported text. Realtime API calls cannot receive
     * earlier turns during WebRTC setup and resolve `null`.
     */
    public override async applyWebRTCConversationHistory(
        request: IIntelligenceProviderWebRTCConversationHistoryRequest,
    ): Promise<IIntelligenceRealtimeSessionConfiguration | null> {
        if ((await this.resolveRealtimeApi(request)) !== 'live') {
            return null;
        }

        const providerOptions = request.sessionConfiguration.providerOptions ?? {};
        const openAIOptions = providerOptions['openai'] ?? {};
        if (!this.isRecord(openAIOptions)) {
            throw new IntelligenceValidationError('OpenAI realtime providerOptions.openai must be an object.');
        }
        if ('input' in openAIOptions) {
            throw new IntelligenceValidationError('OpenAI Live conversation history cannot be combined with providerOptions.openai.input.');
        }

        return {
            ...request.sessionConfiguration,
            providerOptions: {
                ...providerOptions,
                openai: {
                    ...openAIOptions,
                    input: [
                        {
                            type: 'message',
                            role: 'user',
                            content: [{ type: 'input_text', text: formatIntelligenceRealtimeConversationHistory(request.conversationHistory) }],
                        },
                    ],
                },
            },
        };
    }

    /**
     * Hangs up a browser-owned OpenAI realtime session with the server API key.
     *
     * GPT-Live sessions end through `POST /live/sessions/{session_id}/hangup`
     * and Realtime API calls through `POST /realtime/calls/{call_id}/hangup`.
     * The model selects the API through the same OpenAI SDK routing that
     * negotiated the session. OpenAI reports unknown or ended sessions with a
     * session- or call-specific error code, which resolves as `already-ended`.
     * Provider error messages are never propagated because authentication
     * failures can echo parts of the API key.
     */
    public override async terminateWebRTCSession(request: IIntelligenceProviderWebRTCTerminationRequest): Promise<IntelligenceRealtimeWebRTCTerminationStatus> {
        const configuration = this.resolveTerminationConfiguration(request);
        const resource = await this.resolveRealtimeHangupResource(request);
        if (!resource) {
            return 'unsupported';
        }

        const baseUrl = (configuration.baseUrl ?? 'https://api.openai.com/v1').replace(/\/+$/u, '');
        const response = await this.sendRealtimeHangup(
            `${baseUrl}/${resource}/${encodeURIComponent(request.providerSessionId)}/hangup`,
            configuration.apiKey,
            request,
        );

        if (response.ok) {
            await response.body?.cancel();

            return 'terminated';
        }

        const errorCode = await this.readProviderErrorCode(response);
        if (
            response.status === 409 ||
            response.status === 410 ||
            ((response.status === 400 || response.status === 404) && isOpenAIEndedSessionErrorCode(errorCode))
        ) {
            return 'already-ended';
        }

        throw new IntelligenceProviderError(
            `OpenAI realtime session termination failed with HTTP ${response.status}${errorCode ? ` (${errorCode})` : ''}.`,
            configuration.provider,
            configuration.model,
            response.status === 408 || response.status === 429 || response.status >= 500,
        );
    }

    /**
     * Closes a browser-owned GPT-Live session through its sideband WebSocket
     * and returns the final voice duration from `session.closed`.
     *
     * GPT-Live bills sessions by duration and reports the final
     * `usage.seconds` only to the connections of the session, not in the
     * hangup response. The server attaches through
     * `wss://…/live/sessions/{session_id}/attach` with its API key, sends
     * `session.close`, and waits for `session.closed`. Realtime API calls are
     * priced by tokens and resolve `null`, so the factory hangs them up.
     */
    public override async closeWebRTCSession(request: IIntelligenceProviderWebRTCTerminationRequest): Promise<IIntelligenceProviderWebRTCClosure | null> {
        const configuration = this.resolveTerminationConfiguration(request);
        if ((await this.resolveRealtimeApi(request)) !== 'live') {
            return null;
        }

        const url = new URL(
            `${(configuration.baseUrl ?? 'https://api.openai.com/v1').replace(/\/+$/u, '')}/live/sessions/${encodeURIComponent(request.providerSessionId)}/attach`,
        );
        url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';

        return new OpenAILiveSessionControlChannel({
            url: url.toString(),
            apiKey: configuration.apiKey,
            provider: configuration.provider,
            model: configuration.model,
            abortSignal: request.abortSignal,
        }).close();
    }

    private createProbeResult(
        request: IIntelligenceProviderLoadRequest,
        checkedAt: Date,
        status: IIntelligenceProviderProbeResult['status'],
        failureCode: string | null,
    ): IIntelligenceProviderProbeResult {
        return {
            status,
            provider: request.configuration.provider,
            model: request.configuration.model,
            capability: request.capability,
            checkedAt,
            failureCode,
        };
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    private async readProviderErrorCode(response: Response): Promise<string | null> {
        try {
            return readOpenAIErrorCode(await response.json());
        } catch {
            // A non-JSON error body carries no machine-readable provider code.
            return null;
        }
    }

    /** Validates the credentials and provider session identifier every WebRTC termination path needs. */
    private resolveTerminationConfiguration(
        request: IIntelligenceProviderWebRTCTerminationRequest,
    ): IIntelligenceProviderLoadRequest['configuration'] & { readonly apiKey: string } {
        const configuration = this.resolveConfiguration(request);
        if (!configuration.apiKey) {
            throw new IntelligenceConfigurationError('OpenAI realtime session termination requires an API key.');
        }
        if (!OpenAIIntelligenceProviderAdapter._SESSION_ID_PATTERN.test(request.providerSessionId)) {
            throw new IntelligenceValidationError('OpenAI realtime providerSessionId must contain only letters, digits, underscores, and hyphens.');
        }

        return { ...configuration, apiKey: configuration.apiKey };
    }

    private resolveConfiguration(request: IIntelligenceProviderLoadRequest): IIntelligenceProviderLoadRequest['configuration'] {
        return resolveProviderAdapterConfiguration(this._configService, request.configuration, [OPENAI_API_KEY], [OPENAI_BASE_URL]);
    }

    /** Selects the OpenAI realtime API through the same SDK model routing that negotiates the session. */
    private async resolveRealtimeApi(request: IIntelligenceProviderLoadRequest): Promise<'live' | 'realtime' | null> {
        const { Experimental_OpenAIRealtimeModel: RealtimeModel, Experimental_OpenAIRealtimeModelLive: LiveModel } = await loadOpenAISdk();
        const model = await this.load({ ...request, capability: IntelligenceCapabilityNames.Realtime });

        if (model instanceof LiveModel) {
            return 'live';
        }

        if (model instanceof RealtimeModel) {
            return 'realtime';
        }

        return null;
    }

    private async resolveRealtimeHangupResource(request: IIntelligenceProviderLoadRequest): Promise<string | null> {
        switch (await this.resolveRealtimeApi(request)) {
            case 'live':
                return 'live/sessions';
            case 'realtime':
                return 'realtime/calls';
            default:
                return null;
        }
    }

    private async sendRealtimeHangup(url: string, apiKey: string, request: IIntelligenceProviderWebRTCTerminationRequest): Promise<Response> {
        try {
            return await createIntelligenceTimeoutFetch(request.providerRequestTimeoutMs)(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${apiKey}`,
                },
                signal: request.abortSignal,
            });
        } catch (error: unknown) {
            throw new IntelligenceProviderError(
                'OpenAI realtime session termination request failed without a provider response.',
                request.configuration.provider,
                request.configuration.model,
                true,
                error instanceof Error ? error : undefined,
            );
        }
    }

    // #endregion
}
