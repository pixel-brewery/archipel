/**
 * Domain error thrown when email delivery fails.
 *
 * @public
 */
export class MailDeliveryError extends Error {
    // #region Fields

    public readonly code = 'MAIL_DELIVERY';
    public readonly provider: string;

    // #endregion

    // #region Ctor

    public constructor(provider: string, message: string, cause?: unknown) {
        super(message, { cause });
        this.name = 'MailDeliveryError';
        this.provider = provider;
    }

    // #endregion
}
