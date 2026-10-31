/**
 * Represents the role of a signer in a signing request.
 *
 * @public
 */
export const SignerRoles = {
    Signer: 'signer',
    CarbonCopy: 'carbon-copy',
    InPersonSigner: 'in-person-signer',
    Approver: 'approver',
    Witness: 'witness',
} as const;

/**
 * Union type derived from {@link SignerRoles}.
 *
 * @public
 */
export type SignerRole = (typeof SignerRoles)[keyof typeof SignerRoles];
