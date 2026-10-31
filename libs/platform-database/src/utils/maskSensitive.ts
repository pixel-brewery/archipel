/**
 * Keys whose values should be masked in log output.
 *
 * @remarks
 * Matched case-insensitively via the JSON.stringify replacer.
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
 * Recursively masks values of sensitive keys in a plain object before logging.
 *
 * @param value - The value to sanitize.
 * @returns A JSON string safe for logging.
 * @public
 */
export function maskSensitive(value: unknown): string {
    return JSON.stringify(value, (_key: string, val: unknown) => {
        if (typeof _key === 'string' && SENSITIVE_KEYS.has(_key.toLowerCase())) {
            return MASK;
        }
        return val;
    });
}
