// #region Imports

import type { SignerRole } from './SignerRole.js';
import type { SignerStatus } from './SignerStatus.js';

// #endregion

/**
 * Normalized representation of a signer participating in a signing request.
 *
 * @public
 */
export interface ISigner {
    /** Provider-specific signer identifier. */
    readonly signerId: string;

    /** Email address of the signer. */
    readonly email: string;

    /** Display name of the signer. */
    readonly name: string;

    /** Role of the signer in the signing process. */
    readonly role: SignerRole;

    /** Current status of this signer. */
    readonly status: SignerStatus;

    /** Routing order determining the signing sequence. */
    readonly order: number;
}
