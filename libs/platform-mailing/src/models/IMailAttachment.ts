/**
 * Allowed MIME types for email attachments.
 *
 * @public
 */
export const ALLOWED_ATTACHMENT_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv',
] as const;

/**
 * Maximum attachment size in bytes (25 MB).
 *
 * @public
 */
export const MAX_ATTACHMENT_SIZE_BYTES = 25 * 1024 * 1024;

/**
 * Represents an email attachment.
 *
 * @public
 */
export interface IMailAttachment {
    /**
     * The filename of the attachment as displayed to the recipient.
     */
    readonly filename: string;

    /**
     * The raw content of the attachment.
     */
    readonly content: Buffer | string;

    /**
     * The MIME type of the attachment.
     */
    readonly contentType: string;
}
