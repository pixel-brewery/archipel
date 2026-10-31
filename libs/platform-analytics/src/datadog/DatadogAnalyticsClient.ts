// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import tracer from 'dd-trace';
import { AnalyticsClientBase } from '../abstracts/AnalyticsClientBase.js';
import type { AnalyticsLevel } from '../models/AnalyticsLevel.js';
import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';
import { DD_ENV, DD_SERVICE } from './env.js';

// #endregion

/**
 * Datadog implementation of the {@link AnalyticsClientBase}.
 * Uses the `dd-trace` SDK for error tracking and analytics.
 *
 * @public
 */
@Injectable()
export class DatadogAnalyticsClient extends AnalyticsClientBase implements OnModuleInit {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _tracer: typeof tracer;
    private readonly _logger: Logger = new Logger(DatadogAnalyticsClient.name);
    private _currentUser: IAnalyticsUser | null = null;

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();

        this._configService = configService;
        this._tracer = tracer;
    }

    // #endregion

    // #region Methods

    /**
     * Initializes the Datadog tracer SDK.
     *
     * @public
     */
    public onModuleInit(): void {
        this._tracer.init({
            service: this._configService.get(DD_SERVICE.key),
            env: this._configService.tryGet<string>(DD_ENV.key, 'production'),
        });

        this._logger.log('Datadog analytics client initialized.');
    }

    /** @inheritDoc */
    public captureException(error: Error, context?: Record<string, unknown>): void {
        const span = this._tracer.scope().active();

        if (span) {
            span.setTag('error', true);
            span.setTag('error.message', error.message);
            span.setTag('error.stack', error.stack ?? '');
            this.applyUserTags(span);

            if (context) {
                for (const [key, value] of Object.entries(context)) {
                    span.setTag(`error.context.${key}`, String(value));
                }
            }
        } else {
            this._logger.warn('No active span available for exception tracking.');
        }

        this._logger.error(`Exception captured: ${error.message}`, {
            error: error.message,
            ...context,
        });
    }

    /** @inheritDoc */
    public captureMessage(message: string, level: AnalyticsLevel, context?: Record<string, unknown>): void {
        const span = this._tracer.scope().active();

        if (span) {
            span.setTag('analytics.message', message);
            span.setTag('analytics.level', level);
            this.applyUserTags(span);

            if (context) {
                for (const [key, value] of Object.entries(context)) {
                    span.setTag(`analytics.context.${key}`, String(value));
                }
            }
        } else {
            this._logger.warn('No active span available for message tracking.');
        }

        this.logAtLevel(level, message, context);
    }

    /** @inheritDoc */
    public setUser(user: IAnalyticsUser): void {
        this._currentUser = user;

        const span = this._tracer.scope().active();

        if (span) {
            span.setTag('usr.id', user.id);

            if (user.email) {
                span.setTag('usr.email', user.email);
            }

            if (user.username) {
                span.setTag('usr.name', user.username);
            }
        }
    }

    /** @inheritDoc */
    public clearUser(): void {
        this._currentUser = null;
    }

    /** @inheritDoc */
    public addBreadcrumb(breadcrumb: IAnalyticsBreadcrumb): void {
        const span = this._tracer.scope().active();

        if (span) {
            span.setTag(`breadcrumb.${breadcrumb.category}`, breadcrumb.message);
        } else {
            this._logger.warn('No active span available for breadcrumb tracking.');
        }
    }

    // #endregion

    // #region Private Methods

    /**
     * Applies the current user context as tags to the given span.
     *
     * @private
     * @param span - The active Datadog span to tag.
     */
    private applyUserTags(span: ReturnType<ReturnType<typeof tracer.scope>['active']>): void {
        if (!this._currentUser) {
            return;
        }

        span?.setTag('usr.id', this._currentUser.id);

        if (this._currentUser.email) {
            span?.setTag('usr.email', this._currentUser.email);
        }

        if (this._currentUser.username) {
            span?.setTag('usr.name', this._currentUser.username);
        }
    }

    /**
     * Logs a message at the appropriate NestJS logger level based on the analytics level.
     *
     * @private
     * @param level - The analytics severity level.
     * @param message - The message to log.
     * @param context - Optional additional context.
     */
    private logAtLevel(level: AnalyticsLevel, message: string, context?: Record<string, unknown>): void {
        switch (level) {
            case 'fatal':
            case 'error':
                this._logger.error(message, context);
                break;
            case 'warning':
                this._logger.warn(message, context);
                break;
            case 'debug':
                this._logger.debug?.(message, context);
                break;
            default:
                this._logger.log(message, context);
                break;
        }
    }

    // #endregion
}
