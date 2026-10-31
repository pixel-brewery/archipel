// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';

// #endregion

// #region Mocks

const mockVerify = vi.fn();
const mockSendMail = vi.fn();

vi.mock('nodemailer', () => ({
    createTransport: vi.fn().mockReturnValue({
        verify: mockVerify,
        sendMail: mockSendMail,
    }),
}));

// #endregion

// #region Tests

describe('SmtpConnectionVerifier', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return true when SMTP server is reachable', async () => {
        // arrange
        mockVerify.mockImplementation((cb: (err: unknown, success: boolean) => void) => cb(null, true));
        const configService = { tryGet: vi.fn((_key: string, fallback: unknown) => fallback) } as never;
        const { SmtpConnectionVerifier } = await import('./SmtpConnectionVerifier.js');
        const verifier = new SmtpConnectionVerifier(configService);

        // act
        const result = await verifier.verifyConnection();

        // assert
        expect(result).toBe(true);
    });

    it('should return false when SMTP server is not reachable', async () => {
        // arrange
        mockVerify.mockImplementation((cb: (err: unknown, success: boolean) => void) => cb(new Error('refused'), false));
        const configService = { tryGet: vi.fn((_key: string, fallback: unknown) => fallback) } as never;
        const { SmtpConnectionVerifier } = await import('./SmtpConnectionVerifier.js');
        const verifier = new SmtpConnectionVerifier(configService);

        // act
        const result = await verifier.verifyConnection();

        // assert
        expect(result).toBe(false);
    });

    it('should send a test email', async () => {
        // arrange
        mockSendMail.mockResolvedValue({ messageId: 'test-123' });
        const configService = { tryGet: vi.fn((_key: string, fallback: unknown) => fallback) } as never;
        const { SmtpConnectionVerifier } = await import('./SmtpConnectionVerifier.js');
        const verifier = new SmtpConnectionVerifier(configService);

        // act
        await verifier.sendTestEmail('from@test.com', 'to@test.com', 'Test Subject', 'Test body');

        // assert
        expect(mockSendMail).toHaveBeenCalledWith({
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Test Subject',
            text: 'Test body',
        });
    });
});

// #endregion
