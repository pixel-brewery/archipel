import type { IMfaSubject } from '../contracts/IMfaSubject.js';
import type { IMfaSubjectUpdate } from '../contracts/IMfaSubjectUpdate.js';

/**
 * Abstract base for reading and writing MFA state on the underlying subject entity.
 * Used by the MfaService and all MFA channel implementations.
 *
 * @public
 */
export abstract class MfaSubjectBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Find an MFA subject by its unique identifier.
     *
     * @public
     * @param id - The subject identifier.
     * @returns The MFA subject or `null`.
     */
    public abstract findById(id: string): Promise<IMfaSubject | null>;

    /**
     * Update MFA-related fields on the subject.
     *
     * @public
     * @param id - The subject identifier.
     * @param data - The partial update payload.
     */
    public abstract updateMfaState(id: string, data: IMfaSubjectUpdate): Promise<void>;

    // #endregion
}
