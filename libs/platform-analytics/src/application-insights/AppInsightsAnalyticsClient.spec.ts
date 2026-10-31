import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockClient = vi.hoisted(() => ({
    trackException: vi.fn(),
    trackTrace: vi.fn(),
    trackEvent: vi.fn(),
    context: {
        tags: {} as Record<string, string>,
        keys: {
            userId: 'ai.user.id',
            userAccountId: 'ai.user.accountId',
        },
    },
}));

const mockSetup = vi.hoisted(() =>
    vi.fn().mockReturnValue({
        setAutoCollectExceptions: vi.fn().mockReturnValue({
            start: vi.fn(),
        }),
    }),
);

vi.mock('applicationinsights', () => ({
    default: {
        setup: mockSetup,
        defaultClient: mockClient,
    },
    setup: mockSetup,
    defaultClient: mockClient,
}));

import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';
import { AppInsightsAnalyticsClient } from './AppInsightsAnalyticsClient.js';

describe('AppInsightsAnalyticsClient', () => {
    // #region Fields

    let client: AppInsightsAnalyticsClient;
    let mockConfigService: { get: ReturnType<typeof vi.fn>; tryGet: ReturnType<typeof vi.fn> };

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.clearAllMocks();
        mockClient.context.tags = {};

        mockConfigService = {
            get: vi.fn().mockReturnValue('InstrumentationKey=test-key'),
            tryGet: vi.fn().mockReturnValue('test'),
        };

        client = new AppInsightsAnalyticsClient(mockConfigService as never);
        client.onModuleInit();
    });

    describe('onModuleInit', () => {
        it('should initialize Application Insights with connection string', () => {
            expect(mockSetup).toHaveBeenCalledWith('InstrumentationKey=test-key');
        });
    });

    describe('captureException', () => {
        it('should track exception via client', () => {
            const error = new Error('something broke');

            client.captureException(error);

            expect(mockClient.trackException).toHaveBeenCalledWith({
                exception: error,
                properties: undefined,
            });
        });

        it('should track exception with context', () => {
            const error = new Error('something broke');
            const context = { userId: 'user-1' };

            client.captureException(error, context);

            expect(mockClient.trackException).toHaveBeenCalledWith({
                exception: error,
                properties: context,
            });
        });
    });

    describe('captureMessage', () => {
        it('should track trace with mapped severity', () => {
            client.captureMessage('test message', 'warning');

            expect(mockClient.trackTrace).toHaveBeenCalledWith({
                message: 'test message',
                severity: 'Warning',
                properties: undefined,
            });
        });

        it('should map all severity levels correctly', () => {
            const levels: Array<[string, string]> = [
                ['debug', 'Verbose'],
                ['info', 'Information'],
                ['warning', 'Warning'],
                ['error', 'Error'],
                ['fatal', 'Critical'],
            ];

            for (const [level, expected] of levels) {
                vi.clearAllMocks();
                client.captureMessage('msg', level as never);

                expect(mockClient.trackTrace).toHaveBeenCalledWith(expect.objectContaining({ severity: expected }));
            }
        });
    });

    describe('setUser', () => {
        it('should set user id on context tags', () => {
            const user: IAnalyticsUser = { id: 'user-1' };

            client.setUser(user);

            expect(mockClient.context.tags['ai.user.id']).toBe('user-1');
        });

        it('should set username when provided', () => {
            const user: IAnalyticsUser = { id: 'user-1', username: 'alice' };

            client.setUser(user);

            expect(mockClient.context.tags['ai.user.accountId']).toBe('alice');
        });
    });

    describe('clearUser', () => {
        it('should clear user tags', () => {
            mockClient.context.tags['ai.user.id'] = 'user-1';
            mockClient.context.tags['ai.user.accountId'] = 'alice';

            client.clearUser();

            expect(mockClient.context.tags['ai.user.id']).toBe('');
            expect(mockClient.context.tags['ai.user.accountId']).toBe('');
        });
    });

    describe('addBreadcrumb', () => {
        it('should track breadcrumb as event', () => {
            const breadcrumb: IAnalyticsBreadcrumb = {
                category: 'navigation',
                message: 'clicked link',
                level: 'info',
            };

            client.addBreadcrumb(breadcrumb);

            expect(mockClient.trackEvent).toHaveBeenCalledWith({
                name: 'breadcrumb.navigation',
                properties: {
                    message: 'clicked link',
                    level: 'info',
                },
            });
        });
    });

    // #endregion
});
