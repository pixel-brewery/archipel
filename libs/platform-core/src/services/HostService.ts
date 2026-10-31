// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { type IHealthCheckResult } from '@pixel-brewery/archipel-platform-health';
import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { Injectable } from '@nestjs/common';
import { APP_PORT, APP_URL, APP_VERSION, NODE_ENV } from '../env.js';
import { ContentTemplateEngine } from '../templates/ContentTemplateEngine.js';

// #endregion

// #region Interfaces

/**
 * Parameters for generating host content.
 *
 * @public
 */
export interface IHostContentParams {
    /**
     * The title of the page.
     */
    title: string;

    /**
     * The subtitle/description of the page.
     */
    description: string;

    /**
     * The logo URL (can be a regular URL or data URL).
     */
    logo: string;

    /**
     * Optional array of action buttons (CTAs).
     */
    actions?: Array<{
        /**
         * The description of the action (used as button text).
         */
        description: string;

        /**
         * The link URL for the action.
         */
        link: string;
    }>;

    /**
     * Optional array of feature cards.
     */
    features?: Array<{
        /**
         * The title of the feature.
         */
        title: string;

        /**
         * The description of the feature (used as link text).
         */
        description: string;

        /**
         * The link URL for the feature.
         */
        link: string;

        /**
         * Optional icon (emoji or URL).
         */
        icon?: string;
    }>;

    /**
     * Optional style configuration.
     */
    style?: {
        primary: string;
        secondary: string;
    };

    /**
     * Optional health check result to display.
     */
    health?: IHealthCheckResult[];

    /**
     * Optional footer configuration.
     */
    footer?: {
        /**
         * Optional stage label (e.g., "Beta", "Alpha").
         */
        stage?: string;

        /**
         * Copyright text (e.g., "© 2025 Company Name. All rights reserved.").
         */
        copyright: string;

        /**
         * Optional version string.
         */
        version?: string;

        /**
         * Optional array of footer links.
         */
        links?: Array<{
            /**
             * The label of the footer link.
             */
            label: string;

            /**
             * The URL of the footer link.
             */
            url: string;
        }>;
    };

    /**
     * Optional additional data to be injected into the template.
     */
    data?: Record<string, unknown>;
}

// #endregion

/**
 * The `HostService` class.
 *
 * @public
 */
@Injectable()
export class HostService {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _contentTemplateEngine: ContentTemplateEngine;
    private readonly _resourceManager: ResourceManager;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `HostService` class.
     *
     * @public
     */
    public constructor(configService: ConfigService, contentTemplateEngine: ContentTemplateEngine, resourceManager: ResourceManager) {
        this._configService = configService;
        this._contentTemplateEngine = contentTemplateEngine;
        this._resourceManager = resourceManager;
    }

    // #endregion

    // #region Properties

    /**
     * The URL of the host.
     *
     * @public
     * @readonly
     */
    public get url(): string {
        return this._configService.get(APP_URL.key);
    }

    /**
     * The port of the host.
     *
     * @public
     * @readonly
     */
    public get port(): number {
        return this._configService.get<number>(APP_PORT.key);
    }

    /**
     * The full host (URL + port in development).
     *
     * @public
     * @readonly
     */
    public get host(): string {
        return this.stage === 'development' ? `${this.url}:${this.port}` : this.url;
    }

    /**
     * The current stage of the application.
     *
     * @public
     * @readonly
     */
    public get stage(): 'unknown' | 'local' | 'development' | 'preview' | 'production' {
        switch (this._configService.tryGet<string>(NODE_ENV.key, 'unknown')) {
            case 'development':
                return 'development';
            case 'preview':
                return 'preview';
            case 'production':
                return 'production';
            case 'local':
                return 'local';
            default:
                return 'unknown';
        }
    }

    /**
     * The application version.
     *
     * @public
     * @readonly
     */
    public get version(): string {
        return this._configService.get<string>(APP_VERSION.key) || 'unknown';
    }

    // #endregion

    // #region Methods
    /**
     * Retrieves the host content
     *
     * @public
     */
    public async getHostContent(params: IHostContentParams): Promise<string> {
        const paramsWithDefaults = {
            title: params.title,
            description: params.description,
            logo: params.logo,
            actions: (params.actions ?? []).map((action) => ({
                description: action.description,
                link: action.link,
            })),
            features: (params.features ?? []).map((feature) => ({
                title: feature.title,
                description: feature.description,
                link: feature.link,
                icon: feature.icon ?? '',
            })),
            style: {
                primary: params.style?.primary ?? '',
                secondary: params.style?.secondary ?? '',
            },
            health: params?.health ?? [],
            footer: {
                stage: params.footer?.stage ?? '',
                version: params.footer?.version ?? '',
                copyright: params.footer?.copyright ?? '',
                links: (params.footer?.links ?? []).map((link) => ({
                    label: link.label,
                    url: link.url,
                })),
            },
            data: params.data ?? {},
        };

        const template = await this._resourceManager.loadAsStringAsync('index.html');
        const compiledTemplate = this._contentTemplateEngine.compileTemplate(template, paramsWithDefaults as unknown as Record<string, unknown>);

        return compiledTemplate;
    }

    // #endregion
}
