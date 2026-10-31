import { describe, expect, it } from 'vitest';
import { FeatureFlagError } from './FeatureFlagError.js';

describe('FeatureFlagError', () => {
    // #region Methods

    describe('constructor', () => {
        it('should set provider and message', () => {
            // arrange
            const provider = 'azure';
            const message = 'Connection failed';

            // act
            const error = new FeatureFlagError(provider, message);

            // assert
            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe('FeatureFlagError');
            expect(error.provider).toBe('azure');
            expect(error.message).toBe('Connection failed');
            expect(error.code).toBe('FEATURE_FLAG');
        });

        it('should set the cause when provided', () => {
            // arrange
            const cause = new Error('underlying network error');

            // act
            const error = new FeatureFlagError('vercel', 'init failed', cause);

            // assert
            expect(error.cause).toBe(cause);
        });

        it('should leave cause undefined when not provided', () => {
            // arrange — nothing to arrange

            // act
            const error = new FeatureFlagError('azure', 'timeout');

            // assert
            expect(error.cause).toBeUndefined();
        });
    });

    describe('instanceof', () => {
        it('should be caught by Error catch clauses', () => {
            // arrange
            const error = new FeatureFlagError('azure', 'test');
            let caught = false;

            // act
            try {
                throw error;
            } catch (e: unknown) {
                if (e instanceof Error) {
                    caught = true;
                }
            }

            // assert
            expect(caught).toBe(true);
        });
    });

    // #endregion
});
