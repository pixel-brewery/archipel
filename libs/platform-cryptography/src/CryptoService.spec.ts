// #region Imports

import { describe, it, expect, beforeEach } from 'vitest';
import { CryptoService } from './CryptoService.js';

// #endregion

describe('CryptoService', () => {
    // #region Fields

    let service: CryptoService;

    // #endregion

    // #region Setup

    beforeEach(() => {
        service = new CryptoService();
    });

    // #endregion

    // #region getRandomGuid() Tests

    describe('getRandomGuid()', () => {
        it('should generate GUID with valid prefix', () => {
            // Arrange
            const prefix = 'test';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result).toMatch(/^test-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(result.startsWith('test-')).toBe(true);
        });

        it('should generate GUID with single character prefix', () => {
            // Arrange
            const prefix = 'a';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result).toMatch(/^a-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(result.startsWith('a-')).toBe(true);
        });

        it('should generate GUID with long prefix', () => {
            // Arrange
            const prefix = 'verylongprefixname';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result).toMatch(/^verylongprefixname-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(result.startsWith('verylongprefixname-')).toBe(true);
        });

        it('should generate GUID with prefix containing special characters', () => {
            // Arrange
            const prefix = 'test_prefix-123';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result).toMatch(/^test_prefix-123-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(result.startsWith('test_prefix-123-')).toBe(true);
        });

        it('should generate GUID with numeric prefix', () => {
            // Arrange
            const prefix = '12345';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result).toMatch(/^12345-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(result.startsWith('12345-')).toBe(true);
        });

        it('should throw error for empty string prefix', () => {
            // Arrange
            const prefix = '';

            // Act & Assert
            expect(() => service.getRandomGuid(prefix)).toThrow('The prefix is required.');
        });

        it('should throw error for null prefix', () => {
            // Arrange & Act & Assert
            expect(() => service.getRandomGuid(null as unknown as string)).toThrow('The prefix is required.');
        });

        it('should throw error for undefined prefix', () => {
            // Arrange & Act & Assert
            expect(() => service.getRandomGuid(undefined as unknown as string)).toThrow('The prefix is required.');
        });

        it('should throw error for whitespace-only prefix', () => {
            // Arrange
            const prefix = '   ';

            // Act & Assert
            expect(() => service.getRandomGuid(prefix)).toThrow('The prefix is required.');
        });

        it('should generate different GUIDs for same prefix (randomness test)', () => {
            // Arrange
            const prefix = 'test';
            const guids = new Set<string>();
            const iterations = 1000;

            // Act
            for (let i = 0; i < iterations; i++) {
                const guid = service.getRandomGuid(prefix);
                guids.add(guid);
            }

            // Assert - All GUIDs should be unique
            expect(guids.size).toBe(iterations);

            // Verify all have correct format
            for (const guid of guids) {
                expect(guid).toMatch(/^test-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            }
        });

        it('should generate valid UUID v4 format', () => {
            // Arrange
            const prefix = 'uuid-test';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            const uuidPart = result.substring(prefix.length + 1); // Remove prefix and dash
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
            expect(uuidPart).toMatch(uuidRegex);

            // Verify version is 4 (random UUID)
            const versionChar = uuidPart.charAt(14);
            expect(versionChar).toBe('4');

            // Verify variant bits (should be 8, 9, a, or b)
            const variantChar = uuidPart.charAt(19);
            expect(['8', '9', 'a', 'b']).toContain(variantChar);
        });

        it('should handle unicode characters in prefix', () => {
            // Arrange
            const prefix = 'тест';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result.startsWith('тест-')).toBe(true);
            const uuidPart = result.substring('тест-'.length);
            expect(uuidPart).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        });

        it('should handle emoji characters in prefix', () => {
            // Arrange
            const prefix = '🚀test';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result.startsWith('🚀test-')).toBe(true);
            const uuidPart = result.substring('🚀test-'.length);
            expect(uuidPart).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        });

        it('should maintain consistent format across multiple calls', () => {
            // Arrange
            const prefix = 'consistency-test';
            const results: Array<string> = [];

            // Act
            for (let i = 0; i < 100; i++) {
                const result = service.getRandomGuid(prefix);
                results.push(result);
            }

            // Assert
            results.forEach((result) => {
                expect(result).toMatch(/^consistency-test-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
                expect(result.startsWith('consistency-test-')).toBe(true);
            });

            // Verify all results are unique
            const uniqueResults = new Set(results);
            expect(uniqueResults.size).toBe(results.length);
        });
    });

    // #endregion

    // #region Constructor Tests

    describe('constructor', () => {
        it('should create instance without parameters', () => {
            // Act
            const service = new CryptoService();

            // Assert
            expect(service).toBeDefined();
            expect(service).toBeInstanceOf(CryptoService);
        });

        it('should create multiple independent instances', () => {
            // Act
            const service1 = new CryptoService();
            const service2 = new CryptoService();

            // Assert
            expect(service1).toBeDefined();
            expect(service2).toBeDefined();
            expect(service1).not.toBe(service2);

            // Verify both instances work independently
            const guid1 = service1.getRandomGuid('test1');
            const guid2 = service2.getRandomGuid('test2');

            expect(guid1).not.toBe(guid2);
            expect(guid1).toMatch(/^test1-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(guid2).toMatch(/^test2-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        });
    });

    // #endregion

    // #region Edge Cases

    describe('Edge Cases', () => {
        it('should handle very long prefix without issues', () => {
            // Arrange
            const prefix = 'a'.repeat(1000);

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result.startsWith(prefix + '-')).toBe(true);
            const uuidPart = result.substring(prefix.length + 1);
            expect(uuidPart).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        });

        it('should handle prefix with newlines and tabs', () => {
            // Arrange
            const prefix = 'test\n\tprefix';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result.startsWith('test\n\tprefix-')).toBe(true);
        });

        it('should handle prefix that looks like UUID', () => {
            // Arrange
            const prefix = '12345678-1234-1234-1234-123456789012';

            // Act
            const result = service.getRandomGuid(prefix);

            // Assert
            expect(result).toBeDefined();
            expect(result.startsWith(prefix + '-')).toBe(true);
            const uuidPart = result.substring(prefix.length + 1);
            expect(uuidPart).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        });
    });

    // #endregion
});
