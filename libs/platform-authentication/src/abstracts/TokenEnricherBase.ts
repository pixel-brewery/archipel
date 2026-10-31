import type { IAuthSubject } from '../contracts/IAuthSubject.js';

/**
 * Abstract base for enriching JWT claims with product-specific data.
 * This is an optional abstract base: when not provided, the token contains only base claims.
 *
 * @public
 */
export abstract class TokenEnricherBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Return additional claims to merge into the JWT payload.
     *
     * @public
     * @param subject - The authenticated subject.
     * @returns A record of additional claims.
     */
    public abstract enrichClaims(subject: IAuthSubject): Promise<Record<string, unknown>>;

    // #endregion
}
