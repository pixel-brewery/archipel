// #region Imports

import { describe, expect, it } from 'vitest';

import { Token } from './TokenDecorator.js';

// #endregion

// #region Tests

describe('TokenDecorator', () => {
    describe('Token', () => {
        it('should return a decorator function', () => {
            // act
            const decorator = Token();

            // assert
            expect(decorator).toBeDefined();
        });
    });
});

// #endregion
