// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';

// #endregion

// #region Mocks

const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'msg-123' });

vi.mock('nodemailer', () => ({
    createTransport: vi.fn().mockReturnValue({
        sendMail: mockSendMail,
    }),
}));

// #endregion

// #region Tests

describe('SmtpDeliveryStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should send an HTML email successfully', async () => {
        // arrange
        const configService = {
            tryGet: vi.fn((_key: string, fallback: unknown) => fallback),
        } as never;
        const { SmtpDeliveryStrategy } = await import('./SmtpDeliveryStrategy.js');
        const strategy = new SmtpDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', '<p>Hello</p>', true);

        // assert
        expect(mockSendMail).toHaveBeenCalledWith({
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Subject',
            html: '<p>Hello</p>',
        });
    });

    it('should send a plain text email successfully', async () => {
        // arrange
        const configService = {
            tryGet: vi.fn((_key: string, fallback: unknown) => fallback),
        } as never;
        const { SmtpDeliveryStrategy } = await import('./SmtpDeliveryStrategy.js');
        const strategy = new SmtpDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', 'Hello', false);

        // assert
        expect(mockSendMail).toHaveBeenCalledWith({
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Subject',
            text: 'Hello',
        });
    });

    it('should throw MailDeliveryError on failure', async () => {
        // arrange
        mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));
        const configService = {
            tryGet: vi.fn((_key: string, fallback: unknown) => fallback),
        } as never;
        const { SmtpDeliveryStrategy } = await import('./SmtpDeliveryStrategy.js');
        const strategy = new SmtpDeliveryStrategy(configService);

        // act / assert
        await expect(strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false)).rejects.toThrow(MailDeliveryError);
    });

    it('should include smtp as the provider in the error', async () => {
        // arrange
        mockSendMail.mockRejectedValueOnce(new Error('Connection refused'));
        const configService = {
            tryGet: vi.fn((_key: string, fallback: unknown) => fallback),
        } as never;
        const { SmtpDeliveryStrategy } = await import('./SmtpDeliveryStrategy.js');
        const strategy = new SmtpDeliveryStrategy(configService);

        // act
        try {
            await strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false);
        } catch (error) {
            // assert
            expect((error as MailDeliveryError).provider).toBe('smtp');
        }
    });
});

// #endregion
