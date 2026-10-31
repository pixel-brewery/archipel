// #region Imports

import { describe, expect, it } from 'vitest';
import { BASE32_PLUGIN } from './Base32Plugin.js';

// #endregion

describe('BASE32_PLUGIN', () => {
    // #region Fields

    const RFC_4648_TEST_VECTORS = [
        { decoded: '', encoded: '' },
        { decoded: 'f', encoded: 'MY' },
        { decoded: 'fo', encoded: 'MZXQ' },
        { decoded: 'foo', encoded: 'MZXW6' },
        { decoded: 'foob', encoded: 'MZXW6YQ' },
        { decoded: 'fooba', encoded: 'MZXW6YTB' },
        { decoded: 'foobar', encoded: 'MZXW6YTBOI' },
    ];

    // #endregion

    // #region Methods

    describe('name', () => {
        it('should have the correct plugin name', () => {
            // Assert
            expect(BASE32_PLUGIN.name).toBe('archipel-base32');
        });
    });

    describe('encode()', () => {
        it.each(RFC_4648_TEST_VECTORS)('should encode "$decoded" to "$encoded" (RFC 4648)', ({ decoded, encoded }) => {
            // Arrange
            const data = new TextEncoder().encode(decoded);

            // Act
            const result = BASE32_PLUGIN.encode(data);

            // Assert
            expect(result).toBe(encoded);
        });

        it('should encode binary data correctly', () => {
            // Arrange
            const data = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);

            // Act
            const result = BASE32_PLUGIN.encode(data);

            // Assert
            expect(result).toBe('AAAQEAYE');
        });

        it('should encode without padding by default', () => {
            // Arrange
            const data = new TextEncoder().encode('f');

            // Act
            const result = BASE32_PLUGIN.encode(data);

            // Assert
            expect(result).toBe('MY');
            expect(result).not.toContain('=');
        });

        it('should encode with padding when option is set', () => {
            // Arrange
            const data = new TextEncoder().encode('f');

            // Act
            const result = BASE32_PLUGIN.encode(data, { padding: true });

            // Assert
            expect(result).toBe('MY======');
        });

        it('should encode with padding for multi-byte input', () => {
            // Arrange
            const data = new TextEncoder().encode('foo');

            // Act
            const result = BASE32_PLUGIN.encode(data, { padding: true });

            // Assert
            expect(result).toBe('MZXW6===');
        });

        it('should handle empty input', () => {
            // Arrange
            const data = new Uint8Array(0);

            // Act
            const result = BASE32_PLUGIN.encode(data);

            // Assert
            expect(result).toBe('');
        });

        it('should handle single byte input', () => {
            // Arrange
            const data = new Uint8Array([0xff]);

            // Act
            const result = BASE32_PLUGIN.encode(data);

            // Assert
            expect(result).toBe('74');
        });

        it('should handle 20-byte secret (typical OTP secret length)', () => {
            // Arrange
            const data = new Uint8Array(20).fill(0xaa);

            // Act
            const result = BASE32_PLUGIN.encode(data);

            // Assert
            expect(result.length).toBe(32);
            expect(result).toMatch(/^[A-Z2-7]+$/u);
        });
    });

    describe('decode()', () => {
        it.each(RFC_4648_TEST_VECTORS)('should decode "$encoded" to "$decoded" (RFC 4648)', ({ decoded, encoded }) => {
            // Act
            const result = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(new TextDecoder().decode(result)).toBe(decoded);
        });

        it('should decode binary data correctly', () => {
            // Arrange
            const encoded = 'AAAQEAYE';

            // Act
            const result = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(result).toEqual(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]));
        });

        it('should decode lowercase input', () => {
            // Arrange
            const encoded = 'mzxw6ytboi';

            // Act
            const result = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(new TextDecoder().decode(result)).toBe('foobar');
        });

        it('should decode mixed case input', () => {
            // Arrange
            const encoded = 'MzXw6YtBoI';

            // Act
            const result = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(new TextDecoder().decode(result)).toBe('foobar');
        });

        it('should decode input with padding', () => {
            // Arrange
            const encoded = 'MY======';

            // Act
            const result = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(new TextDecoder().decode(result)).toBe('f');
        });

        it('should decode input without padding', () => {
            // Arrange
            const encoded = 'MY';

            // Act
            const result = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(new TextDecoder().decode(result)).toBe('f');
        });

        it('should handle empty input', () => {
            // Act
            const result = BASE32_PLUGIN.decode('');

            // Assert
            expect(result).toEqual(new Uint8Array(0));
        });

        it('should throw on invalid Base32 character', () => {
            // Arrange
            const invalidEncoded = 'MZXW6YTB0I'; // '0' is not in Base32 alphabet

            // Act & Assert
            expect(() => BASE32_PLUGIN.decode(invalidEncoded)).toThrow('Invalid Base32 character: 0');
        });

        it('should throw on invalid character (1)', () => {
            // Arrange
            const invalidEncoded = 'MZXW1YTB';

            // Act & Assert
            expect(() => BASE32_PLUGIN.decode(invalidEncoded)).toThrow('Invalid Base32 character: 1');
        });

        it('should throw on invalid character (8)', () => {
            // Arrange
            const invalidEncoded = 'MZXW8YTB';

            // Act & Assert
            expect(() => BASE32_PLUGIN.decode(invalidEncoded)).toThrow('Invalid Base32 character: 8');
        });

        it('should throw on invalid character (9)', () => {
            // Arrange
            const invalidEncoded = 'MZXW9YTB';

            // Act & Assert
            expect(() => BASE32_PLUGIN.decode(invalidEncoded)).toThrow('Invalid Base32 character: 9');
        });
    });

    describe('roundtrip', () => {
        it('should roundtrip arbitrary binary data', () => {
            // Arrange
            const original = new Uint8Array([0x00, 0x7f, 0x80, 0xff, 0x55, 0xaa]);

            // Act
            const encoded = BASE32_PLUGIN.encode(original);
            const decoded = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(decoded).toEqual(original);
        });

        it('should roundtrip typical OTP secret', () => {
            // Arrange
            const original = new Uint8Array(20);
            for (let i = 0; i < 20; i++) {
                original[i] = (i * 13) % 256;
            }

            // Act
            const encoded = BASE32_PLUGIN.encode(original);
            const decoded = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(decoded).toEqual(original);
        });

        it('should roundtrip with padding option', () => {
            // Arrange
            const original = new Uint8Array([0x12, 0x34, 0x56]);

            // Act
            const encoded = BASE32_PLUGIN.encode(original, { padding: true });
            const decoded = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(decoded).toEqual(original);
        });

        it('should roundtrip empty data', () => {
            // Arrange
            const original = new Uint8Array(0);

            // Act
            const encoded = BASE32_PLUGIN.encode(original);
            const decoded = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(decoded).toEqual(original);
        });

        it('should roundtrip all possible byte values', () => {
            // Arrange
            const original = new Uint8Array(256);
            for (let i = 0; i < 256; i++) {
                original[i] = i;
            }

            // Act
            const encoded = BASE32_PLUGIN.encode(original);
            const decoded = BASE32_PLUGIN.decode(encoded);

            // Assert
            expect(decoded).toEqual(original);
        });
    });

    // #endregion
});
