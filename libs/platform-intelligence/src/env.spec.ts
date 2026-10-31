// #region Imports

import { describe, expect, it } from 'vitest';
import {
    INTELLIGENCE_API_KEY,
    INTELLIGENCE_BASE_URL,
    INTELLIGENCE_MAX_OUTPUT_TOKENS,
    INTELLIGENCE_MODEL,
    INTELLIGENCE_PROVIDER,
    INTELLIGENCE_TEMPERATURE,
    INTELLIGENCE_TOP_P,
    PLATFORM_INTELLIGENCE_CONFIG_ENTRIES,
} from './env.js';

// #endregion

// #region Tests

describe('platform-intelligence env', () => {
    it('should expose all config keys with correct key strings', () => {
        // arrange
        const expected = [
            'INTELLIGENCE_MODEL',
            'INTELLIGENCE_TEMPERATURE',
            'INTELLIGENCE_TOP_P',
            'INTELLIGENCE_MAX_OUTPUT_TOKENS',
            'INTELLIGENCE_PROVIDER',
            'INTELLIGENCE_API_KEY',
            'INTELLIGENCE_BASE_URL',
        ];

        // act
        const keys = [
            INTELLIGENCE_MODEL,
            INTELLIGENCE_TEMPERATURE,
            INTELLIGENCE_TOP_P,
            INTELLIGENCE_MAX_OUTPUT_TOKENS,
            INTELLIGENCE_PROVIDER,
            INTELLIGENCE_API_KEY,
            INTELLIGENCE_BASE_URL,
        ].map((key) => key.key);

        // assert
        expect(keys).toEqual(expected);
    });

    it('should keep the core config registry provider-neutral', () => {
        // arrange

        // act
        const keys = PLATFORM_INTELLIGENCE_CONFIG_ENTRIES.map((entry) => entry.key.key);

        // assert
        expect(keys).toHaveLength(7);
        expect(keys).not.toContain('OPENAI_API_KEY');
    });

    it('should mark all config entries as not required', () => {
        // arrange

        // act
        const requirements = PLATFORM_INTELLIGENCE_CONFIG_ENTRIES.map((entry) => entry.required);

        // assert
        expect(requirements).toEqual(Array.from({ length: 7 }, () => false));
    });

    it('should include a description for every config entry', () => {
        // arrange

        // act
        const descriptions = PLATFORM_INTELLIGENCE_CONFIG_ENTRIES.map((entry) => entry.description);

        // assert
        expect(descriptions.every(Boolean)).toBe(true);
    });

    it('should provide default values for temperature, top_p, and max_output_tokens', () => {
        // arrange
        const keys = ['INTELLIGENCE_TEMPERATURE', 'INTELLIGENCE_TOP_P', 'INTELLIGENCE_MAX_OUTPUT_TOKENS'] as const;

        // act
        const defaults = keys.map((key) => getConfigEntry(key).defaultValue);

        // assert
        expect(defaults).toEqual([0.7, 1, 1_024]);
    });
});

// #endregion

function getConfigEntry(key: string): (typeof PLATFORM_INTELLIGENCE_CONFIG_ENTRIES)[number] {
    const entry = PLATFORM_INTELLIGENCE_CONFIG_ENTRIES.find((configEntry) => configEntry.key.key === key);

    if (!entry) {
        throw new Error(`Missing config entry: ${key}`);
    }

    return entry;
}
