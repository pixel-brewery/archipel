import { describe, expect, it } from 'vitest';
import { BooleanUtils } from './BooleanUtils.js';

describe('BooleanUtils', () => {
    // #region Methods

    describe('parseBoolean', () => {
        it('should return boolean values as-is', () => {
            expect(BooleanUtils.parseBoolean(true)).toBe(true);
            expect(BooleanUtils.parseBoolean(false)).toBe(false);
        });

        it('should parse truthy strings', () => {
            expect(BooleanUtils.parseBoolean('true')).toBe(true);
            expect(BooleanUtils.parseBoolean('yes')).toBe(true);
            expect(BooleanUtils.parseBoolean('1')).toBe(true);
            expect(BooleanUtils.parseBoolean('y')).toBe(true);
            expect(BooleanUtils.parseBoolean('TRUE')).toBe(true);
            expect(BooleanUtils.parseBoolean('YES')).toBe(true);
        });

        it('should parse falsy strings', () => {
            expect(BooleanUtils.parseBoolean('false')).toBe(false);
            expect(BooleanUtils.parseBoolean('no')).toBe(false);
            expect(BooleanUtils.parseBoolean('0')).toBe(false);
            expect(BooleanUtils.parseBoolean('n')).toBe(false);
            expect(BooleanUtils.parseBoolean('FALSE')).toBe(false);
        });

        it('should throw on invalid string', () => {
            expect(() => BooleanUtils.parseBoolean('maybe')).toThrow();
        });

        it('should enforce strict mode', () => {
            expect(BooleanUtils.parseBoolean('true', { strict: true })).toBe(true);
            expect(BooleanUtils.parseBoolean('false', { strict: true })).toBe(false);
            expect(() => BooleanUtils.parseBoolean('yes', { strict: true })).toThrow('Strict mode');
        });
    });

    describe('formatBoolean', () => {
        it('should format with default labels', () => {
            expect(BooleanUtils.formatBoolean(true)).toBe('true');
            expect(BooleanUtils.formatBoolean(false)).toBe('false');
        });

        it('should format with custom labels', () => {
            expect(BooleanUtils.formatBoolean(true, 'on', 'off')).toBe('on');
            expect(BooleanUtils.formatBoolean(false, 'on', 'off')).toBe('off');
        });
    });

    // #endregion
});
