// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';

// #endregion

// #region Mocks

const mockVerify = vi.fn();

vi.mock('nodemailer', () => ({
    createTransport: vi.fn().mockReturnValue({
        verify: mockVerify,
        sendMail: vi.fn(),
    }),
}));

// #endregion

// #region Tests

describe('MailVerificationService', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should delegate verifyEmail to verifyConnection', async () => {
        // arrange
        mockVerify.mockImplementation((cb: (err: unknown, success: boolean) => void) => cb(null, true));
        const configService = { tryGet: vi.fn((_key: string, fallback: unknown) => fallback) } as never;
        const { MailVerificationService } = await import('./MailVerificationService.js');
        const service = new MailVerificationService(configService);

        // act
        const result = await service.verifyEmail('user@example.com');

        // assert
        expect(result).toBe(true);
        expect(mockVerify).toHaveBeenCalled();
    });

    it('should return false when verifyConnection fails', async () => {
        // arrange
        mockVerify.mockImplementation((cb: (err: unknown, success: boolean) => void) => cb(new Error('fail'), false));
        const configService = { tryGet: vi.fn((_key: string, fallback: unknown) => fallback) } as never;
        const { MailVerificationService } = await import('./MailVerificationService.js');
        const service = new MailVerificationService(configService);

        // act
        const result = await service.verifyEmail('user@example.com');

        // assert
        expect(result).toBe(false);
    });
});

// #endregion
