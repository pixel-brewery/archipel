// #region Imports

import { Injectable } from '@nestjs/common';
import { AnalyticsClientBase } from '../abstracts/AnalyticsClientBase.js';
import type { AnalyticsLevel } from '../models/AnalyticsLevel.js';
import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';

// #endregion

/**
 * No-op implementation of the {@link AnalyticsClientBase}.
 * Suitable for development, testing, or environments where analytics is disabled.
 *
 * @public
 */
@Injectable()
export class NoopAnalyticsClient extends AnalyticsClientBase {
    // #region Methods

    /** @inheritDoc */
    public captureException(_error: Error, _context?: Record<string, unknown>): void {
        // No-op
    }

    /** @inheritDoc */
    public captureMessage(_message: string, _level: AnalyticsLevel, _context?: Record<string, unknown>): void {
        // No-op
    }

    /** @inheritDoc */
    public setUser(_user: IAnalyticsUser): void {
        // No-op
    }

    /** @inheritDoc */
    public clearUser(): void {
        // No-op
    }

    /** @inheritDoc */
    public addBreadcrumb(_breadcrumb: IAnalyticsBreadcrumb): void {
        // No-op
    }

    // #endregion
}
