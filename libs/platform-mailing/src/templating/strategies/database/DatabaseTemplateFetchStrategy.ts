// #region Imports

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IMailTemplateVariants } from '../../../models/IMailTemplateVariants.js';
import type { IMailTemplateRepository } from '../../../interfaces/IMailTemplateRepository.js';
import { MAIL_TEMPLATE_REPOSITORY_TOKEN } from '../../../tokens/MailTokens.js';
import { TemplateFetchStrategyBase } from '../abstracts/TemplateFetchStrategyBase.js';

// #endregion

/**
 * Template fetch strategy that loads templates from a database via the
 * {@link IMailTemplateRepository} abstract base.
 *
 * Applications provide the concrete repository implementation at module
 * registration time. This strategy loads all templates on module init
 * and caches them in-memory.
 *
 * @public
 */
@Injectable()
export class DatabaseTemplateFetchStrategy extends TemplateFetchStrategyBase {
    // #region Fields

    private readonly _repository: IMailTemplateRepository;
    private readonly _logger: Logger = new Logger(DatabaseTemplateFetchStrategy.name);

    // #endregion

    // #region Ctor

    public constructor(@Inject(MAIL_TEMPLATE_REPOSITORY_TOKEN) repository: IMailTemplateRepository) {
        super();
        this._repository = repository;
    }

    // #endregion

    // #region Methods

    /**
     * Loads all templates from the database and returns them grouped by key.
     * Only the default locale (no locale or first match) is loaded into the
     * in-memory cache used by `MailTemplateEngine`.
     *
     * @public
     */
    public async load(): Promise<Record<string, IMailTemplateVariants>> {
        const templates: Record<string, IMailTemplateVariants> = {};
        const allTemplates = await this._repository.findAll();

        for (const template of allTemplates) {
            const key = template.key;

            if (!templates[key]) {
                templates[key] = {};
            }

            // Only set if not already filled (first match wins — default locale preferred)
            if (template.subject && !templates[key].subject) {
                templates[key].subject = template.subject;
            }

            if (template.htmlBody && !templates[key].html) {
                templates[key].html = template.htmlBody;
            }

            if (template.txtBody && !templates[key].txt) {
                templates[key].txt = template.txtBody;
            }
        }

        const templateCount = Object.keys(templates).length;
        this._logger.log(`${templateCount} template(s) loaded from database`);

        return templates;
    }

    // #endregion
}
