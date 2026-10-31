import { describe, it, expect } from 'vitest';
import { NormalizedUtils } from './NormalizedUtils.js';

describe('NormalizedUtils', () => {
    // #region Methods

    describe('normalizeString', () => {
        it('should trim and lowercase a string', () => {
            expect(NormalizedUtils.normalizeString('  Hello World  ')).toBe('hello world');
        });

        it('should return undefined for undefined input', () => {
            expect(NormalizedUtils.normalizeString(undefined)).toBeUndefined();
        });
    });

    describe('normalizeArray', () => {
        it('should remove duplicates from an array', () => {
            expect(NormalizedUtils.normalizeArray([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
        });

        it('should return undefined for undefined input', () => {
            expect(NormalizedUtils.normalizeArray(undefined)).toBeUndefined();
        });
    });

    describe('normalizeNumber', () => {
        it('should clamp negative numbers to zero', () => {
            expect(NormalizedUtils.normalizeNumber(-5)).toBe(0);
        });

        it('should leave positive numbers unchanged', () => {
            expect(NormalizedUtils.normalizeNumber(42)).toBe(42);
        });

        it('should return undefined for undefined input', () => {
            expect(NormalizedUtils.normalizeNumber(undefined)).toBeUndefined();
        });
    });

    describe('normalizeDate', () => {
        it('should return a new Date instance', () => {
            // arrange
            const original = new Date('2024-01-15');

            // act
            const result = NormalizedUtils.normalizeDate(original);

            // assert
            expect(result).toEqual(original);
            expect(result).not.toBe(original);
        });

        it('should return undefined for undefined input', () => {
            expect(NormalizedUtils.normalizeDate(undefined)).toBeUndefined();
        });
    });

    describe('normalizeBoolean', () => {
        it('should return the boolean value', () => {
            expect(NormalizedUtils.normalizeBoolean(true)).toBe(true);
            expect(NormalizedUtils.normalizeBoolean(false)).toBe(false);
        });

        it('should return undefined for undefined input', () => {
            expect(NormalizedUtils.normalizeBoolean(undefined)).toBeUndefined();
        });
    });

    // #endregion
});
