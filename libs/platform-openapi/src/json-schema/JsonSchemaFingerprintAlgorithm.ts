/**
 * Stable identifier for the validation-semantic JSON Schema fingerprint.
 *
 * Consumers must compare this identifier together with the fingerprint. A new
 * identifier is required whenever canonicalization rules change.
 *
 * @public
 */
export const JSON_SCHEMA_FINGERPRINT_ALGORITHM = 'json-schema-validation-sha256-v1' as const;
