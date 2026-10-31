/**
 * Represents a single mail template record stored in a persistent store.
 *
 * @public
 */
export interface IMailTemplate {
    /**
     * Unique template key used to identify this template (e.g. `AuthRegister`, `AppointmentInvitation`).
     */
    readonly key: string;

    /**
     * Locale identifier (e.g. `de`, `en`). Used for multi-language support.
     * When `undefined`, it is the default/fallback template.
     */
    readonly locale?: string;

    /**
     * Default subject line for this template.
     * Can contain placeholders (e.g. `{{appName}}`).
     */
    readonly subject: string;

    /**
     * HTML body of the template. Contains Handlebars-style placeholders.
     */
    readonly htmlBody?: string;

    /**
     * Plain-text body of the template. Contains Handlebars-style placeholders.
     */
    readonly txtBody?: string;

    /**
     * Human-readable description of this template's purpose.
     */
    readonly description?: string;

    /**
     * List of placeholder names expected by this template (for documentation/validation).
     */
    readonly placeholders?: ReadonlyArray<string>;
}
