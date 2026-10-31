// #region Imports

import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IMailTemplateVariants } from '../../../models/IMailTemplateVariants.js';
import { MAIL_TEMPLATE_NAMES_TOKEN } from '../../../tokens/MailTokens.js';
import { TemplateFetchStrategyBase } from '../abstracts/TemplateFetchStrategyBase.js';

// #endregion

/**
 * The `FileTemplateFetchStrategy` class.
 *
 * Loads mail templates from the file system via `ResourceManager`.
 * Template names are injected via `MAIL_TEMPLATE_NAMES_TOKEN` — defaults to an empty array.
 *
 * @public
 */
@Injectable()
export class FileTemplateFetchStrategy extends TemplateFetchStrategyBase {
    // #region Fields

    private readonly _resourceManager: ResourceManager;
    private readonly _templateNames: ReadonlyArray<string>;
    private readonly _logger = new Logger(FileTemplateFetchStrategy.name);

    // #endregion

    // #region Ctor

    public constructor(resourceManager: ResourceManager, @Inject(MAIL_TEMPLATE_NAMES_TOKEN) templateNames: ReadonlyArray<string>) {
        super();
        this._resourceManager = resourceManager;
        this._templateNames = templateNames;
    }

    // #endregion

    // #region Methods

    /**
     * Loads mail templates from the file system.
     *
     * @public
     */
    public async load(): Promise<Record<string, IMailTemplateVariants>> {
        const templates: Record<string, IMailTemplateVariants> = {};

        let templateCount = 0;

        for (const templateName of this._templateNames) {
            if (!templates[templateName]) {
                templates[templateName] = {} as IMailTemplateVariants;
            }

            // Try loading html variant
            const htmlContent = await this._resourceManager.tryLoadAsStringAsync(`${templateName}.html`);
            if (htmlContent) {
                templates[templateName].html = htmlContent;
                templateCount++;
            }

            // Try loading txt variant
            const txtContent = await this._resourceManager.tryLoadAsStringAsync(`${templateName}.txt`);
            if (txtContent) {
                templates[templateName].txt = txtContent;
                templateCount++;
            }
        }

        this._logger.log(`${templateCount} Templates loaded from file system`);
        return templates;
    }

    // #endregion
}
