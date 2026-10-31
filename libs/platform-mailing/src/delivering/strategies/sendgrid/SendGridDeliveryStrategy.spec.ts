// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';

// #endregion

// #region Mocks

const mockSend = vi.fn().mockResolvedValue([{ statusCode: 202 }]);

vi.mock('@sendgrid/mail', () => ({
    default: {
        setApiKey: vi.fn(),
        send: mockSend,
    },
}));

// #endregion

// #region Tests

describe('SendGridDeliveryStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should send an HTML email successfully', async () => {
        // arrange
        const configService = { get: vi.fn().mockReturnValue('sg-api-key') } as never;
        const { SendGridDeliveryStrategy } = await import('./SendGridDeliveryStrategy.js');
        const strategy = new SendGridDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', '<p>Hello</p>', true);

        // assert
        expect(mockSend).toHaveBeenCalledWith({
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Subject',
            html: '<p>Hello</p>',
        });
    });

    it('should send a plain text email successfully', async () => {
        // arrange
        const configService = { get: vi.fn().mockReturnValue('sg-api-key') } as never;
        const { SendGridDeliveryStrategy } = await import('./SendGridDeliveryStrategy.js');
        const strategy = new SendGridDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', 'Hello', false);

        // assert
        expect(mockSend).toHaveBeenCalledWith({
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Subject',
            text: 'Hello',
        });
    });

    it('should throw MailDeliveryError on failure', async () => {
        // arrange
        mockSend.mockRejectedValueOnce(new Error('SendGrid API error'));
        const configService = { get: vi.fn().mockReturnValue('sg-api-key') } as never;
        const { SendGridDeliveryStrategy } = await import('./SendGridDeliveryStrategy.js');
        const strategy = new SendGridDeliveryStrategy(configService);

        // act / assert
        await expect(strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false)).rejects.toThrow(MailDeliveryError);
    });

    it('should include sendgrid as the provider in the error', async () => {
        // arrange
        mockSend.mockRejectedValueOnce(new Error('API error'));
        const configService = { get: vi.fn().mockReturnValue('sg-api-key') } as never;
        const { SendGridDeliveryStrategy } = await import('./SendGridDeliveryStrategy.js');
        const strategy = new SendGridDeliveryStrategy(configService);

        // act
        try {
            await strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false);
        } catch (error) {
            // assert
            expect((error as MailDeliveryError).provider).toBe('sendgrid');
        }
    });
});

// #endregion
