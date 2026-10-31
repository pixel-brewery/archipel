// #region Imports

import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { Logger } from '@nestjs/common';
import { SwaggerCustomOptions } from '@nestjs/swagger';
import { ISwaggerThemeConfig } from './ISwaggerThemeConfig.js';

// #endregion

/**
 * The swagger theme class
 *
 * @public
 */
export class SwaggerTheme {
    // #region Fields

    private readonly _resourceManager: ResourceManager;
    private readonly _config: ISwaggerThemeConfig;
    private readonly _logger = new Logger(SwaggerTheme.name);
    private _cachedBuffer: { css: string; js: string } | null = null;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `SwaggerTheme` class.
     *
     * @public
     * @param resourceManager - Resource manager for loading theme files
     * @param config - Optional theme configuration for branding colors
     */
    public constructor(resourceManager: ResourceManager, config?: ISwaggerThemeConfig) {
        this._resourceManager = resourceManager;
        this._config = config ?? {
            primary: '#0066cc',
            secondary: '#003d99',
        };
    }

    // #endregion

    // #region Properties

    /**
     * Returns the theme configuration
     */
    public getConfig(): ISwaggerThemeConfig {
        return this._config;
    }

    // #endregion

    // #region Methods

    public getOptions(): Pick<SwaggerCustomOptions, 'customCss' | 'customJsStr'> {
        const buffer = this.getBuffer();

        return {
            customCss: buffer.css,
            customJsStr: buffer.js,
        };
    }

    private getBuffer(): { css: string; js: string } {
        if (this._cachedBuffer) {
            return this._cachedBuffer;
        }

        this._logger.log('Loading theme files swagger.css and swagger.js');

        const cssContent = this._resourceManager.loadAsString('swagger.css');

        if (!cssContent) {
            throw new Error('Theme file swagger.css not found');
        }

        const jsContent = this._resourceManager.loadAsString('swagger.js');

        if (!jsContent) {
            throw new Error('Theme file swagger.js not found');
        }

        this._cachedBuffer = { css: cssContent, js: jsContent };
        return this._cachedBuffer;
    }

    // #endregion
}
