import { beforeEach, describe, expect, it, vi } from 'vitest';

const sentryMock = vi.hoisted(() => ({
    init: vi.fn(),
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    setUser: vi.fn(),
    addBreadcrumb: vi.fn(),
}));

vi.mock('@sentry/node', () => sentryMock);

import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';
import { SentryAnalyticsClient } from './SentryAnalyticsClient.js';

describe('SentryAnalyticsClient', () => {
    // #region Fields

    let client: SentryAnalyticsClient;
    let mockConfigService: { get: ReturnType<typeof vi.fn>; tryGet: ReturnType<typeof vi.fn> };

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.clearAllMocks();

        mockConfigService = {
            get: vi.fn().mockReturnValue('https://sentry.example.com/123'),
            tryGet: vi.fn().mockReturnValue('test'),
        };

        client = new SentryAnalyticsClient(mockConfigService as never);
        client.onModuleInit();
    });

    describe('onModuleInit', () => {
        it('should initialize Sentry with DSN and environment', () => {
            expect(sentryMock.init).toHaveBeenCalledWith({
                dsn: 'https://sentry.example.com/123',
                environment: 'test',
            });
        });
    });

    describe('captureException', () => {
        it('should forward exception to Sentry', () => {
            const error = new Error('something broke');

            client.captureException(error);

            expect(sentryMock.captureException).toHaveBeenCalledWith(error, { extra: undefined });
        });

        it('should forward exception with context to Sentry', () => {
            const error = new Error('something broke');
            const context = { userId: 'user-1' };

            client.captureException(error, context);

            expect(sentryMock.captureException).toHaveBeenCalledWith(error, { extra: context });
        });
    });

    describe('captureMessage', () => {
        it('should forward message to Sentry with mapped level', () => {
            client.captureMessage('test message', 'warning');

            expect(sentryMock.captureMessage).toHaveBeenCalledWith('test message', {
                level: 'warning',
                extra: undefined,
            });
        });

        it('should forward message with context', () => {
            const context = { feature: 'billing' };

            client.captureMessage('payment failed', 'error', context);

            expect(sentryMock.captureMessage).toHaveBeenCalledWith('payment failed', {
                level: 'error',
                extra: context,
            });
        });
    });

    describe('setUser', () => {
        it('should set user context on Sentry', () => {
            const user: IAnalyticsUser = { id: 'user-1', email: 'a@b.com', username: 'alice' };

            client.setUser(user);

            expect(sentryMock.setUser).toHaveBeenCalledWith({
                id: 'user-1',
                email: 'a@b.com',
                username: 'alice',
            });
        });

        it('should spread additional traits', () => {
            const user: IAnalyticsUser = { id: 'user-1', traits: { plan: 'pro', tier: 'enterprise' } };

            client.setUser(user);

            expect(sentryMock.setUser).toHaveBeenCalledWith({
                id: 'user-1',
                email: undefined,
                username: undefined,
                plan: 'pro',
                tier: 'enterprise',
            });
        });
    });

    describe('clearUser', () => {
        it('should clear user on Sentry', () => {
            client.clearUser();

            expect(sentryMock.setUser).toHaveBeenCalledWith(null);
        });
    });

    describe('addBreadcrumb', () => {
        it('should add breadcrumb to Sentry', () => {
            const breadcrumb: IAnalyticsBreadcrumb = {
                category: 'navigation',
                message: 'User navigated to /dashboard',
                level: 'info',
                data: { url: '/dashboard' },
            };

            client.addBreadcrumb(breadcrumb);

            expect(sentryMock.addBreadcrumb).toHaveBeenCalledWith({
                category: 'navigation',
                message: 'User navigated to /dashboard',
                level: 'info',
                data: { url: '/dashboard' },
            });
        });
    });

    // #endregion
});
