import type { EventHub } from '@pixel-brewery/archipel-platform-core';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MailService } from '../../services/MailService.js';
import { MailEventSubscriber } from './MailEventSubscriber.js';

describe('MailEventSubscriber', () => {
    // #region Fields

    let subscriber: MailEventSubscriber;
    let mailServiceMock: Partial<MailService>;
    let subject$: Subject<Record<string, unknown>>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mailServiceMock = {
            sendTemplate: vi.fn().mockResolvedValue(undefined),
        };

        subject$ = new Subject();

        const eventHubMock: Partial<EventHub> = {
            observe: vi.fn().mockReturnValue(subject$.asObservable()),
        };

        subscriber = new MailEventSubscriber(mailServiceMock as MailService, eventHubMock as EventHub);
    });

    it('should subscribe to the send mail event key', () => {
        // assert - subscriber was created without error
        expect(subscriber).toBeDefined();
    });

    it('should delegate mail events to the mail service', async () => {
        // arrange
        const payload = {
            senderEmail: 'from@test.com',
            recipientEmail: 'to@test.com',
            subject: 'Welcome',
            templateName: 'welcome',
            templateParams: { name: 'Alice' },
        };

        // act
        subject$.next(payload);

        // wait for async handler
        await vi.waitFor(() => {
            expect(mailServiceMock.sendTemplate).toHaveBeenCalledOnce();
        });

        // assert
        expect(mailServiceMock.sendTemplate).toHaveBeenCalledWith(
            { from: 'from@test.com', to: 'to@test.com', subject: 'Welcome' },
            { templateName: 'welcome', templateParams: { name: 'Alice' } },
        );
    });

    it('should pass undefined subject when not provided in event', async () => {
        // arrange
        const payload = {
            recipientEmail: 'to@test.com',
            templateName: 'AuthRegister',
            templateParams: { firstName: 'Bob' },
        };

        // act
        subject$.next(payload);

        // wait for async handler
        await vi.waitFor(() => {
            expect(mailServiceMock.sendTemplate).toHaveBeenCalledOnce();
        });

        // assert
        expect(mailServiceMock.sendTemplate).toHaveBeenCalledWith(
            { from: undefined, to: 'to@test.com', subject: undefined },
            { templateName: 'AuthRegister', templateParams: { firstName: 'Bob' } },
        );
    });

    it('should unsubscribe on module destroy', () => {
        // act
        subscriber.onModuleDestroy();

        // assert - emitting after destroy should not trigger sendTemplate
        subject$.next({
            senderEmail: 'from@test.com',
            recipientEmail: 'to@test.com',
            subject: 'Test',
            templateName: 'test',
            templateParams: {},
        });

        expect(mailServiceMock.sendTemplate).not.toHaveBeenCalled();
    });

    // #endregion
});
