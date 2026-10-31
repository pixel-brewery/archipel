// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { skip } from './Skip.js';

// #endregion

// #region Tests

describe('skip', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return undefined when the value is undefined', () => {
        // arrange / act
        const result = skip(undefined);

        // assert
        expect(result).toBeUndefined();
    });

    it('should return the value when it is a non-empty string', () => {
        // arrange / act
        const result = skip('hello');

        // assert
        expect(result).toBe('hello');
    });

    it('should return null when the value is null', () => {
        // arrange / act
        const result = skip(null);

        // assert
        expect(result).toBeNull();
    });

    it('should return 0 when the value is 0', () => {
        // arrange / act
        const result = skip(0);

        // assert
        expect(result).toBe(0);
    });

    it('should return false when the value is false', () => {
        // arrange / act
        const result = skip(false);

        // assert
        expect(result).toBe(false);
    });

    it('should return an empty string when the value is an empty string', () => {
        // arrange / act
        const result = skip('');

        // assert
        expect(result).toBe('');
    });
});

// #endregion
