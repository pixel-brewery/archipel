// #region Imports

import { EsigningError } from './EsigningError.js';

// #endregion

/**
 * Thrown when a webhook signature verification fails.
 *
 * @public
 */
export class WebhookVerificationError extends EsigningError {
    // #region Ctor

    public constructor(message?: string) {
        super(message ?? 'Webhook signature verification failed.', 'WEBHOOK_VERIFICATION_FAILED');
        this.name = 'WebhookVerificationError';
    }

    // #endregion
}
