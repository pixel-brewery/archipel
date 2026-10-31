// #region Imports

import { describe, expect, it } from 'vitest';
import { ConfigKeyNotFoundError } from './ConfigKeyNotFoundError.js';

// #endregion

// #region Tests

describe('ConfigKeyNotFoundError', () => {
    it('should set the message with key and source', () => {
        // act
        const error = new ConfigKeyNotFoundError('DATABASE_URL', 'process.env');

        // assert
        expect(error.message).toBe('Config key: DATABASE_URL not found in process.env');
    });

    it('should have name "ConfigKeyNotFoundError"', () => {
        // act
        const error = new ConfigKeyNotFoundError('KEY', 'source');

        // assert
        expect(error.name).toBe('ConfigKeyNotFoundError');
    });

    it('should have code "CONFIG_KEY_NOT_FOUND"', () => {
        // act
        const error = new ConfigKeyNotFoundError('KEY', 'source');

        // assert
        expect(error.code).toBe('CONFIG_KEY_NOT_FOUND');
    });

    it('should expose the key via getter', () => {
        // act
        const error = new ConfigKeyNotFoundError('MY_KEY', 'process.env');

        // assert
        expect(error.key).toBe('MY_KEY');
    });

    it('should expose the source via getter', () => {
        // act
        const error = new ConfigKeyNotFoundError('MY_KEY', 'env file: .env');

        // assert
        expect(error.source).toBe('env file: .env');
    });

    it('should be an instance of Error', () => {
        // act
        const error = new ConfigKeyNotFoundError('KEY', 'source');

        // assert
        expect(error).toBeInstanceOf(Error);
    });
});

// #endregion
