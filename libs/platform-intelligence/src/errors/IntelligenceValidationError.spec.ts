// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { IntelligenceValidationError } from './IntelligenceValidationError.js';
import { IntelligenceValidationStages } from './IntelligenceValidationStages.js';

// #endregion

// #region Tests

describe('IntelligenceValidationError', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should set name to IntelligenceValidationError', () => {
        // arrange / act
        const error = new IntelligenceValidationError('empty prompt');

        // assert
        expect(error.name).toBe('IntelligenceValidationError');
    });

    it('should set code to INTELLIGENCE_VALIDATION', () => {
        // arrange / act
        const error = new IntelligenceValidationError('empty prompt');

        // assert
        expect(error.code).toBe('INTELLIGENCE_VALIDATION');
    });

    it('should set message from constructor', () => {
        // arrange / act
        const error = new IntelligenceValidationError('Prompt must not be empty');

        // assert
        expect(error.message).toBe('Prompt must not be empty');
    });

    it('should be an instance of Error', () => {
        // arrange / act
        const error = new IntelligenceValidationError('test');

        // assert
        expect(error).toBeInstanceOf(Error);
    });

    it('should treat a validation failure as an invalid request unless the stage says otherwise', () => {
        // arrange / act
        const error = new IntelligenceValidationError('Temperature must be between 0 and 2.');

        // assert
        expect(error.stage).toBe(IntelligenceValidationStages.Input);
    });

    it('should mark a provider answer that violates the output contract as an output failure', () => {
        // arrange / act
        const error = new IntelligenceValidationError('Output for prompt "summary" validation failed', IntelligenceValidationStages.Output);

        // assert
        expect(error.stage).toBe(IntelligenceValidationStages.Output);
    });
});

// #endregion
