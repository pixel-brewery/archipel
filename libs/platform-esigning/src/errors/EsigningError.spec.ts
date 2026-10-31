// #region Imports

import { describe, expect, it } from 'vitest';
import { EsigningError } from './EsigningError.js';

// #endregion

describe('EsigningError', () => {
    // #region Methods

    describe('constructor', () => {
        it('should set the message and code', () => {
            // arrange & act
            const error = new EsigningError('Something went wrong.', 'ESIGNING_FAILURE');

            // assert
            expect(error.message).toBe('Something went wrong.');
            expect(error.code).toBe('ESIGNING_FAILURE');
        });

        it('should set the name to EsigningError', () => {
            // arrange & act
            const error = new EsigningError('msg', 'CODE');

            // assert
            expect(error.name).toBe('EsigningError');
        });

        it('should be an instance of Error', () => {
            // arrange & act
            const error = new EsigningError('msg', 'CODE');

            // assert
            expect(error).toBeInstanceOf(Error);
        });
    });

    // #endregion
});
