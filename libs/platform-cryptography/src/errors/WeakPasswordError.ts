// #region Imports

import { CryptographyErrorBase } from './abstracts/CryptographyErrorBase.js';

// #endregion

/**
 * Thrown when a password does not meet the minimum strength requirements.
 *
 * @public
 */
export class WeakPasswordError extends CryptographyErrorBase {
    // #region Ctor

    public constructor(message = 'The provided password does not meet the minimum strength requirements.') {
        super(message, 'WEAK_PASSWORD');
        this.name = 'WeakPasswordError';
    }

    // #endregion
}
