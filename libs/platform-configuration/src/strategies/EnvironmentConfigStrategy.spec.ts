// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigKeyNotFoundError } from '../errors/ConfigKeyNotFoundError.js';
import { EnvironmentConfigStrategy } from './EnvironmentConfigStrategy.js';

// #endregion

// #region Tests

describe('EnvironmentConfigStrategy', () => {
    let strategy: EnvironmentConfigStrategy;
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        strategy = new EnvironmentConfigStrategy();
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.restoreAllMocks();
    });

    describe('initialize', () => {
        it('should capture process.env', () => {
            // arrange
            process.env['TEST_KEY'] = 'test-value';

            // act
            strategy.initialize();

            // assert
            expect(strategy.resolve('TEST_KEY')).toBe('test-value');
        });
    });

    describe('resolve', () => {
        it('should return the value when key exists', () => {
            // arrange
            process.env['DB_HOST'] = 'localhost';
            strategy.initialize();

            // act
            const result = strategy.resolve<string>('DB_HOST');

            // assert
            expect(result).toBe('localhost');
        });

        it('should throw ConfigKeyNotFoundError when key is missing', () => {
            // arrange
            strategy.initialize();

            // act & assert
            expect(() => strategy.resolve('MISSING_KEY')).toThrow(ConfigKeyNotFoundError);
            expect(() => strategy.resolve('MISSING_KEY')).toThrow('Config key: MISSING_KEY not found in process.env');
        });
    });

    describe('tryResolve', () => {
        it('should return the value when key exists', () => {
            // arrange
            process.env['PORT'] = '3000';
            strategy.initialize();

            // act
            const result = strategy.tryResolve<string>('PORT', '8080');

            // assert
            expect(result).toBe('3000');
        });

        it('should return the fallback when key is missing', () => {
            // arrange
            strategy.initialize();

            // act
            const result = strategy.tryResolve<string>('MISSING_KEY', 'default');

            // assert
            expect(result).toBe('default');
        });
    });

    describe('has', () => {
        it('should return true when key exists', () => {
            // arrange
            process.env['EXISTS'] = 'yes';
            strategy.initialize();

            // act & assert
            expect(strategy.has('EXISTS')).toBe(true);
        });

        it('should return false when key does not exist', () => {
            // arrange
            strategy.initialize();

            // act & assert
            expect(strategy.has('DOES_NOT_EXIST')).toBe(false);
        });
    });
});

// #endregion
