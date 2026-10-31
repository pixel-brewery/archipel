/**
 * Identifies which side of a provider call failed validation.
 *
 * @public
 */
export const IntelligenceValidationStages = {
    /** The request, prompt, options or tool configuration was invalid before any provider call. */
    Input: 'input',
    /** The provider answered, but its answer violated the output contract. */
    Output: 'output',
} as const;
