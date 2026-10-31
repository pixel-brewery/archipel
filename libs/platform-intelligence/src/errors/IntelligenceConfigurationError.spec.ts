// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceConfigurationError } from './IntelligenceConfigurationError.js';

// #endregion

// #region Tests

describe('IntelligenceConfigurationError', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should set name to IntelligenceConfigurationError', () => {
        // arrange / act
        const error = new IntelligenceConfigurationError('missing key');

        // assert
        expect(error.name).toBe('IntelligenceConfigurationError');
    });

    it('should set code to INTELLIGENCE_CONFIGURATION', () => {
        // arrange / act
        const error = new IntelligenceConfigurationError('missing key');

        // assert
        expect(error.code).toBe('INTELLIGENCE_CONFIGURATION');
    });

    it('should set message from constructor', () => {
        // arrange / act
        const error = new IntelligenceConfigurationError('API key is missing');

        // assert
        expect(error.message).toBe('API key is missing');
    });

    it('should be an instance of Error', () => {
        // arrange / act
        const error = new IntelligenceConfigurationError('test');

        // assert
        expect(error).toBeInstanceOf(Error);
    });
});

// #endregion
