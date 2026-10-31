// #region Imports

import { beforeEach, describe, expect, it } from 'vitest';
import { BcryptService, MIN_BCRYPT_ROUNDS } from './BcryptService.js';

// #endregion

describe('BcryptService', () => {
    // #region Fields

    let service: BcryptService;

    // #endregion

    // #region Setup

    beforeEach(() => {
        service = new BcryptService();
    });

    // #endregion

    // #region Constructor Tests

    describe('constructor', () => {
        it('should default to minimum rounds when no options are provided', async () => {
            // Arrange
            const password = 'testPassword';

            // Act
            const result = await service.hash(password);

            // Assert
            const roundsFromHash = parseInt(result.split('$')[2], 10);
            expect(roundsFromHash).toBe(MIN_BCRYPT_ROUNDS);
        });

        it('should use specified rounds when above the minimum', async () => {
            // Arrange
            const customService = new BcryptService({ rounds: 14 });
            const password = 'testPassword';

            // Act
            const result = await customService.hash(password);

            // Assert
            const roundsFromHash = parseInt(result.split('$')[2], 10);
            expect(roundsFromHash).toBe(14);
        });

        it('should clamp rounds to the minimum when a lower value is provided', async () => {
            // Arrange
            const customService = new BcryptService({ rounds: 8 });
            const password = 'testPassword';

            // Act
            const result = await customService.hash(password);

            // Assert
            const roundsFromHash = parseInt(result.split('$')[2], 10);
            expect(roundsFromHash).toBe(MIN_BCRYPT_ROUNDS);
        });
    });

    // #endregion

    // #region hash() Tests

    describe('hash()', () => {
        it('should hash a normal password', async () => {
            // Arrange
            const password = 'mySecurePassword123';

            // Act
            const result = await service.hash(password);

            // Assert
            expect(result).toBeDefined();
            expect(result).not.toBe(password);
            expect(result.length).toBeGreaterThan(50);
            expect(result).toMatch(/^\$2[aby]\$\d{2}\$/);
        });

        it('should hash an empty string', async () => {
            // Arrange
            const password = '';

            // Act
            const result = await service.hash(password);

            // Assert
            expect(result).toBeDefined();
            expect(result).not.toBe(password);
            expect(result.length).toBeGreaterThan(50);
            expect(result).toMatch(/^\$2[aby]\$\d{2}\$/);
        });

        it('should hash a long password via SHA-256 pre-hash', async () => {
            // Arrange
            const password = 'a'.repeat(1000);

            // Act
            const result = await service.hash(password);

            // Assert
            expect(result).toBeDefined();
            expect(result).not.toBe(password);
            expect(result.length).toBeGreaterThan(50);
            expect(result).toMatch(/^\$2[aby]\$\d{2}\$/);
        });

        it('should hash password with special characters', async () => {
            // Arrange
            const password = '!@#$%^&*()_+{}|:"<>?[]\\;\',./-~`äöüß🚀💪';

            // Act
            const result = await service.hash(password);

            // Assert
            expect(result).toBeDefined();
            expect(result).not.toBe(password);
            expect(result.length).toBeGreaterThan(50);
            expect(result).toMatch(/^\$2[aby]\$\d{2}\$/);
        });

        it('should generate different hashes for same password (salt randomness)', async () => {
            // Arrange
            const password = 'testPassword';

            // Act
            const hash1 = await service.hash(password);
            const hash2 = await service.hash(password);

            // Assert
            expect(hash1).not.toBe(hash2);
            expect(hash1).toMatch(/^\$2[aby]\$\d{2}\$/);
            expect(hash2).toMatch(/^\$2[aby]\$\d{2}\$/);
        });

        it('should hash unicode characters correctly', async () => {
            // Arrange
            const password = 'こんにちはالسلام عليكم🌍';

            // Act
            const result = await service.hash(password);

            // Assert
            expect(result).toBeDefined();
            expect(result).not.toBe(password);
            expect(result.length).toBeGreaterThan(50);
            expect(result).toMatch(/^\$2[aby]\$\d{2}\$/);
        });
    });

    // #endregion

    // #region compare() Tests

    describe('compare()', () => {
        it('should return true for correct password', async () => {
            // Arrange
            const password = 'correctPassword';
            const hash = await service.hash(password);

            // Act
            const result = await service.compare(password, hash);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            // Arrange
            const correctPassword = 'correctPassword';
            const incorrectPassword = 'wrongPassword';
            const hash = await service.hash(correctPassword);

            // Act
            const result = await service.compare(incorrectPassword, hash);

            // Assert
            expect(result).toBe(false);
        });

        it('should return true for empty string if empty string was hashed', async () => {
            // Arrange
            const password = '';
            const hash = await service.hash(password);

            // Act
            const result = await service.compare(password, hash);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for empty string against non-empty hash', async () => {
            // Arrange
            const originalPassword = 'notEmpty';
            const testPassword = '';
            const hash = await service.hash(originalPassword);

            // Act
            const result = await service.compare(testPassword, hash);

            // Assert
            expect(result).toBe(false);
        });

        it('should return true for long password that was pre-hashed', async () => {
            // Arrange
            const password = 'a'.repeat(1000);
            const hash = await service.hash(password);

            // Act
            const result = await service.compare(password, hash);

            // Assert
            expect(result).toBe(true);
        });

        it('should return true for password with special characters', async () => {
            // Arrange
            const password = '!@#$%^&*()_+{}|:"<>?[]\\;\',./-~`äöüß🚀💪';
            const hash = await service.hash(password);

            // Act
            const result = await service.compare(password, hash);

            // Assert
            expect(result).toBe(true);
        });

        it('should return true for unicode password', async () => {
            // Arrange
            const password = 'こんにちはالسلام عليكم🌍';
            const hash = await service.hash(password);

            // Act
            const result = await service.compare(password, hash);

            // Assert
            expect(result).toBe(true);
        });

        it('should be case sensitive', async () => {
            // Arrange
            const password = 'TestPassword';
            const wrongCasePassword = 'testpassword';
            const hash = await service.hash(password);

            // Act
            const result = await service.compare(wrongCasePassword, hash);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false for invalid hash format', async () => {
            // Arrange
            const password = 'testPassword';
            const invalidHash = 'invalidHashFormat';

            // Act
            const result = await service.compare(password, invalidHash);

            // Assert
            expect(result).toBe(false);
        });

        it('should handle whitespace differences', async () => {
            // Arrange
            const password = 'password';
            const passwordWithSpaces = ' password ';
            const hash = await service.hash(password);

            // Act
            const result = await service.compare(passwordWithSpaces, hash);

            // Assert
            expect(result).toBe(false);
        });
    });

    // #endregion

    // #region Pepper Tests

    describe('pepper', () => {
        it('should hash and verify successfully with a pepper', async () => {
            // Arrange
            const pepperService = new BcryptService({ pepper: 'server-side-secret-key' });
            const password = 'testPassword';

            // Act
            const hash = await pepperService.hash(password);
            const result = await pepperService.compare(password, hash);

            // Assert
            expect(result).toBe(true);
        });

        it('should fail verification when pepper differs between hash and compare', async () => {
            // Arrange
            const serviceA = new BcryptService({ pepper: 'pepper-key-A' });
            const serviceB = new BcryptService({ pepper: 'pepper-key-B' });
            const password = 'testPassword';

            // Act
            const hash = await serviceA.hash(password);
            const result = await serviceB.compare(password, hash);

            // Assert
            expect(result).toBe(false);
        });

        it('should produce different hashes with and without pepper for the same password', async () => {
            // Arrange
            const pepperService = new BcryptService({ pepper: 'my-secret-pepper' });
            const noPepperService = new BcryptService();
            const password = 'testPassword';

            // Act
            const hashWithPepper = await pepperService.hash(password);
            const hashWithoutPepper = await noPepperService.hash(password);

            // Assert
            expect(hashWithPepper).not.toBe(hashWithoutPepper);
        });

        it('should handle long passwords correctly when pepper is active', async () => {
            // Arrange
            const pepperService = new BcryptService({ pepper: 'pepper-key' });
            const longPassword = 'a'.repeat(1000);

            // Act
            const hash = await pepperService.hash(longPassword);
            const result = await pepperService.compare(longPassword, hash);

            // Assert
            expect(result).toBe(true);
        });
    });

    // #endregion

    // #region Integration Tests

    describe('integration', () => {
        // Three hashes and nine comparisons intentionally retain 12 bcrypt rounds and need time on shared CI runners.
        it('should handle multiple hash-compare cycles', async () => {
            // Arrange
            const passwords = ['password1', 'password2', 'password3'];
            const hashes: Array<string> = [];

            // Act
            for (const password of passwords) {
                const hash = await service.hash(password);
                hashes.push(hash);
            }

            // Assert
            for (let i = 0; i < passwords.length; i++) {
                const correctResult = await service.compare(passwords[i], hashes[i]);
                expect(correctResult).toBe(true);

                for (let j = 0; j < passwords.length; j++) {
                    if (i !== j) {
                        const incorrectResult = await service.compare(passwords[i], hashes[j]);
                        expect(incorrectResult).toBe(false);
                    }
                }
            }
        }, 20_000);

        it('should maintain consistency across service instances with same options', async () => {
            // Arrange
            const service1 = new BcryptService();
            const service2 = new BcryptService();
            const password = 'testPassword';

            // Act
            const hash = await service1.hash(password);
            const result = await service2.compare(password, hash);

            // Assert
            expect(result).toBe(true);
        });

        it('should produce a consistent hash for a password at the 72-byte boundary', async () => {
            // Arrange - exactly 72 ASCII bytes (no pre-hash expected)
            const password72 = 'a'.repeat(72);
            const password73 = 'a'.repeat(73);

            // Act
            const hash72 = await service.hash(password72);
            const hash73 = await service.hash(password73);

            // Assert - both should verify correctly with their own hash
            expect(await service.compare(password72, hash72)).toBe(true);
            expect(await service.compare(password73, hash73)).toBe(true);

            // Cross-compare should fail because 73 bytes triggers pre-hash
            expect(await service.compare(password73, hash72)).toBe(false);
        });
    });

    // #endregion
});
