/**
 * JSON-compatible value used by provider-neutral intelligence contracts.
 *
 * @public
 */
export type IntelligenceJsonValue = string | number | boolean | null | ReadonlyArray<IntelligenceJsonValue> | { readonly [key: string]: IntelligenceJsonValue };
