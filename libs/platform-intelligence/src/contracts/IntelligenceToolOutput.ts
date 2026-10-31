/**
 * Provider-neutral tool result.
 *
 * @public
 */
export type IntelligenceToolOutput = { readonly type: 'tool-result'; readonly output: unknown } | { readonly type: 'tool-error'; readonly error: unknown };
