/**
 * Provider-independent invoice status values.
 * `unknown` represents a provider status without a normalized equivalent.
 *
 * @public
 */
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void' | 'unknown';
