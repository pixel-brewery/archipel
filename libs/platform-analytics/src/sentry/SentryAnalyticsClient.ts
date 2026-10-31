// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { AnalyticsClientBase } from '../abstracts/AnalyticsClientBase.js';
import type { AnalyticsLevel } from '../models/AnalyticsLevel.js';
import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';
import { SENTRY_DSN, SENTRY_ENVIRONMENT } from './env.js';

// #endregion

/**
 * Sentry implementation of the {@link AnalyticsClientBase}.
 * Uses the official `@sentry/node` SDK for error tracking and analytics.
 *
 * @public
 */
@Injectable()
export class SentryAnalyticsClient extends AnalyticsClientBase implements OnModuleInit, OnModuleDestroy {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(SentryAnalyticsClient.name);

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();
        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * Initializes the Sentry SDK.
     *
     * @public
     */
    public onModuleInit(): void {
        Sentry.init({
            dsn: this._configService.get(SENTRY_DSN.key),
            environment: this._configService.tryGet<string>(SENTRY_ENVIRONMENT.key, 'production'),
        });

        this._logger.log('Sentry analytics client initialized.');
    }

    /**
     * Flushes pending Sentry events before shutdown.
     *
     * @public
     */
    public async onModuleDestroy(): Promise<void> {
        await Promise.race([Sentry.close(5000), new Promise<void>((resolve) => setTimeout(resolve, 5_000))]);
    }

    /** @inheritDoc */
    public captureException(error: Error, context?: Record<string, unknown>): void {
        Sentry.captureException(error, { extra: context });
    }

    /** @inheritDoc */
    public captureMessage(message: string, level: AnalyticsLevel, context?: Record<string, unknown>): void {
        Sentry.captureMessage(message, {
            level: this._mapLevel(level),
            extra: context,
        });
    }

    /** @inheritDoc */
    public setUser(user: IAnalyticsUser): void {
        Sentry.setUser({
            id: user.id,
            email: user.email,
            username: user.username,
            ...user.traits,
        });
    }

    /** @inheritDoc */
    public clearUser(): void {
        Sentry.setUser(null);
    }

    /** @inheritDoc */
    public addBreadcrumb(breadcrumb: IAnalyticsBreadcrumb): void {
        Sentry.addBreadcrumb({
            category: breadcrumb.category,
            message: breadcrumb.message,
            level: breadcrumb.level,
            data: breadcrumb.data,
        });
    }

    // #endregion

    // #region Private Methods

    /**
     * @private
     */
    private _mapLevel(level: AnalyticsLevel): Sentry.SeverityLevel {
        const levelMap: Record<AnalyticsLevel, Sentry.SeverityLevel> = {
            fatal: 'fatal',
            error: 'error',
            warning: 'warning',
            info: 'info',
            debug: 'debug',
        };

        return levelMap[level];
    }

    // #endregion
}
