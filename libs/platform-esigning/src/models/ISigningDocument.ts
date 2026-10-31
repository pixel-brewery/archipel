/**
 * Normalized representation of a document within a signing request.
 *
 * @public
 */
export interface ISigningDocument {
    /** Provider-specific document identifier. */
    readonly documentId: string;

    /** Display name of the document. */
    readonly name: string;

    /** MIME type of the document. */
    readonly contentType: string;

    /** Size of the document in bytes, if known. */
    readonly sizeInBytes?: number;

    /** Number of pages in the document, if known. */
    readonly pageCount?: number;

    /** Order of the document within the signing request. */
    readonly order: number;
}
