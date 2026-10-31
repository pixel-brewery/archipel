import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VerificationService } from './VerificationService.js';

describe('VerificationService', () => {
    // #region Fields

    let service: VerificationService;
    let mockJwtService: Record<string, ReturnType<typeof vi.fn>>;
    let mockHostService: { host: string };
    let mockVerificationSubject: Record<string, ReturnType<typeof vi.fn>>;
    let mockConfigService: Record<string, ReturnType<typeof vi.fn>>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockJwtService = {
            signAsync: vi.fn().mockResolvedValue('signed-token'),
            verifyAsync: vi.fn().mockResolvedValue({ email: 'user@example.com' }),
            verify: vi.fn().mockReturnValue(true),
            decode: vi.fn().mockReturnValue({ exp: String(Math.floor(Date.now() / 1000) + 3600) }),
        };

        mockHostService = {
            host: 'https://example.com',
        };

        mockVerificationSubject = {
            findByLogin: vi.fn(),
            findByVerificationToken: vi.fn(),
            setVerificationToken: vi.fn().mockResolvedValue(undefined),
            markVerified: vi.fn().mockResolvedValue(undefined),
        };

        mockConfigService = {
            get: vi.fn().mockReturnValue('1h'),
        };

        service = new VerificationService(mockJwtService as never, mockHostService as never, mockVerificationSubject as never, mockConfigService as never);
    });

    // #endregion

    // #region Methods

    describe('exhibitToken', () => {
        it('should sign a token with the provided data and config expiry', async () => {
            // arrange
            const data = { email: 'user@example.com', pin: '1234' };

            // act
            const result = await service.exhibitToken(data);

            // assert
            expect(result).toBe('signed-token');
            expect(mockJwtService.signAsync).toHaveBeenCalledWith(data, { expiresIn: 3600 });
            expect(mockConfigService.get).toHaveBeenCalledWith('AUTH_VERIFY_JWT_EXPIRES_IN');
        });
    });

    describe('redeemToken', () => {
        it('should verify and return the token payload', async () => {
            // arrange
            const token = 'valid-token';

            // act
            const result = await service.redeemToken(token);

            // assert
            expect(result).toEqual({ email: 'user@example.com' });
            expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token);
        });
    });

    describe('verifyToken', () => {
        it('should verify a valid token and mark user as verified', async () => {
            // arrange
            const token = 'valid-token';
            mockVerificationSubject.findByVerificationToken.mockResolvedValue({
                id: 'user-1',
                isVerified: false,
                verificationToken: token,
            });

            // act
            const result = await service.verifyToken(token);

            // assert
            expect(result).toBe(true);
            expect(mockVerificationSubject.markVerified).toHaveBeenCalledWith('user-1');
        });

        it('should return false when user is not found', async () => {
            // arrange
            mockVerificationSubject.findByVerificationToken.mockResolvedValue(null);

            // act
            const result = await service.verifyToken('token');

            // assert
            expect(result).toBe(false);
        });

        it('should return false when user is already verified', async () => {
            // arrange
            mockVerificationSubject.findByVerificationToken.mockResolvedValue({ id: 'user-1', isVerified: true });

            // act
            const result = await service.verifyToken('token');

            // assert
            expect(result).toBe(false);
        });

        it('should throw when token is expired', async () => {
            // arrange
            const expiredTimestamp = String(Math.floor(Date.now() / 1000) - 3600);
            mockJwtService.decode.mockReturnValue({ exp: expiredTimestamp });

            // act & assert
            await expect(service.verifyToken('expired-token')).rejects.toThrow(BadRequestException);
        });
    });

    describe('verifyPin', () => {
        it('should verify a valid pin and mark user as verified', async () => {
            // arrange
            const user = { id: 'user-1', email: 'user@example.com', isVerified: false, verificationToken: 'stored-token' };
            mockVerificationSubject.findByLogin.mockResolvedValue(user);
            mockJwtService.verifyAsync.mockResolvedValue({ email: 'user@example.com', pin: '1234' });

            // act
            const result = await service.verifyPin('1234', 'user@example.com');

            // assert
            expect(result).toBe(true);
            expect(mockVerificationSubject.markVerified).toHaveBeenCalledWith('user-1');
        });

        it('should throw when user is not found', async () => {
            // arrange
            mockVerificationSubject.findByLogin.mockResolvedValue(null);

            // act & assert
            await expect(service.verifyPin('1234', 'unknown@example.com')).rejects.toThrow(BadRequestException);
        });

        it('should throw when user is already verified', async () => {
            // arrange
            mockVerificationSubject.findByLogin.mockResolvedValue({ id: 'user-1', isVerified: true });

            // act & assert
            await expect(service.verifyPin('1234', 'user@example.com')).rejects.toThrow(BadRequestException);
        });

        it('should throw when pin does not match', async () => {
            // arrange
            const user = { id: 'user-1', email: 'user@example.com', isVerified: false, verificationToken: 'stored-token' };
            mockVerificationSubject.findByLogin.mockResolvedValue(user);
            mockJwtService.verifyAsync.mockResolvedValue({ email: 'user@example.com', pin: '9999' });

            // act & assert
            await expect(service.verifyPin('1234', 'user@example.com')).rejects.toThrow(BadRequestException);
        });

        it('should return false when user has no verification token', async () => {
            // arrange
            const user = { id: 'user-1', email: 'user@example.com', isVerified: false, verificationToken: null };
            mockVerificationSubject.findByLogin.mockResolvedValue(user);

            // act
            const result = await service.verifyPin('1234', 'user@example.com');

            // assert
            expect(result).toBe(false);
        });
    });

    describe('buildVerificationLink', () => {
        it('should return a valid verification URL', () => {
            // arrange
            const token = 'my-token';

            // act
            const link = service.buildVerificationLink(token);

            // assert
            expect(link).toBe('https://example.com/api/auth/verify-token?token=my-token');
        });
    });

    // #endregion
});
