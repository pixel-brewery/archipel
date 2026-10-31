import { describe, expect, it } from 'vitest';
import { DateTimeUtils, type StringValue } from './DateTimeUtils.js';

describe('DateTimeUtils', () => {
    // #region Methods

    describe('parse', () => {
        it('should parse seconds', () => {
            expect(DateTimeUtils.parse('5s')).toBe(5000);
        });

        it('should parse minutes', () => {
            expect(DateTimeUtils.parse('2m')).toBe(120000);
        });

        it('should parse hours', () => {
            expect(DateTimeUtils.parse('1h')).toBe(3600000);
        });

        it('should parse days', () => {
            expect(DateTimeUtils.parse('1d')).toBe(86400000);
        });

        it('should parse weeks', () => {
            expect(DateTimeUtils.parse('1w')).toBe(604800000);
        });

        it('should parse milliseconds', () => {
            expect(DateTimeUtils.parse('100ms')).toBe(100);
        });

        it('should parse bare numbers as milliseconds', () => {
            expect(DateTimeUtils.parse('500' as StringValue)).toBe(500);
        });

        it('should return NaN for invalid string', () => {
            expect(DateTimeUtils.parse('invalid' as StringValue)).toBeNaN();
        });

        it('should throw for empty string', () => {
            expect(() => DateTimeUtils.parse('' as StringValue)).toThrow();
        });
    });

    describe('format', () => {
        it('should format short', () => {
            expect(DateTimeUtils.format(3600000)).toBe('1h');
            expect(DateTimeUtils.format(86400000)).toBe('1d');
            expect(DateTimeUtils.format(60000)).toBe('1m');
            expect(DateTimeUtils.format(1000)).toBe('1s');
            expect(DateTimeUtils.format(500)).toBe('500ms');
        });

        it('should format long', () => {
            expect(DateTimeUtils.format(3600000, { long: true })).toBe('1 hour');
            expect(DateTimeUtils.format(7200000, { long: true })).toBe('2 hours');
        });

        it('should throw for non-finite numbers', () => {
            expect(() => DateTimeUtils.format(Infinity)).toThrow();
        });
    });

    describe('convert', () => {
        it('should parse strings to milliseconds', () => {
            expect(DateTimeUtils.convert('1h')).toBe(3600000);
        });

        it('should format numbers to strings', () => {
            expect(DateTimeUtils.convert(3600000)).toBe('1h');
        });
    });

    // #endregion
});
