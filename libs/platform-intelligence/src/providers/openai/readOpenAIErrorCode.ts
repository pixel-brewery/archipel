// #region Constants

const ERROR_CODE_PATTERN = /^[a-z][a-z0-9_]{0,99}$/u;

// #endregion

/**
 * Reads the machine-readable OpenAI error code from a parsed error body.
 *
 * Only well-formed codes are returned. Provider error messages are never
 * read because authentication failures can echo parts of the API key.
 *
 * @internal
 */
export function readOpenAIErrorCode(body: unknown): string | null {
    const error = isRecord(body) ? body['error'] : null;
    const code = isRecord(error) ? error['code'] : null;

    return typeof code === 'string' && ERROR_CODE_PATTERN.test(code) ? code : null;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
