import { describe, expect, it } from 'vitest';
import { CatchUtils } from './CatchUtils.js';

describe('CatchUtils', () => {
    // #region Methods

    describe('isError', () => {
        it('should return true for Error instances', () => {
            expect(CatchUtils.isError(new Error('test'))).toBe(true);
        });

        it('should return true for objects with a message property', () => {
            expect(CatchUtils.isError({ message: 'error' })).toBe(true);
        });

        it('should return false for non-error values', () => {
            expect(CatchUtils.isError('string')).toBe(false);
            expect(CatchUtils.isError(null)).toBe(false);
            expect(CatchUtils.isError(undefined)).toBe(false);
            expect(CatchUtils.isError(42)).toBe(false);
        });
    });

    describe('catchError', () => {
        it('should return [undefined, data] on resolved promise', async () => {
            const result = await CatchUtils.catchError(Promise.resolve('ok'));
            expect(result).toEqual([undefined, 'ok']);
        });

        it('should return [error] on rejected promise', async () => {
            const error = new Error('fail');
            const result = await CatchUtils.catchError(Promise.reject(error));
            expect(result).toEqual([error]);
        });
    });

    describe('catch', () => {
        it('should invoke handler when input is error-like', () => {
            // arrange
            const error = new Error('test');
            let handlerCalled = false;

            // act
            CatchUtils.catch(error, () => {
                handlerCalled = true;
                return new Error('handled');
            });

            // assert
            expect(handlerCalled).toBe(true);
        });

        it('should not invoke handler for non-error input', () => {
            let handlerCalled = false;

            CatchUtils.catch('not an error', () => {
                handlerCalled = true;
                return new Error('handled');
            });

            expect(handlerCalled).toBe(false);
        });
    });

    // #endregion
});
