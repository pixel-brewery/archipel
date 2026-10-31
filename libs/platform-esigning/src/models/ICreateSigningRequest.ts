// #region Imports

import type { SignerRole } from './SignerRole.js';
import type { ISigningField } from './ISigningField.js';

// #endregion

/**
 * Input for creating a new signing request.
 *
 * @public
 */
export interface ICreateSigningRequest {
    /** Subject or title of the signing request. */
    readonly subject: string;

    /** Optional message for the signers. */
    readonly message?: string;

    /** Documents to include in the signing request. */
    readonly documents: ReadonlyArray<ICreateSigningRequestDocument>;

    /** Signers to participate in the signing request. */
    readonly signers: ReadonlyArray<ICreateSigningRequestSigner>;

    /** Fields to place on the documents. */
    readonly fields?: ReadonlyArray<Omit<ISigningField, 'fieldId' | 'value'>>;

    /** Expiration duration in hours, if applicable. */
    readonly expiresInHours?: number;

    /** Provider-specific extra options. */
    readonly providerOptions?: Record<string, unknown>;
}

/**
 * A document to include when creating a signing request.
 *
 * @public
 */
export interface ICreateSigningRequestDocument {
    /** Display name of the document. */
    readonly name: string;

    /** MIME type of the document content. */
    readonly contentType: string;

    /** Document content as a buffer. */
    readonly content: Buffer;

    /** Order of the document within the request. */
    readonly order: number;
}

/**
 * A signer to include when creating a signing request.
 *
 * @public
 */
export interface ICreateSigningRequestSigner {
    /** Email address of the signer. */
    readonly email: string;

    /** Display name of the signer. */
    readonly name: string;

    /** Role of the signer. */
    readonly role: SignerRole;

    /** Routing order determining the signing sequence. */
    readonly order: number;
}
