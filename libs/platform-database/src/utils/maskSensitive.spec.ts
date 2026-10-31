import { describe, expect, it } from 'vitest';
import { maskSensitive } from './maskSensitive.js';

describe('maskSensitive', () => {
    // #region Methods

    it('should mask password and email fields', () => {
        // arrange
        const input = { email: 'user@test.com', password: 'secret123' };

        // act
        const result = maskSensitive(input);

        // assert
        expect(result).toContain('"email":"***"');
        expect(result).toContain('"password":"***"');
        expect(result).not.toContain('secret123');
        expect(result).not.toContain('user@test.com');
    });

    it('should mask token fields', () => {
        // arrange
        const input = { id: '1', token: 'abc-def-ghi' };

        // act
        const result = maskSensitive(input);

        // assert
        expect(result).toContain('"token":"***"');
        expect(result).not.toContain('abc-def-ghi');
    });

    it('should mask nested sensitive fields', () => {
        // arrange
        const input = { where: { email: 'test@test.com' }, data: { password: 'pass', name: 'User' } };

        // act
        const result = maskSensitive(input);

        // assert
        expect(result).toContain('"password":"***"');
        expect(result).toContain('"email":"***"');
        expect(result).toContain('"name":"User"');
        expect(result).not.toContain('test@test.com');
    });

    it('should not mask non-sensitive fields', () => {
        // arrange
        const input = { id: '1', name: 'Test', description: 'Some text' };

        // act
        const result = maskSensitive(input);

        // assert
        expect(result).toContain('"id":"1"');
        expect(result).toContain('"name":"Test"');
        expect(result).toContain('"description":"Some text"');
    });

    it('should handle null and undefined values', () => {
        // act & assert
        expect(maskSensitive(null)).toBe('null');
        expect(maskSensitive(undefined)).toBe(undefined);
    });

    it('should mask case-insensitively', () => {
        // arrange
        const input = { Password: 'secret', TOKEN: 'abc' };

        // act
        const result = maskSensitive(input);

        // assert
        expect(result).toContain('"Password":"***"');
        expect(result).not.toContain('secret');
    });

    // #endregion
});
