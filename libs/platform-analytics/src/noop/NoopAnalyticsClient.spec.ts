import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NoopAnalyticsClient } from './NoopAnalyticsClient.js';
import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';

describe('NoopAnalyticsClient', () => {
    // #region Fields

    let client: NoopAnalyticsClient;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        client = new NoopAnalyticsClient();
    });

    it('should not throw when capturing an exception', () => {
        expect(() => client.captureException(new Error('test'))).not.toThrow();
    });

    it('should not throw when capturing an exception with context', () => {
        expect(() => client.captureException(new Error('test'), { key: 'value' })).not.toThrow();
    });

    it('should not throw when capturing a message', () => {
        expect(() => client.captureMessage('hello', 'info')).not.toThrow();
    });

    it('should not throw when capturing a message with context', () => {
        expect(() => client.captureMessage('hello', 'error', { key: 'value' })).not.toThrow();
    });

    it('should not throw when setting user', () => {
        const user: IAnalyticsUser = { id: 'user-1', email: 'a@b.com' };
        expect(() => client.setUser(user)).not.toThrow();
    });

    it('should not throw when clearing user', () => {
        expect(() => client.clearUser()).not.toThrow();
    });

    it('should not throw when adding a breadcrumb', () => {
        const breadcrumb: IAnalyticsBreadcrumb = { category: 'navigation', message: 'clicked' };
        expect(() => client.addBreadcrumb(breadcrumb)).not.toThrow();
    });

    // #endregion
});
