/**
 * Represents the in-memory structure for a single template (multiple formats).
 *
 * @public
 */
export interface IMailTemplateVariants {
    subject?: string;
    html?: string;
    txt?: string;
}
