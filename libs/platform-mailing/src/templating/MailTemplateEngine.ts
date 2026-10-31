// #region Imports

import { CatchUtils, ContentTemplateEngine } from '@pixel-brewery/archipel-platform-core';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { IMailTemplateVariants } from '../models/IMailTemplateVariants.js';
import type { MailTemplateFormat } from '../models/MailTemplateFormat.js';
import { MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN } from '../tokens/MailTokens.js';
import { TemplateFetchStrategyBase } from './strategies/abstracts/TemplateFetchStrategyBase.js';

// #endregion

/**
 * The `MailTemplateEngine` class.
 *
 * @public
 */
@Injectable()
export class MailTemplateEngine implements OnModuleInit {
    // #region Fields

    private readonly _templateFetchStrategy: TemplateFetchStrategyBase;
    private readonly _contentTemplateEngine: ContentTemplateEngine;
    private _templates: Record<string, IMailTemplateVariants>;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `MailTemplateEngine` class.
     *
     * @public
     */
    public constructor(
        @Inject(MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN) templateFetchStrategy: TemplateFetchStrategyBase,
        contentTemplateEngine: ContentTemplateEngine,
    ) {
        this._templateFetchStrategy = templateFetchStrategy;
        this._contentTemplateEngine = contentTemplateEngine;
        this._templates = {};
    }

    // #endregion

    // #region Methods

    /**
     * Lifecycle hook that runs after the module initialization.
     * Loads all templates from the disk and caches them in memory.
     *
     * @public
     */
    public async onModuleInit(): Promise<void> {
        this._templates = await this._templateFetchStrategy.load();
    }

    /**
     * Compiles a template by replacing placeholders with the provided parameters.
     *
     * @public
     * @param templateKey The key of the template to compile.
     * @param params The parameters to insert into the template.
     * @param format The format of the template ('html' or 'txt').
     * @throws Error if the template or format is not found.
     * @returns The compiled template as a string.
     */
    public compileTemplate(templateKey: string, params: Record<string, unknown>, format: MailTemplateFormat): string {
        const templateVariants = this._templates[templateKey];
        if (!templateVariants) {
            throw new Error(`Template with key '${templateKey}' not found.`);
        }

        const template = templateVariants[format];
        if (!template) {
            throw new Error(`Template with key '${templateKey}' and format '${format}' not found.`);
        }

        try {
            const safeParams = format === 'html' ? this.escapeHtmlParams(params) : params;
            const interpolatedTemplate = this._contentTemplateEngine.compileTemplate(template, safeParams);
            return interpolatedTemplate;
        } catch (error: unknown) {
            CatchUtils.catch(error, (x) => new Error(`Template validation failed for key '${templateKey}' and format '${format}'. ${x.message}`));

            throw error;
        }
    }

    /**
     * Resolves and interpolates the subject line from a stored template.
     *
     * @public
     * @param templateKey The key of the template.
     * @param params The parameters to insert into the subject.
     * @returns The compiled subject string, or `undefined` if no subject is stored.
     */
    public resolveSubject(templateKey: string, params: Record<string, unknown>): string | undefined {
        const templateVariants = this._templates[templateKey];
        if (!templateVariants?.subject) {
            return undefined;
        }

        return this._contentTemplateEngine.compileTemplate(templateVariants.subject, params);
    }

    private escapeHtmlParams(params: Record<string, unknown>): Record<string, unknown> {
        const escaped: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(params)) {
            escaped[key] = typeof value === 'string' ? this.escapeHtml(value) : value;
        }

        return escaped;
    }

    private escapeHtml(text: string): string {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // #endregion
}
