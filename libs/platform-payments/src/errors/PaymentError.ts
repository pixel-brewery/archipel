/**
 * Domain error thrown when a payment operation fails.
 *
 * @public
 */
export class PaymentError extends Error {
    // #region Fields

    public readonly code = 'PAYMENT';
    public readonly provider: string;

    // #endregion

    // #region Ctor

    public constructor(provider: string, message: string, cause?: unknown) {
        super(message, { cause });
        this.name = 'PaymentError';
        this.provider = provider;
    }

    // #endregion
}
