// #region Imports

import { describe, expect, it } from 'vitest';
import { CachingHealthIndicator } from './CachingHealthIndicator.js';

// #endregion

// #region Tests

describe('CachingHealthIndicator', () => {
    it('should have key "caching"', () => {
        // arrange
        const indicator = new CachingHealthIndicator();

        // assert
        expect(indicator.key).toBe('caching');
    });

    it('should return status up', () => {
        // arrange
        const indicator = new CachingHealthIndicator();

        // act
        const result = indicator.check();

        // assert
        expect(result).toEqual({ caching: { status: 'up' } });
    });
});

// #endregion
