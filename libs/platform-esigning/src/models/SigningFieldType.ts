/**
 * Represents the type of a signing field placed on a document.
 *
 * @public
 */
export const SigningFieldTypes = {
    Signature: 'signature',
    Initials: 'initials',
    DateSigned: 'date-signed',
    Text: 'text',
    Checkbox: 'checkbox',
    Name: 'name',
    Email: 'email',
    Company: 'company',
    Title: 'title',
} as const;

/**
 * Union type derived from {@link SigningFieldTypes}.
 *
 * @public
 */
export type SigningFieldType = (typeof SigningFieldTypes)[keyof typeof SigningFieldTypes];
