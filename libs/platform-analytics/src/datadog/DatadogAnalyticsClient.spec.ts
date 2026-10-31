import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSpan = vi.hoisted(() => ({
    setTag: vi.fn(),
}));

const mockTracer = vi.hoisted(() => ({
    init: vi.fn(),
    scope: vi.fn().mockReturnValue({
        active: vi.fn().mockReturnValue(mockSpan),
    }),
}));

vi.mock('dd-trace', () => ({
    default: mockTracer,
    ...mockTracer,
}));

import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';
import { DatadogAnalyticsClient } from './DatadogAnalyticsClient.js';

describe('DatadogAnalyticsClient', () => {
    // #region Fields

    let client: DatadogAnalyticsClient;
    let mockConfigService: { get: ReturnType<typeof vi.fn>; tryGet: ReturnType<typeof vi.fn> };

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.clearAllMocks();

        mockConfigService = {
            get: vi.fn().mockReturnValue('my-service'),
            tryGet: vi.fn().mockReturnValue('test'),
        };

        client = new DatadogAnalyticsClient(mockConfigService as never);
        client.onModuleInit();
    });

    describe('onModuleInit', () => {
        it('should initialize dd-trace with service and env', () => {
            expect(mockTracer.init).toHaveBeenCalledWith({
                service: 'my-service',
                env: 'test',
            });
        });
    });

    describe('captureException', () => {
        it('should tag active span with error details', () => {
            const error = new Error('something broke');

            client.captureException(error);

            expect(mockSpan.setTag).toHaveBeenCalledWith('error', true);
            expect(mockSpan.setTag).toHaveBeenCalledWith('error.message', 'something broke');
        });

        it('should tag context properties on span', () => {
            const error = new Error('fail');
            const context = { feature: 'billing' };

            client.captureException(error, context);

            expect(mockSpan.setTag).toHaveBeenCalledWith('error.context.feature', 'billing');
        });

        it('should apply user tags on span when user is set', () => {
            // arrange
            const user: IAnalyticsUser = { id: 'user-1', email: 'a@b.com', username: 'alice' };
            client.setUser(user);
            vi.clearAllMocks();
            mockTracer.scope.mockReturnValue({ active: vi.fn().mockReturnValue(mockSpan) });

            // act
            client.captureException(new Error('fail'));

            // assert
            expect(mockSpan.setTag).toHaveBeenCalledWith('usr.id', 'user-1');
            expect(mockSpan.setTag).toHaveBeenCalledWith('usr.email', 'a@b.com');
            expect(mockSpan.setTag).toHaveBeenCalledWith('usr.name', 'alice');
        });

        it('should not apply user tags on span when user is cleared', () => {
            // arrange
            client.setUser({ id: 'user-1' });
            client.clearUser();
            vi.clearAllMocks();
            mockTracer.scope.mockReturnValue({ active: vi.fn().mockReturnValue(mockSpan) });

            // act
            client.captureException(new Error('fail'));

            // assert
            expect(mockSpan.setTag).not.toHaveBeenCalledWith('usr.id', expect.anything());
        });

        it('should log a warning when no active span exists', () => {
            // arrange
            mockTracer.scope.mockReturnValueOnce({ active: vi.fn().mockReturnValue(null) });
            const warnSpy = vi.spyOn(client['_logger'], 'warn');

            // act
            client.captureException(new Error('test'));

            // assert
            expect(warnSpy).toHaveBeenCalledWith('No active span available for exception tracking.');
        });

        it('should not throw when no active span exists', () => {
            mockTracer.scope.mockReturnValueOnce({ active: vi.fn().mockReturnValue(null) });

            expect(() => client.captureException(new Error('test'))).not.toThrow();
        });
    });

    describe('captureMessage', () => {
        it('should tag active span with message and level', () => {
            client.captureMessage('hello', 'info');

            expect(mockSpan.setTag).toHaveBeenCalledWith('analytics.message', 'hello');
            expect(mockSpan.setTag).toHaveBeenCalledWith('analytics.level', 'info');
        });

        it('should tag context on span', () => {
            client.captureMessage('msg', 'warning', { key: 'value' });

            expect(mockSpan.setTag).toHaveBeenCalledWith('analytics.context.key', 'value');
        });

        it('should apply user tags on span when user is set', () => {
            // arrange
            const user: IAnalyticsUser = { id: 'u-2', email: 'b@c.com' };
            client.setUser(user);
            vi.clearAllMocks();
            mockTracer.scope.mockReturnValue({ active: vi.fn().mockReturnValue(mockSpan) });

            // act
            client.captureMessage('msg', 'info');

            // assert
            expect(mockSpan.setTag).toHaveBeenCalledWith('usr.id', 'u-2');
            expect(mockSpan.setTag).toHaveBeenCalledWith('usr.email', 'b@c.com');
        });

        it('should log a warning when no active span exists', () => {
            // arrange
            mockTracer.scope.mockReturnValueOnce({ active: vi.fn().mockReturnValue(null) });
            const warnSpy = vi.spyOn(client['_logger'], 'warn');

            // act
            client.captureMessage('msg', 'info');

            // assert
            expect(warnSpy).toHaveBeenCalledWith('No active span available for message tracking.');
        });

        it('should log at error level for error analytics level', () => {
            // arrange
            const errorSpy = vi.spyOn(client['_logger'], 'error');

            // act
            client.captureMessage('something broke', 'error');

            // assert
            expect(errorSpy).toHaveBeenCalledWith('something broke', undefined);
        });

        it('should log at warn level for warning analytics level', () => {
            // arrange
            const warnSpy = vi.spyOn(client['_logger'], 'warn');

            // act
            client.captureMessage('something concerning', 'warning');

            // assert
            expect(warnSpy).toHaveBeenCalledWith('something concerning', undefined);
        });
    });

    describe('setUser', () => {
        it('should set user tags on active span', () => {
            const user: IAnalyticsUser = { id: 'user-1', email: 'a@b.com', username: 'alice' };

            client.setUser(user);

            expect(mockSpan.setTag).toHaveBeenCalledWith('usr.id', 'user-1');
            expect(mockSpan.setTag).toHaveBeenCalledWith('usr.email', 'a@b.com');
            expect(mockSpan.setTag).toHaveBeenCalledWith('usr.name', 'alice');
        });
    });

    describe('clearUser', () => {
        it('should not throw', () => {
            expect(() => client.clearUser()).not.toThrow();
        });
    });

    describe('addBreadcrumb', () => {
        it('should tag breadcrumb on active span', () => {
            const breadcrumb: IAnalyticsBreadcrumb = {
                category: 'navigation',
                message: 'clicked link',
            };

            client.addBreadcrumb(breadcrumb);

            expect(mockSpan.setTag).toHaveBeenCalledWith('breadcrumb.navigation', 'clicked link');
        });

        it('should log a warning when no active span exists', () => {
            // arrange
            mockTracer.scope.mockReturnValueOnce({ active: vi.fn().mockReturnValue(null) });
            const warnSpy = vi.spyOn(client['_logger'], 'warn');

            // act
            client.addBreadcrumb({ category: 'test', message: 'test' });

            // assert
            expect(warnSpy).toHaveBeenCalledWith('No active span available for breadcrumb tracking.');
        });
    });

    // #endregion
});
