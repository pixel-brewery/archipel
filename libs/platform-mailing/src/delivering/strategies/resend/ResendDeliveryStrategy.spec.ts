// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';

// #endregion

// #region Mocks

const mockEmailsSend = vi.fn().mockResolvedValue({ data: { id: 'msg-123' } });

vi.mock('resend', () => {
    return {
        Resend: class {
            public emails = { send: mockEmailsSend };
        },
    };
});

// #endregion

// #region Tests

describe('ResendDeliveryStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should send an HTML email successfully', async () => {
        // arrange
        const configService = { get: vi.fn().mockReturnValue('re-api-key') } as never;
        const { ResendDeliveryStrategy } = await import('./ResendDeliveryStrategy.js');
        const strategy = new ResendDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', '<p>Hello</p>', true);

        // assert
        expect(mockEmailsSend).toHaveBeenCalledWith({
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Subject',
            html: '<p>Hello</p>',
        });
    });

    it('should send a plain text email successfully', async () => {
        // arrange
        const configService = { get: vi.fn().mockReturnValue('re-api-key') } as never;
        const { ResendDeliveryStrategy } = await import('./ResendDeliveryStrategy.js');
        const strategy = new ResendDeliveryStrategy(configService);

        // act
        await strategy.send('from@test.com', 'to@test.com', 'Subject', 'Hello', false);

        // assert
        expect(mockEmailsSend).toHaveBeenCalledWith({
            from: 'from@test.com',
            to: 'to@test.com',
            subject: 'Subject',
            text: 'Hello',
        });
    });

    it('should throw MailDeliveryError on failure', async () => {
        // arrange
        mockEmailsSend.mockRejectedValueOnce(new Error('Resend API error'));
        const configService = { get: vi.fn().mockReturnValue('re-api-key') } as never;
        const { ResendDeliveryStrategy } = await import('./ResendDeliveryStrategy.js');
        const strategy = new ResendDeliveryStrategy(configService);

        // act / assert
        await expect(strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false)).rejects.toThrow(MailDeliveryError);
    });

    it('should include resend as the provider in the error', async () => {
        // arrange
        mockEmailsSend.mockRejectedValueOnce(new Error('API error'));
        const configService = { get: vi.fn().mockReturnValue('re-api-key') } as never;
        const { ResendDeliveryStrategy } = await import('./ResendDeliveryStrategy.js');
        const strategy = new ResendDeliveryStrategy(configService);

        // act
        try {
            await strategy.send('from@test.com', 'to@test.com', 'Subject', 'body', false);
        } catch (error) {
            // assert
            expect((error as MailDeliveryError).provider).toBe('resend');
        }
    });
});

// #endregion
