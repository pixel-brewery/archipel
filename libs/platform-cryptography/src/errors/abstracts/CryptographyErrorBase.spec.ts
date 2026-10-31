// #region Imports

import { describe, expect, it } from 'vitest';
import { CryptographyErrorBase } from './CryptographyErrorBase.js';
import { CryptoValidationError } from '../CryptoValidationError.js';
import { InvalidOtpError } from '../InvalidOtpError.js';
import { WeakPasswordError } from '../WeakPasswordError.js';

// #endregion

describe('CryptographyErrorBase', () => {
    // #region Methods

    describe('WeakPasswordError', () => {
        it('should have the correct error code', () => {
            // Arrange & Act
            const error = new WeakPasswordError();

            // Assert
            expect(error.code).toBe('WEAK_PASSWORD');
            expect(error.name).toBe('WeakPasswordError');
            expect(error).toBeInstanceOf(CryptographyErrorBase);
            expect(error).toBeInstanceOf(Error);
        });

        it('should accept a custom message', () => {
            // Arrange
            const message = 'Password must be at least 8 characters.';

            // Act
            const error = new WeakPasswordError(message);

            // Assert
            expect(error.message).toBe(message);
            expect(error.code).toBe('WEAK_PASSWORD');
        });

        it('should use a default message when none is provided', () => {
            // Arrange & Act
            const error = new WeakPasswordError();

            // Assert
            expect(error.message).toBe('The provided password does not meet the minimum strength requirements.');
        });
    });

    describe('InvalidOtpError', () => {
        it('should have the correct error code', () => {
            // Arrange & Act
            const error = new InvalidOtpError();

            // Assert
            expect(error.code).toBe('INVALID_OTP');
            expect(error.name).toBe('InvalidOtpError');
            expect(error).toBeInstanceOf(CryptographyErrorBase);
            expect(error).toBeInstanceOf(Error);
        });

        it('should accept a custom message', () => {
            // Arrange
            const message = 'The HOTP token has expired.';

            // Act
            const error = new InvalidOtpError(message);

            // Assert
            expect(error.message).toBe(message);
            expect(error.code).toBe('INVALID_OTP');
        });

        it('should use a default message when none is provided', () => {
            // Arrange & Act
            const error = new InvalidOtpError();

            // Assert
            expect(error.message).toBe('The provided OTP token is invalid or expired.');
        });
    });

    describe('CryptoValidationError', () => {
        it('should have the correct error code', () => {
            // Arrange & Act
            const error = new CryptoValidationError('Invalid input');

            // Assert
            expect(error.code).toBe('CRYPTO_VALIDATION');
            expect(error.name).toBe('CryptoValidationError');
            expect(error).toBeInstanceOf(CryptographyErrorBase);
            expect(error).toBeInstanceOf(Error);
        });

        it('should use the provided message', () => {
            // Arrange
            const message = 'The key length is invalid.';

            // Act
            const error = new CryptoValidationError(message);

            // Assert
            expect(error.message).toBe(message);
            expect(error.code).toBe('CRYPTO_VALIDATION');
        });
    });

    // #endregion
});
