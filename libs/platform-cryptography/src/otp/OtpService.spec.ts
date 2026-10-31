// #region Imports

import { generateSecret } from '@otplib/core';
import { verify as verifyHotp } from '@otplib/hotp';
import { verifySync as verifyTotpSync } from '@otplib/totp';
import { generateTOTP } from '@otplib/uri';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OtpService, TOTP_EPOCH_TOLERANCE } from './OtpService.js';

// #endregion

vi.mock('@otplib/core', () => ({
    generateSecret: vi.fn().mockReturnValue('MOCKED_SECRET'),
}));

vi.mock('@otplib/hotp', () => ({
    verify: vi.fn().mockResolvedValue({ valid: true, delta: 0 }),
}));

vi.mock('@otplib/totp', () => ({
    verifySync: vi.fn().mockReturnValue({ valid: true }),
}));

vi.mock('@otplib/uri', () => ({
    generateTOTP: vi.fn().mockReturnValue('otpauth://totp/TestApp:user@example.com?secret=MOCKED_SECRET&issuer=TestApp'),
}));

const mockedGenerateSecret = vi.mocked(generateSecret);
const mockedVerifyHotp = vi.mocked(verifyHotp);
const mockedVerifyTotpSync = vi.mocked(verifyTotpSync);
const mockedGenerateTOTP = vi.mocked(generateTOTP);

describe('OtpService', () => {
    // #region Fields

    let service: OtpService;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.clearAllMocks();
        service = new OtpService();
    });

    describe('generateSecret()', () => {
        it('should return a secret string', () => {
            // Arrange & Act
            const secret = service.generateSecret();

            // Assert
            expect(secret).toBe('MOCKED_SECRET');
            expect(mockedGenerateSecret).toHaveBeenCalledWith(expect.objectContaining({ base32: expect.any(Object), crypto: expect.any(Object) }));
        });
    });

    describe('generateUri()', () => {
        it('should return an otpauth URI', () => {
            // Arrange
            const options = { label: 'user@example.com', issuer: 'TestApp', secret: 'MOCKED_SECRET' };

            // Act
            const uri = service.generateUri(options);

            // Assert
            expect(uri).toContain('otpauth://totp/');
            expect(mockedGenerateTOTP).toHaveBeenCalledWith(options);
        });
    });

    describe('verify()', () => {
        it('should return true for a valid token', () => {
            // Arrange & Act
            const result = service.verify('123456', 'MOCKED_SECRET');

            // Assert
            expect(result).toBe(true);
            expect(mockedVerifyTotpSync).toHaveBeenCalledWith(expect.objectContaining({ token: '123456', secret: 'MOCKED_SECRET' }));
        });
    });

    describe('verifyHotp()', () => {
        it('should return true for a valid HOTP token', async () => {
            // Arrange & Act
            const result = await service.verifyHotp('123456', 'MOCKED_SECRET', 1);

            // Assert
            expect(result).toBe(true);
            expect(mockedVerifyHotp).toHaveBeenCalledWith(expect.objectContaining({ token: '123456', secret: 'MOCKED_SECRET', counter: 1 }));
        });
    });

    describe('configuration', () => {
        it('should use default epoch tolerance when no options are provided', () => {
            // Act
            service.verify('123456', 'MOCKED_SECRET');

            // Assert
            expect(mockedVerifyTotpSync).toHaveBeenCalledWith(expect.objectContaining({ epochTolerance: TOTP_EPOCH_TOLERANCE }));
        });

        it('should use custom epoch tolerance when provided via options', () => {
            // Arrange
            const customService = new OtpService({ epochTolerance: 60 });

            // Act
            customService.verify('123456', 'MOCKED_SECRET');

            // Assert
            expect(mockedVerifyTotpSync).toHaveBeenCalledWith(expect.objectContaining({ epochTolerance: 60 }));
        });
    });

    // #endregion
});
