/**
 * Canonical set of keys whose values must be masked in log output.
 *
 * @remarks
 * The set is matched **case-insensitively** so both `password` and
 * `Password` are redacted.
 *
 * @internal
 */
const SENSITIVE_KEYS = new Set([
    'password',
    'passwordhash',
    'token',
    'accesstoken',
    'refreshtoken',
    'secret',
    'apikey',
    'authorization',
    'creditcard',
    'ssn',
    'pin',
    'email',
]);

const MASK = '***';

/**
 * Recursively masks values of sensitive keys in a plain object for safe logging.
 *
 * @param value - Arbitrary value to sanitize (objects, arrays, primitives).
 * @returns A new value with sensitive fields replaced by `'***'`.
 *
 * @public
 */
export function maskSensitiveFields(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    if (Array.isArray(value)) {
        return value.map((item) => maskSensitiveFields(item));
    }

    if (typeof value === 'object') {
        const masked: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
            if (SENSITIVE_KEYS.has(key.toLowerCase())) {
                masked[key] = MASK;
            } else if (typeof val === 'object' && val !== null) {
                masked[key] = maskSensitiveFields(val);
            } else {
                masked[key] = val;
            }
        }
        return masked;
    }

    return value;
}

/**
 * Serializes a value to a JSON string with sensitive keys masked.
 *
 * @param value - Arbitrary value to sanitize and serialize.
 * @returns A JSON string safe for logging.
 *
 * @public
 */
export function maskSensitive(value: unknown): string {
    return JSON.stringify(maskSensitiveFields(value));
}
