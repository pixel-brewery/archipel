// #region Imports

import type { SigningFieldType } from './SigningFieldType.js';

// #endregion

/**
 * Normalized representation of a signing field placed on a document.
 *
 * @public
 */
export interface ISigningField {
    /** Provider-specific field identifier. */
    readonly fieldId: string;

    /** Type of the field. */
    readonly type: SigningFieldType;

    /** Identifier of the signer associated with this field. */
    readonly signerId: string;

    /** Identifier of the document this field is placed on. */
    readonly documentId: string;

    /** Page number where the field is placed (1-based). */
    readonly pageNumber: number;

    /** X-coordinate position (points from left). */
    readonly positionX: number;

    /** Y-coordinate position (points from top). */
    readonly positionY: number;

    /** Width of the field in points. */
    readonly width: number;

    /** Height of the field in points. */
    readonly height: number;

    /** Whether the field is required. */
    readonly required: boolean;

    /** Current value of the field, if filled. */
    readonly value?: string;
}
