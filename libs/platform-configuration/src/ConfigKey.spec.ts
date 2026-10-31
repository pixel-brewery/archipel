// #region Imports

import { describe, expect, it } from 'vitest';
import { createConfigKey, type IConfigKey } from './ConfigKey.js';

// #endregion

// #region Tests

describe('createConfigKey', () => {
    it('should return an object with the correct key property', () => {
        // act
        const configKey = createConfigKey<string>('DATABASE_URL');

        // assert
        expect(configKey.key).toBe('DATABASE_URL');
    });

    it('should produce a minimal object with only the key property', () => {
        // act
        const configKey = createConfigKey<number>('TIMEOUT_MS');

        // assert
        expect(Object.keys(configKey)).toEqual(['key']);
    });

    it('should create distinct instances for different keys', () => {
        // act
        const keyA = createConfigKey<string>('KEY_A');
        const keyB = createConfigKey<string>('KEY_B');

        // assert
        expect(keyA).not.toBe(keyB);
        expect(keyA.key).not.toBe(keyB.key);
    });

    it('should satisfy the IConfigKey interface', () => {
        // act
        const configKey: IConfigKey<boolean> = createConfigKey<boolean>('FEATURE_ENABLED');

        // assert
        expect(configKey.key).toBe('FEATURE_ENABLED');
    });
});

// #endregion
