// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMappingKey } from './MappingKey.js';

// #endregion

// #region Tests

describe('MappingKey', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create a key with the MappingKey brand', () => {
        // arrange / act
        const key = createMappingKey<string, number>('test.key');

        // assert
        expect(key._brand).toBe('MappingKey');
    });

    it('should store the string key', () => {
        // arrange / act
        const key = createMappingKey<string, number>('my.mapping');

        // assert
        expect(key.key).toBe('my.mapping');
    });

    it('should have undefined phantom type fields', () => {
        // arrange / act
        const key = createMappingKey<string, number>('phantom');

        // assert
        expect(key._input).toBeUndefined();
        expect(key._output).toBeUndefined();
    });
});

// #endregion
