// #region Imports

import type {
    Experimental_VideoModelV4 as VideoModelV4,
    Experimental_VideoModelV4CallOptions as VideoModelV4CallOptions,
    Experimental_VideoModelV4File as VideoModelV4File,
    Experimental_VideoModelV4Result as VideoModelV4Result,
    SharedV4Warning,
} from '@ai-sdk/provider';

// #endregion

// #region Types

interface IOpenAIVideoJob {
    readonly id: string;
    readonly model: string | null;
    readonly status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'expired';
    readonly failureMessage: string | null;
}

interface IOpenAIVideoModelOptions {
    readonly apiKey: string;
    readonly baseUrl: string;
    readonly fetch: typeof fetch;
    readonly modelId: string;
}

// #endregion

/**
 * Internal AI SDK video-model bridge for OpenAI's asynchronous Videos API.
 *
 * The OpenAI AI SDK provider does not currently expose a video model. Keeping
 * this bridge inside the OpenAI entry point preserves the provider-neutral
 * media facade and confines the provider-specific job lifecycle to its adapter.
 *
 * @internal
 */
export class OpenAIIntelligenceVideoModel implements VideoModelV4 {
    // #region Fields

    private readonly _apiKey: string;
    private readonly _baseUrl: string;
    private readonly _fetch: typeof fetch;

    // #endregion

    // #region Ctor

    public constructor(options: IOpenAIVideoModelOptions) {
        this._apiKey = options.apiKey;
        this._baseUrl = options.baseUrl.replace(/\/+$/u, '');
        this._fetch = options.fetch;
        this.modelId = options.modelId;
    }

    // #endregion

    // #region Properties

    public readonly specificationVersion = 'v4';
    public readonly provider = 'openai.video';
    public readonly modelId: string;
    public readonly maxVideosPerCall = 1;

    // #endregion

    // #region Methods

    public async doGenerate(options: VideoModelV4CallOptions): Promise<VideoModelV4Result> {
        const timestamp = new Date();
        const warnings = this.createWarnings(options);
        const createResponse = await this.createVideo(options);
        let job = await this.readJob(createResponse);

        while (job.status === 'queued' || job.status === 'in_progress') {
            await this.wait(this.resolvePollInterval(options), options.abortSignal);
            job = await this.retrieveVideo(job.id, options);
        }

        if (job.status !== 'completed') {
            throw new Error(job.failureMessage ?? `OpenAI video generation ended with status ${job.status}.`);
        }

        const contentResponse = await this.request(`${this._baseUrl}/videos/${encodeURIComponent(job.id)}/content`, {
            method: 'GET',
            headers: this.createHeaders(options.headers),
            signal: options.abortSignal,
        });
        const mediaType = contentResponse.headers.get('content-type')?.split(';', 1)[0]?.trim() || 'video/mp4';
        const content = new Uint8Array(await contentResponse.arrayBuffer());

        return {
            videos: [{ type: 'binary', data: content, mediaType }],
            warnings,
            providerMetadata: {
                openai: {
                    videoId: job.id,
                    status: job.status,
                },
            },
            response: {
                timestamp,
                modelId: job.model ?? this.modelId,
                headers: Object.fromEntries(createResponse.headers.entries()),
            },
        };
    }

    private appendFormValue(form: FormData, key: string, value: unknown): void {
        if (value === undefined || value === null) {
            return;
        }

        form.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }

    private async createVideo(options: VideoModelV4CallOptions): Promise<Response> {
        const inputReference = this.resolveInputReference(options);
        const body = this.createRequestBody(options);

        if (inputReference?.type === 'file') {
            const form = new FormData();
            Object.entries(body).forEach(([key, value]) => this.appendFormValue(form, key, value));
            form.append('input_reference', new Blob([this.toBytes(inputReference.data)], { type: inputReference.mediaType }), 'input-reference');

            return this.request(`${this._baseUrl}/videos`, {
                method: 'POST',
                headers: this.createHeaders(options.headers),
                body: form,
                signal: options.abortSignal,
            });
        }

        if (inputReference?.type === 'url') {
            body['input_reference'] = { image_url: inputReference.url };
        }

        return this.request(`${this._baseUrl}/videos`, {
            method: 'POST',
            headers: this.createHeaders(options.headers, true),
            body: JSON.stringify(body),
            signal: options.abortSignal,
        });
    }

    private createHeaders(headers: Record<string, string | undefined> | undefined, json = false): Record<string, string> {
        const result: Record<string, string> = {};

        for (const [key, value] of Object.entries(headers ?? {})) {
            if (value !== undefined && key.toLowerCase() !== 'authorization' && key.toLowerCase() !== 'content-type') {
                result[key] = value;
            }
        }

        result['authorization'] = `Bearer ${this._apiKey}`;

        if (json) {
            result['content-type'] = 'application/json';
        }

        return result;
    }

