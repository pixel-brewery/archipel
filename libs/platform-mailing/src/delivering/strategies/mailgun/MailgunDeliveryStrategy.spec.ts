// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';

// #endregion

// #region Mocks

const mockCreate = vi.fn().mockResolvedValue({ id: 'msg-123' });

vi.mock('mailgun.js', () => {
    return {
        default: class {
            public client(): { messages: { create: typeof mockCreate } } {
                return { messages: { create: mockCreate } };
            }
        },
    };
});

vi.mock('form-data', () => ({
    default: class FormData {},
}));

// #endregion

// #region Tests

describe('MailgunDeliveryStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should send an HTML email successfully', async () => {
        // arrange
        const configService = {
            get: vi.fn((key: string) => {
                if (key === 'MAIL_MAILGUN_API_KEY') return 'mg-api-key';
                if (key === 'MAIL_MAILGUN_DOMAIN') return 'mg.example.com';
                return '';
            }),
        } as never;
        const { MailgunDeliveryStrategy } = await import('./MailgunDeliveryStrategy.js');
        const strategy = new MailgunDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', '<p>Hello</p>', true);

        // assert
        expect(mockCreate).toHaveBeenCalledWith('mg.example.com', {
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Subject',
            html: '<p>Hello</p>',
        });
    });

    it('should send a plain text email successfully', async () => {
        // arrange
        const configService = {
            get: vi.fn((key: string) => {
                if (key === 'MAIL_MAILGUN_API_KEY') return 'mg-api-key';
                if (key === 'MAIL_MAILGUN_DOMAIN') return 'mg.example.com';
                return '';
            }),
        } as never;
        const { MailgunDeliveryStrategy } = await import('./MailgunDeliveryStrategy.js');
        const strategy = new MailgunDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', 'Hello', false);

        // assert
        expect(mockCreate).toHaveBeenCalledWith('mg.example.com', {
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Subject',
            text: 'Hello',
        });
    });

    it('should throw MailDeliveryError on failure', async () => {
        // arrange
        mockCreate.mockRejectedValueOnce(new Error('Mailgun API error'));
        const configService = {
            get: vi.fn((key: string) => {
                if (key === 'MAIL_MAILGUN_API_KEY') return 'mg-api-key';
                if (key === 'MAIL_MAILGUN_DOMAIN') return 'mg.example.com';
                return '';
            }),
        } as never;
        const { MailgunDeliveryStrategy } = await import('./MailgunDeliveryStrategy.js');
        const strategy = new MailgunDeliveryStrategy(configService);

        // act / assert
        await expect(strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false)).rejects.toThrow(MailDeliveryError);
    });

    it('should include mailgun as the provider in the error', async () => {
        // arrange
        mockCreate.mockRejectedValueOnce(new Error('API error'));
        const configService = {
            get: vi.fn((key: string) => {
                if (key === 'MAIL_MAILGUN_API_KEY') return 'mg-api-key';
                if (key === 'MAIL_MAILGUN_DOMAIN') return 'mg.example.com';
                return '';
            }),
        } as never;
        const { MailgunDeliveryStrategy } = await import('./MailgunDeliveryStrategy.js');
        const strategy = new MailgunDeliveryStrategy(configService);

        // act
        try {
            await strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false);
        } catch (error) {
            // assert
            expect((error as MailDeliveryError).provider).toBe('mailgun');
        }
    });
});

// #endregion
