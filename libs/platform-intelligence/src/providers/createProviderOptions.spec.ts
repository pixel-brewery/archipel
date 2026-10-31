// #region Imports

import { describe, expect, it } from 'vitest';
import type { IIntelligenceProviderConfiguration } from '../contracts/IIntelligenceProviderConfiguration.js';
import { createProviderOptions } from './createProviderOptions.js';

// #endregion

describe('createProviderOptions', () => {
    // #region Helpers

    function createConfiguration(overrides: Partial<IIntelligenceProviderConfiguration> = {}): IIntelligenceProviderConfiguration {
        return {
            provider: 'openai',
            model: 'gpt-4o-mini',
            apiKey: 'test-api-key',
            baseUrl: null,
            temperature: 0.7,
            topP: 1,
            maxOutputTokens: 1024,
            ...overrides,
        };
    }

    // #endregion

    // #region Tests

    it('should include apiKey in the returned options', () => {
        // arrange
        const configuration = createConfiguration({ apiKey: 'sk-secret' });

        // act
        const result = createProviderOptions(configuration);

        // assert
        expect(result['apiKey']).toBe('sk-secret');
    });

    it('should include baseURL when baseUrl is provided', () => {
        // arrange
        const configuration = createConfiguration({ baseUrl: 'https://custom.api.com/v1' });

        // act
        const result = createProviderOptions(configuration);

        // assert
        expect(result['baseURL']).toBe('https://custom.api.com/v1');
    });

    it('should omit baseURL when baseUrl is null', () => {
        // arrange
        const configuration = createConfiguration({ baseUrl: null });

        // act
        const result = createProviderOptions(configuration);

        // assert
        expect(result).not.toHaveProperty('baseURL');
    });

    it('should omit apiKey when ambient provider authentication is used', () => {
        const configuration = createConfiguration({ apiKey: null });

        expect(createProviderOptions(configuration)).toEqual({});
    });

    it('should only contain apiKey when no baseUrl is provided', () => {
        // arrange
        const configuration = createConfiguration({ baseUrl: null });

        // act
        const result = createProviderOptions(configuration);

        // assert
        expect(Object.keys(result)).toEqual(['apiKey']);
    });

    // #endregion
});
