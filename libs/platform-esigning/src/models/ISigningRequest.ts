// #region Imports

import type { ISigner } from './ISigner.js';
import type { ISigningDocument } from './ISigningDocument.js';
import type { ISigningField } from './ISigningField.js';
import type { SigningRequestStatus } from './SigningRequestStatus.js';

// #endregion

/**
 * Normalized representation of a signing request (envelope/agreement).
 *
 * @public
 */
export interface ISigningRequest {
    /** Provider-specific signing request identifier. */
    readonly signingRequestId: string;

    /** Current status of the signing request. */
    readonly status: SigningRequestStatus;

    /** Subject or title of the signing request. */
    readonly subject: string;

    /** Optional message included with the signing request. */
    readonly message?: string;

    /** Signers participating in this request. */
    readonly signers: ReadonlyArray<ISigner>;

    /** Documents included in this request. */
    readonly documents: ReadonlyArray<ISigningDocument>;

    /** Fields placed across the documents. */
    readonly fields: ReadonlyArray<ISigningField>;

    /** Timestamp when the signing request was created. */
    readonly createdAt: Date;

    /** Timestamp when the signing request was last updated. */
    readonly updatedAt: Date;

    /** Timestamp when the signing request expires, if applicable. */
    readonly expiresAt?: Date;

    /** Provider-specific raw metadata. */
    readonly providerMetadata?: Record<string, unknown>;
}
