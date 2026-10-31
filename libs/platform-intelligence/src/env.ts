// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Intelligence (AI/LLM)
// ──────────────────────────────────────────────────────────────

/** AI model identifier to use for text generation. */
export const INTELLIGENCE_MODEL = createConfigKey<string>('INTELLIGENCE_MODEL');

/** Sampling temperature for the AI model. */
export const INTELLIGENCE_TEMPERATURE = createConfigKey<number>('INTELLIGENCE_TEMPERATURE');

/** Top-p (nucleus sampling) for the AI model. */
export const INTELLIGENCE_TOP_P = createConfigKey<number>('INTELLIGENCE_TOP_P');

/** Maximum number of output tokens for the AI model. */
export const INTELLIGENCE_MAX_OUTPUT_TOKENS = createConfigKey<number>('INTELLIGENCE_MAX_OUTPUT_TOKENS');

/** Intelligence provider name (e.g. openai, anthropic, google, grok, mimo, gateway). */
export const INTELLIGENCE_PROVIDER = createConfigKey<string>('INTELLIGENCE_PROVIDER');

/** Global API key override for the intelligence provider. */
export const INTELLIGENCE_API_KEY = createConfigKey<string>('INTELLIGENCE_API_KEY');

/** Global base URL override for the intelligence provider. */
export const INTELLIGENCE_BASE_URL = createConfigKey<string>('INTELLIGENCE_BASE_URL');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Provider-neutral configuration entries required by `platform-intelligence`. */
export const PLATFORM_INTELLIGENCE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: INTELLIGENCE_PROVIDER,
        required: false,
        defaultValue: 'openai',
        description: 'Intelligence provider name: openai, anthropic, google, grok, mimo, gateway, or a registered custom provider.',
    },
    { key: INTELLIGENCE_MODEL, required: false, description: 'AI model identifier for text generation.' },
    { key: INTELLIGENCE_API_KEY, required: false, description: 'Global API key override for the configured intelligence provider.' },
    { key: INTELLIGENCE_BASE_URL, required: false, description: 'Global base URL override for the configured intelligence provider.' },
    {
        key: INTELLIGENCE_TEMPERATURE,
        required: false,
        defaultValue: 0.7,
        description: 'Sampling temperature for the AI model.',
    },
    {
        key: INTELLIGENCE_TOP_P,
        required: false,
        defaultValue: 1,
        description: 'Top-p (nucleus sampling) for the AI model.',
    },
    {
        key: INTELLIGENCE_MAX_OUTPUT_TOKENS,
        required: false,
        defaultValue: 1024,
        description: 'Maximum number of output tokens for the AI model.',
    },
];
