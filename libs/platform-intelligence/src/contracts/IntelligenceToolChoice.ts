/**
 * Provider-neutral tool-selection policy.
 *
 * @public
 */
export type IntelligenceToolChoice = 'auto' | 'none' | 'required' | { readonly type: 'tool'; readonly toolName: string };
