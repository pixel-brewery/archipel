/**
 * Normalized representation of a signed (completed) document.
 *
 * @public
 */
export interface ISignedDocument {
    /** Provider-specific document identifier. */
    readonly documentId: string;

    /** Signing request this document belongs to. */
    readonly signingRequestId: string;

    /** Display name of the signed document. */
    readonly name: string;

    /** MIME type of the signed document. */
    readonly contentType: string;

    /** The signed document content as a buffer. */
    readonly content: Buffer;

    /** Size of the signed document in bytes. */
    readonly sizeInBytes: number;
}
