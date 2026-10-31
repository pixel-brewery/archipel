// #region Imports

import { describe, expect, it } from 'vitest';
import { maskSensitive, maskSensitiveFields } from './MaskSensitiveUtils.js';

// #endregion

// #region Tests

describe('MaskSensitiveUtils', () => {
    describe('maskSensitiveFields', () => {
        it('should mask password fields', () => {
            // arrange
            const input = { username: 'john', password: 'secret123' };

            // act
            const result = maskSensitiveFields(input);

            // assert
            expect(result).toEqual({ username: 'john', password: '***' });
        });

        it('should mask token fields', () => {
            // arrange
            const input = { token: 'abc123', data: 'safe' };

            // act
            const result = maskSensitiveFields(input);

            // assert
            expect(result).toEqual({ token: '***', data: 'safe' });
        });

        it('should mask email fields', () => {
            // arrange
            const input = { email: 'user@example.com', name: 'John' };

            // act
            const result = maskSensitiveFields(input);

            // assert
            expect(result).toEqual({ email: '***', name: 'John' });
        });

        it('should mask fields case-insensitively', () => {
            // arrange
            const input = { Password: 'secret', ApiKey: 'key123' };

            // act
            const result = maskSensitiveFields(input);

            // assert
            expect(result).toEqual({ Password: '***', ApiKey: '***' });
        });

        it('should recursively mask nested objects', () => {
            // arrange
            const input = { user: { password: 'secret', name: 'John' } };

            // act
            const result = maskSensitiveFields(input);

            // assert
            expect(result).toEqual({ user: { password: '***', name: 'John' } });
        });

        it('should handle arrays by masking each element', () => {
            // arrange
            const input = [{ password: 'a' }, { password: 'b' }];

            // act
            const result = maskSensitiveFields(input);

            // assert
            expect(result).toEqual([{ password: '***' }, { password: '***' }]);
        });

        it('should return null for null input', () => {
            // act & assert
            expect(maskSensitiveFields(null)).toBeNull();
        });

        it('should return undefined for undefined input', () => {
            // act & assert
            expect(maskSensitiveFields(undefined)).toBeUndefined();
        });

        it('should return primitives unchanged', () => {
            // act & assert
            expect(maskSensitiveFields('hello')).toBe('hello');
            expect(maskSensitiveFields(42)).toBe(42);
            expect(maskSensitiveFields(true)).toBe(true);
        });

        it('should mask all known sensitive keys', () => {
            // arrange
            const input = {
                password: 'a',
                passwordHash: 'b',
                token: 'c',
                accessToken: 'd',
                refreshToken: 'e',
                secret: 'f',
                apiKey: 'g',
                authorization: 'h',
                creditCard: 'i',
                ssn: 'j',
                pin: 'k',
                email: 'l',
            };

            // act
            const result = maskSensitiveFields(input) as Record<string, unknown>;

            // assert
            for (const key of Object.keys(input)) {
                expect(result[key]).toBe('***');
            }
        });
    });

    describe('maskSensitive', () => {
        it('should return a JSON string with sensitive fields masked', () => {
            // arrange
            const input = { username: 'john', password: 'secret' };

            // act
            const result = maskSensitive(input);

            // assert
            expect(result).toBe('{"username":"john","password":"***"}');
        });

        it('should handle primitives', () => {
            // act
            const result = maskSensitive('hello');

            // assert
            expect(result).toBe('"hello"');
        });
    });
});

// #endregion
