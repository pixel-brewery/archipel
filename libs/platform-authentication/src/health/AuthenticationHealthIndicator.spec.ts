// #region Imports

import { describe, expect, it } from 'vitest';

import { AuthenticationHealthIndicator } from './AuthenticationHealthIndicator.js';

// #endregion

// #region Tests

describe('AuthenticationHealthIndicator', () => {
    it('should have "authentication" as key', () => {
        // arrange
        const indicator = new AuthenticationHealthIndicator();

        // assert
        expect(indicator.key).toBe('authentication');
    });

    it('should return status up', () => {
        // arrange
        const indicator = new AuthenticationHealthIndicator();

        // act
        const result = indicator.check();

        // assert
        expect(result).toEqual({
            authentication: { status: 'up' },
        });
    });
});

// #endregion
