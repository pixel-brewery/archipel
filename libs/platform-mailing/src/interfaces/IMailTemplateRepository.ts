import type { IMailTemplate } from '../models/IMailTemplate.js';

/**
 * Contract for mail template persistence.
 *
 * Applications must implement this interface and register the implementation
 * via the `MAIL_TEMPLATE_REPOSITORY_TOKEN` when using the `database` template strategy.
 *
 * @public
 */
export interface IMailTemplateRepository {
    /**
     * Finds a template by its unique key and optional locale.
     * When no locale is provided, returns the default (locale-agnostic) template.
     *
     * @param key - The template key (e.g. `AuthRegister`).
     * @param locale - Optional locale identifier (e.g. `de`, `en`).
     * @returns The matching template, or `undefined` if not found.
     */
    findByKey(key: string, locale?: string): Promise<IMailTemplate | undefined>;

    /**
     * Returns all templates available in the store.
     */
    findAll(): Promise<Array<IMailTemplate>>;

    /**
     * Creates or updates a template. Upsert semantics: if a template with the
     * same `key` and `locale` exists, it is overwritten.
     *
     * @param template - The template to persist.
     * @returns The persisted template.
     */
    upsert(template: IMailTemplate): Promise<IMailTemplate>;

    /**
     * Deletes a template by key and locale.
     *
     * @param key - The template key.
     * @param locale - Optional locale. When omitted, deletes the default template.
     */
    delete(key: string, locale?: string): Promise<void>;
}
