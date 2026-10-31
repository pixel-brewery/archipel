// #region Constants

const ENDED_SESSION_ERROR_CODE_PATTERN = /^(?:session|call)(?:_id)?_(?:not_found|closed|ended|expired)$/u;

// #endregion

/**
 * Whether an OpenAI error code reports a realtime session or call that is
 * unknown, closed, ended, or expired.
 *
 * @internal
 */
export function isOpenAIEndedSessionErrorCode(code: string | null): boolean {
    return code !== null && ENDED_SESSION_ERROR_CODE_PATTERN.test(code);
}
