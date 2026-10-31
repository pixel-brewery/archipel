// #region Imports

import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { NODE_CRYPTO_PLUGIN } from './NodeCryptoPlugin.js';

// #endregion

describe('NODE_CRYPTO_PLUGIN', () => {
    // #region Methods

    describe('name', () => {
        it('should have the correct plugin name', () => {
            // Assert
            expect(NODE_CRYPTO_PLUGIN.name).toBe('node');
        });
    });

    describe('hmac()', () => {
        it('should compute SHA-1 HMAC correctly', () => {
            // Arrange
            const key = new TextEncoder().encode('secret');
            const data = new TextEncoder().encode('message');

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha1', key, data);

            // Assert
            const expected = createHmac('sha1', Buffer.from(key)).update(Buffer.from(data)).digest();
            expect(Buffer.from(result).equals(expected)).toBe(true);
        });

        it('should compute SHA-256 HMAC correctly', () => {
            // Arrange
            const key = new TextEncoder().encode('secret');
            const data = new TextEncoder().encode('message');

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha256', key, data);

            // Assert
            const expected = createHmac('sha256', Buffer.from(key)).update(Buffer.from(data)).digest();
            expect(Buffer.from(result).equals(expected)).toBe(true);
        });

        it('should compute SHA-512 HMAC correctly', () => {
            // Arrange
            const key = new TextEncoder().encode('secret');
            const data = new TextEncoder().encode('message');

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha512', key, data);

            // Assert
            const expected = createHmac('sha512', Buffer.from(key)).update(Buffer.from(data)).digest();
            expect(Buffer.from(result).equals(expected)).toBe(true);
        });

        it('should return 20 bytes for SHA-1', () => {
            // Arrange
            const key = new Uint8Array(20).fill(0xaa);
            const data = new Uint8Array(8).fill(0x00);

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha1', key, data);

            // Assert
            expect(result.length).toBe(20);
        });

        it('should return 32 bytes for SHA-256', () => {
            // Arrange
            const key = new Uint8Array(32).fill(0xaa);
            const data = new Uint8Array(8).fill(0x00);

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha256', key, data);

            // Assert
            expect(result.length).toBe(32);
        });

        it('should return 64 bytes for SHA-512', () => {
            // Arrange
            const key = new Uint8Array(64).fill(0xaa);
            const data = new Uint8Array(8).fill(0x00);

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha512', key, data);

            // Assert
            expect(result.length).toBe(64);
        });

        it('should handle empty data', () => {
            // Arrange
            const key = new TextEncoder().encode('secret');
            const data = new Uint8Array(0);

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha1', key, data);

            // Assert
            expect(result.length).toBe(20);
        });

        it('should handle empty key', () => {
            // Arrange
            const key = new Uint8Array(0);
            const data = new TextEncoder().encode('message');

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha1', key, data);

            // Assert
            expect(result.length).toBe(20);
        });

        it('should produce deterministic HMAC for known input', () => {
            // Arrange
            const key = new TextEncoder().encode('12345678901234567890');
            const counter = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);

            // Act
            const result1 = NODE_CRYPTO_PLUGIN.hmac('sha1', key, counter);
            const result2 = NODE_CRYPTO_PLUGIN.hmac('sha1', key, counter);

            // Assert - Same input produces same output
            expect(Buffer.from(result1).equals(Buffer.from(result2))).toBe(true);
            expect(result1.length).toBe(20);
        });

        it('should return Uint8Array type', () => {
            // Arrange
            const key = new Uint8Array(20);
            const data = new Uint8Array(8);

            // Act
            const result = NODE_CRYPTO_PLUGIN.hmac('sha1', key, data);

            // Assert
            expect(result).toBeInstanceOf(Uint8Array);
        });
    });

    describe('randomBytes()', () => {
        it('should return the requested number of bytes', () => {
            // Act
            const result = NODE_CRYPTO_PLUGIN.randomBytes(20);

            // Assert
            expect(result.length).toBe(20);
        });

        it('should return Uint8Array type', () => {
            // Act
            const result = NODE_CRYPTO_PLUGIN.randomBytes(16);

            // Assert
            expect(result).toBeInstanceOf(Uint8Array);
        });

        it('should return different values on subsequent calls', () => {
            // Act
            const result1 = NODE_CRYPTO_PLUGIN.randomBytes(32);
            const result2 = NODE_CRYPTO_PLUGIN.randomBytes(32);

            // Assert
            expect(result1).not.toEqual(result2);
        });

        it('should handle zero-length request', () => {
            // Act
            const result = NODE_CRYPTO_PLUGIN.randomBytes(0);

            // Assert
            expect(result.length).toBe(0);
        });

        it('should handle large byte requests', () => {
            // Act
            const result = NODE_CRYPTO_PLUGIN.randomBytes(1024);

            // Assert
            expect(result.length).toBe(1024);
        });

        it('should produce cryptographically random values (entropy check)', () => {
            // Arrange
            const samples = 1000;
            const counts = new Map<number, number>();

            // Act
            for (let i = 0; i < samples; i++) {
                const byte = NODE_CRYPTO_PLUGIN.randomBytes(1)[0];
                counts.set(byte, (counts.get(byte) ?? 0) + 1);
            }

            // Assert - With 1000 samples, we should see reasonable distribution
            // Each byte value should appear roughly 1000/256 ≈ 4 times
            // Allow wide tolerance since this is probabilistic
            expect(counts.size).toBeGreaterThan(100); // Should see many different values
        });
    });

    describe('constantTimeEqual()', () => {
        it('should return true for equal strings', () => {
            // Arrange
            const left = '123456';
            const right = '123456';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for different strings', () => {
            // Arrange
            const left = '123456';
            const right = '654321';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(false);
        });

        it('should return true for equal Uint8Arrays', () => {
            // Arrange
            const left = new Uint8Array([1, 2, 3, 4, 5]);
            const right = new Uint8Array([1, 2, 3, 4, 5]);

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for different Uint8Arrays', () => {
            // Arrange
            const left = new Uint8Array([1, 2, 3, 4, 5]);
            const right = new Uint8Array([5, 4, 3, 2, 1]);

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false for different length strings', () => {
            // Arrange
            const left = '12345';
            const right = '123456';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false for different length Uint8Arrays', () => {
            // Arrange
            const left = new Uint8Array([1, 2, 3]);
            const right = new Uint8Array([1, 2, 3, 4]);

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(false);
        });

        it('should handle empty strings', () => {
            // Arrange
            const left = '';
            const right = '';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(true);
        });

        it('should handle empty Uint8Arrays', () => {
            // Arrange
            const left = new Uint8Array(0);
            const right = new Uint8Array(0);

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for empty vs non-empty', () => {
            // Arrange
            const left = '';
            const right = 'a';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(false);
        });

        it('should handle mixed string and Uint8Array comparison', () => {
            // Arrange
            const left = 'abc';
            const right = new Uint8Array([97, 98, 99]); // 'abc' in UTF-8

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for strings differing in last character', () => {
            // Arrange
            const left = '123456';
            const right = '123457';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false for strings differing in first character', () => {
            // Arrange
            const left = '123456';
            const right = '023456';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(left, right);

            // Assert
            expect(result).toBe(false);
        });

        it('should handle typical OTP token comparison', () => {
            // Arrange
            const generated = '284759';
            const provided = '284759';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(generated, provided);

            // Assert
            expect(result).toBe(true);
        });

        it('should reject incorrect OTP token', () => {
            // Arrange
            const generated = '284759';
            const provided = '284758';

            // Act
            const result = NODE_CRYPTO_PLUGIN.constantTimeEqual(generated, provided);

            // Assert
            expect(result).toBe(false);
        });
    });

    // #endregion
});