    private createRequestBody(options: VideoModelV4CallOptions): Record<string, unknown> {
        const openAIOptions = options.providerOptions['openai'] ?? {};
        const body: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(openAIOptions)) {
            if (key !== 'videoPollIntervalMs') {
                body[key] = value;
            }
        }

        body['model'] = this.modelId;

        if (options.prompt) {
            body['prompt'] = options.prompt;
        }

        if (options.resolution) {
            body['size'] = options.resolution;
        }

        if (options.duration !== undefined) {
            body['seconds'] = String(options.duration);
        }

        return body;
    }

    private createWarnings(options: VideoModelV4CallOptions): Array<SharedV4Warning> {
        const warnings: Array<SharedV4Warning> = [];
        const unsupported = (feature: string, details: string): void => {
            warnings.push({ type: 'unsupported', feature, details });
        };

        if (options.aspectRatio) {
            unsupported('aspectRatio', 'OpenAI video generation uses the explicit resolution/size option.');
        }

        if (options.fps !== undefined) {
            unsupported('fps', 'The OpenAI Videos API does not expose an FPS parameter.');
        }

        if (options.seed !== undefined) {
            unsupported('seed', 'The OpenAI Videos API does not expose a seed parameter.');
        }

        if (options.generateAudio !== undefined) {
            unsupported('generateAudio', 'Audio generation is determined by the selected OpenAI video model.');
        }

        if (options.frameImages?.some((frame) => frame.frameType === 'last_frame')) {
            unsupported('lastFrame', 'The OpenAI Videos API accepts an opening image reference but no final-frame constraint.');
        }

        if ((options.inputReferences?.length ?? 0) > 1) {
            unsupported('inputReferences', 'The OpenAI Videos API accepts one image reference per generation.');
        }

        return warnings;
    }

    private getFailureMessage(value: Record<string, unknown>): string | null {
        const error = value['error'];

        if (typeof error === 'string') {
            return error;
        }

        if (this.isRecord(error) && typeof error['message'] === 'string') {
            return error['message'];
        }

        return null;
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    private async readJob(response: Response): Promise<IOpenAIVideoJob> {
        const value: unknown = await response.json();

        if (!this.isRecord(value) || typeof value['id'] !== 'string' || typeof value['status'] !== 'string') {
            throw new Error('OpenAI returned an invalid video job response.');
        }

        if (!['queued', 'in_progress', 'completed', 'failed', 'expired'].includes(value['status'])) {
            throw new Error(`OpenAI returned an unsupported video job status: ${value['status']}.`);
        }

        return {
            id: value['id'],
            model: typeof value['model'] === 'string' ? value['model'] : null,
            status: value['status'] as IOpenAIVideoJob['status'],
            failureMessage: this.getFailureMessage(value),
        };
    }

    private async request(input: string, init: RequestInit): Promise<Response> {
        const response = await this._fetch(input, init);

        if (!response.ok) {
            let message = `OpenAI video request failed with status ${response.status}.`;

            try {
                const value: unknown = await response.json();

                if (this.isRecord(value)) {
                    message = this.getFailureMessage(value) ?? message;
                }
            } catch {
                // The stable status message remains when the provider body is not JSON.
            }

            throw new Error(message);
        }

        return response;
    }

    private resolveInputReference(options: VideoModelV4CallOptions): VideoModelV4File | undefined {
        if (options.image) {
            return options.image;
        }

        const firstFrame = options.frameImages?.find((frame) => frame.frameType === 'first_frame');

        if (firstFrame) {
            return firstFrame.image;
        }

        return options.inputReferences?.[0];
    }

    private resolvePollInterval(options: VideoModelV4CallOptions): number {
        const configured = options.providerOptions['openai']?.['videoPollIntervalMs'];

        return typeof configured === 'number' && Number.isFinite(configured) && configured > 0 ? configured : 10_000;
    }

    private async retrieveVideo(id: string, options: VideoModelV4CallOptions): Promise<IOpenAIVideoJob> {
        const response = await this.request(`${this._baseUrl}/videos/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: this.createHeaders(options.headers),
            signal: options.abortSignal,
        });

        return this.readJob(response);
    }

    private toBytes(data: string | Uint8Array): Uint8Array<ArrayBuffer> {
        return typeof data === 'string' ? Uint8Array.from(Buffer.from(data, 'base64')) : Uint8Array.from(data);
    }

    private async wait(durationMs: number, signal: AbortSignal | undefined): Promise<void> {
        if (signal?.aborted) {
            throw signal.reason instanceof Error ? signal.reason : new Error('OpenAI video generation was aborted.');
        }

        await new Promise<void>((resolve, reject) => {
            const complete = (): void => {
                signal?.removeEventListener('abort', abort);
                resolve();
            };
            const abort = (): void => {
                clearTimeout(timeout);
                signal?.removeEventListener('abort', abort);
                reject(signal?.reason instanceof Error ? signal.reason : new Error('OpenAI video generation was aborted.'));
            };
            const timeout = setTimeout(complete, durationMs);
            signal?.addEventListener('abort', abort, { once: true });
        });
    }

    // #endregion
}
