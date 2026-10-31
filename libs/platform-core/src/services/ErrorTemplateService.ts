// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { Injectable } from '@nestjs/common';
import type { RequiredDeep } from 'type-fest';
import { APP_NAME, NODE_ENV } from '../env.js';
import { ContentTemplateEngine } from '../templates/ContentTemplateEngine.js';

// #endregion

// #region Interfaces

/**
 * Parameters for generating error page content.
 *
 * @public
 */
export interface IErrorPageParams {
    /**
     * The HTTP status code.
     */
    statusCode: number;

    /**
     * The error title.
     */
    title: string;

    /**
     * The error message.
     */
    message: string;

    /**
     * The request path.
     */
    path: string;

    /**
     * Optional timestamp.
     */
    timestamp?: string;

    /**
     * Optional action button text.
     * @default "Go to Home"
     */
    actionText?: string;

    /**
     * Whether to show error details (path, timestamp).
     * @default false in production
     */
    showDetails?: boolean;

    /**
     * Optional style configuration.
     */
    style?: {
        primary: string;
        secondary: string;
    };

    /**
     * Optional footer configuration.
     */
    footer?: {
        copyright: string;
    };
}

// #endregion

/**
 * Service for rendering error page templates.
 *
 * @public
 */
@Injectable()
export class ErrorTemplateService {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _contentTemplateEngine: ContentTemplateEngine;
    private readonly _resourceManager: ResourceManager;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `ErrorTemplateService` class.
     *
     * @public
     */
    public constructor(configService: ConfigService, contentTemplateEngine: ContentTemplateEngine, resourceManager: ResourceManager) {
        this._configService = configService;
        this._contentTemplateEngine = contentTemplateEngine;
        this._resourceManager = resourceManager;
    }

    // #endregion

    // #region Methods

    /**
     * Retrieves the error page HTML content.
     *
     * @public
     * @param params - The error page parameters.
     * @returns The rendered HTML content.
     */
    public async getErrorPageContent(params: IErrorPageParams): Promise<string> {
        const isProduction = this._configService.tryGet<string>(NODE_ENV.key, 'development') === 'production';

        const paramsWithDefaults: RequiredDeep<IErrorPageParams> = {
            statusCode: params.statusCode,
            title: params.title,
            message: params.message,
            path: params.path,
            timestamp: params.timestamp ?? new Date().toISOString(),
            actionText: params.actionText ?? 'Go to Home',
            showDetails: params.showDetails ?? !isProduction,
            style: {
                primary: params.style?.primary ?? '#e6492a',
                secondary: params.style?.secondary ?? '#c7206a',
            },
            footer: {
                copyright: params.footer?.copyright ?? `${new Date().getFullYear()} ${this._configService.get<string>(APP_NAME.key)}. All rights reserved.`,
            },
        };

        const template = await this._resourceManager.loadAsStringAsync('error.html');
        const compiledTemplate = this._contentTemplateEngine.compileTemplate(template, paramsWithDefaults as unknown as Record<string, unknown>);

        return compiledTemplate;
    }

    /**
     * Gets a human-readable error title based on status code.
     *
     * @public
     * @param statusCode - The HTTP status code.
     * @returns The error title.
     */
    public getErrorTitle(statusCode: number): string {
        const titles: Record<number, string> = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Page Not Found',
            405: 'Method Not Allowed',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            422: 'Unprocessable Entity',
            429: 'Too Many Requests',
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
        };

        return titles[statusCode] ?? 'Error';
    }

    /**
     * Gets a human-readable error message based on status code.
     *
     * @public
     * @param statusCode - The HTTP status code.
     * @returns The error message.
     */
    public getErrorMessage(statusCode: number): string {
        const messages: Record<number, string> = {
            400: 'The request could not be understood or was missing required parameters.',
            401: 'Authentication is required to access this resource.',
            403: 'You do not have permission to access this resource.',
            404: 'The page you are looking for could not be found. It might have been moved or deleted.',
            405: 'The HTTP method used is not allowed for this resource.',
            408: 'The request took too long to process.',
            409: 'The request could not be completed due to a conflict.',
            410: 'The requested resource is no longer available and will not be available again.',
            422: 'The request was well-formed but contains semantic errors.',
            429: 'Too many requests. Please try again later.',
            500: 'Something went wrong on our end. We are working to fix the issue.',
            501: 'This functionality is not implemented yet.',
            502: 'Received an invalid response from the upstream server.',
            503: 'The service is temporarily unavailable. Please try again later.',
            504: 'The upstream server failed to respond in time.',
        };

        return messages[statusCode] ?? 'An unexpected error occurred.';
    }

    // #endregion
}
