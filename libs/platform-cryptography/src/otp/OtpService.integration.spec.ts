// #region Imports

import { generateSync as generateHotpSync } from '@otplib/hotp';
import { generateSync as generateTotpSync } from '@otplib/totp';
import { describe, expect, it } from 'vitest';
import { BASE32_PLUGIN } from './Base32Plugin.js';
import { NODE_CRYPTO_PLUGIN } from './NodeCryptoPlugin.js';
import { OtpService } from './OtpService.js';

// #endregion

describe('OtpService (integration)', () => {
    // #region TOTP Roundtrip Tests

    describe('TOTP roundtrip', () => {
        it('should verify a real TOTP token generated from a secret', () => {
            // Arrange
            const service = new OtpService();
            const secret = service.generateSecret();
            const token = generateTotpSync({ secret, crypto: NODE_CRYPTO_PLUGIN, base32: BASE32_PLUGIN });

            // Act
            const result = service.verify(token, secret);

            // Assert
            expect(result).toBe(true);
        });

        it('should reject an incorrect TOTP token', () => {
            // Arrange
            const service = new OtpService();
            const secret = service.generateSecret();

            // Act
            const result = service.verify('000000', secret);

            // Assert
            expect(result).toBe(false);
        });

        it('should generate a real secret with expected length', () => {
            // Arrange
            const service = new OtpService();

            // Act
            const secret = service.generateSecret();

            // Assert
            expect(secret).toBeDefined();
            expect(secret.length).toBeGreaterThan(0);
        });

        it('should generate a valid otpauth URI', () => {
            // Arrange
            const service = new OtpService();
            const secret = service.generateSecret();

            // Act
            const uri = service.generateUri({ issuer: 'TestApp', label: 'user@example.com', secret });

            // Assert
            expect(uri).toContain('otpauth://totp/');
            expect(uri).toContain('secret=');
            expect(uri).toContain('issuer=TestApp');
        });
    });

    // #endregion

    // #region HOTP Roundtrip Tests

    describe('HOTP roundtrip', () => {
        it('should verify a real HOTP token for the correct counter', async () => {
            // Arrange
            const service = new OtpService();
            const secret = service.generateSecret();
            const counter = 42;
            const token = generateHotpSync({ secret, counter, crypto: NODE_CRYPTO_PLUGIN, base32: BASE32_PLUGIN });

            // Act
            const result = await service.verifyHotp(token, secret, counter);

            // Assert
            expect(result).toBe(true);
        });

        it('should reject an HOTP token for the wrong counter', async () => {
            // Arrange
            const service = new OtpService();
            const secret = service.generateSecret();
            const token = generateHotpSync({ secret, counter: 1, crypto: NODE_CRYPTO_PLUGIN, base32: BASE32_PLUGIN });

            // Act
            const result = await service.verifyHotp(token, secret, 999);

            // Assert
            expect(result).toBe(false);
        });
    });

    // #endregion
});
