// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';

// #endregion

// #region Mocks

const mockSendEmail = vi.fn().mockResolvedValue({ MessageID: 'msg-123' });

vi.mock('postmark', () => {
    return {
        ServerClient: class {
            public sendEmail = mockSendEmail;
        },
    };
});

// #endregion

// #region Tests

describe('PostmarkDeliveryStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should send an HTML email with Postmark fields', async () => {
        // arrange
        const configService = { get: vi.fn().mockReturnValue('pm-api-key') } as never;
        const { PostmarkDeliveryStrategy } = await import('./PostmarkDeliveryStrategy.js');
        const strategy = new PostmarkDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', '<p>Hello</p>', true);

        // assert
        expect(mockSendEmail).toHaveBeenCalledWith({
            From: 'from@test.com',
            To: 'to@test.com',
            Subject: 'Subject',
            HtmlBody: '<p>Hello</p>',
        });
    });

    it('should send a plain text email with Postmark fields', async () => {
        // arrange
        const configService = { get: vi.fn().mockReturnValue('pm-api-key') } as never;
        const { PostmarkDeliveryStrategy } = await import('./PostmarkDeliveryStrategy.js');
        const strategy = new PostmarkDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', 'Hello', false);

        // assert
        expect(mockSendEmail).toHaveBeenCalledWith({
            From: 'from@test.com',
            To: 'to@test.com',
            Subject: 'Subject',
            TextBody: 'Hello',
        });
    });

    it('should throw MailDeliveryError on failure', async () => {
        // arrange
        mockSendEmail.mockRejectedValueOnce(new Error('Postmark API error'));
        const configService = { get: vi.fn().mockReturnValue('pm-api-key') } as never;
        const { PostmarkDeliveryStrategy } = await import('./PostmarkDeliveryStrategy.js');
        const strategy = new PostmarkDeliveryStrategy(configService);

        // act / assert
        await expect(strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false)).rejects.toThrow(MailDeliveryError);
    });

    it('should include postmark as the provider in the error', async () => {
        // arrange
        mockSendEmail.mockRejectedValueOnce(new Error('API error'));
        const configService = { get: vi.fn().mockReturnValue('pm-api-key') } as never;
        const { PostmarkDeliveryStrategy } = await import('./PostmarkDeliveryStrategy.js');
        const strategy = new PostmarkDeliveryStrategy(configService);

        // act
        try {
            await strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false);
        } catch (error) {
            // assert
            expect((error as MailDeliveryError).provider).toBe('postmark');
        }
    });
});

// #endregion
