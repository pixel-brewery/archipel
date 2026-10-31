// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import * as appInsights from 'applicationinsights';
import { AnalyticsClientBase } from '../abstracts/AnalyticsClientBase.js';
import type { AnalyticsLevel } from '../models/AnalyticsLevel.js';
import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';
import { APPLICATIONINSIGHTS_CONNECTION_STRING } from './env.js';

// #endregion

type ApplicationInsightsSeverityLevel = 'Verbose' | 'Information' | 'Warning' | 'Error' | 'Critical';

/**
 * Azure Application Insights implementation of the {@link AnalyticsClientBase}.
 * Uses the `applicationinsights` SDK for error tracking and analytics.
 *
 * @public
 */
@Injectable()
export class AppInsightsAnalyticsClient extends AnalyticsClientBase implements OnModuleInit, OnModuleDestroy {
    // #region Fields

    private readonly _configService: ConfigService;
    private _client!: appInsights.TelemetryClient;
    private readonly _logger: Logger = new Logger(AppInsightsAnalyticsClient.name);

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();
        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * Initializes the Application Insights SDK.
     *
     * @public
     */
    public onModuleInit(): void {
        appInsights.setup(this._configService.get(APPLICATIONINSIGHTS_CONNECTION_STRING.key)).setAutoCollectExceptions(true).start();

        this._client = appInsights.defaultClient;
        this._logger.log('Application Insights analytics client initialized.');
    }

    /**
     * Flushes pending Application Insights telemetry before shutdown.
     *
     * @public
     */
    public async onModuleDestroy(): Promise<void> {
        await Promise.race([this._client.flush(), new Promise<void>((resolve) => setTimeout(resolve, 5_000))]);
        appInsights.dispose();
    }

    /** @inheritDoc */
    public captureException(error: Error, context?: Record<string, unknown>): void {
        this._client.trackException({
            exception: error,
            properties: this.toStringRecord(context),
        });
    }

    /** @inheritDoc */
    public captureMessage(message: string, level: AnalyticsLevel, context?: Record<string, unknown>): void {
        this._client.trackTrace({
            message,
            severity: this._mapLevel(level),
            properties: this.toStringRecord(context),
        });
    }

    /** @inheritDoc */
    public setUser(user: IAnalyticsUser): void {
        this._client.context.tags[this._client.context.keys.userId] = user.id;

        if (user.username) {
            this._client.context.tags[this._client.context.keys.userAccountId] = user.username;
        }
    }

    /** @inheritDoc */
    public clearUser(): void {
        this._client.context.tags[this._client.context.keys.userId] = '';
        this._client.context.tags[this._client.context.keys.userAccountId] = '';
    }

    /** @inheritDoc */
    public addBreadcrumb(breadcrumb: IAnalyticsBreadcrumb): void {
        this._client.trackEvent({
            name: `breadcrumb.${breadcrumb.category}`,
            properties: {
                message: breadcrumb.message,
                level: breadcrumb.level ?? 'info',
                ...this.toStringRecord(breadcrumb.data),
            },
        });
    }

    // #endregion

    // #region Private Methods

    /**
     * Maps an analytics level to an Application Insights severity level.
     *
     * @private
     */
    private _mapLevel(level: AnalyticsLevel): ApplicationInsightsSeverityLevel {
        const levelMap: Record<AnalyticsLevel, ApplicationInsightsSeverityLevel> = {
            debug: 'Verbose',
            info: 'Information',
            warning: 'Warning',
            error: 'Error',
            fatal: 'Critical',
        };

        return levelMap[level];
    }

    /**
     * Converts a `Record<string, unknown>` to `Record<string, string>` by coercing each value via `String()`.
     * Returns `undefined` when the input is `undefined`.
     *
     * @private
     */
    private toStringRecord(record: Record<string, unknown> | undefined): Record<string, string> | undefined {
        if (!record) {
            return undefined;
        }

        const result: Record<string, string> = {};

        for (const [key, value] of Object.entries(record)) {
            result[key] = String(value);
        }

        return result;
    }

    // #endregion
}
