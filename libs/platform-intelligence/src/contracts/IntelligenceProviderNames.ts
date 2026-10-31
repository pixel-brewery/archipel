/**
 * Enumerates the supported model providers powering the intelligence pipeline.
 *
 * @public
 */
export const IntelligenceProviderNames = {
    OpenAI: 'openai',
    Anthropic: 'anthropic',
    Google: 'google',
    Grok: 'grok',
    MiMo: 'mimo',
    Gateway: 'gateway',
} as const;
