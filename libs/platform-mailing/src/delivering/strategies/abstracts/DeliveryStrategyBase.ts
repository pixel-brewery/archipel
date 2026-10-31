import type { IMailAttachment } from '../../../models/IMailAttachment.js';

/**
 * Represents the base class for all email delivery strategies.
 *
 * @public
 * @abstract
 */
export abstract class DeliveryStrategyBase {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the `DeliveryStrategyBase` class.
     *
     * @protected
     */
    protected constructor() {
        //
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Sends an email with either plain text or HTML content.
     *
     * @public
     * @abstract
     * @param from - Sender's email address (optional, defaults to config)
     * @param to - Recipient's email address
     * @param subject - Subject of the email
     * @param content - Email body content (plain text or HTML)
     * @param isHtml - Flag to indicate whether the email is HTML (true) or plain text (false)
     * @param attachments - Optional array of file attachments
     */
    public abstract send(from: string, to: string, subject: string, content: string, isHtml: boolean, attachments?: Array<IMailAttachment>): Promise<void>;

    // #endregion
}
